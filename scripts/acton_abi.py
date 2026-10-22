"""Compare Acton's compiler ABI to the preserved QUASAR public ABI.

Wire types and TVM stack types are deliberately normalized separately. Native
addr_none is compatible with the existing address encoding, not with Maybe ^Cell.
This is an interface gate, not a proof of storage or behavioral equivalence.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

CONTRACTS = {
    "QuasarWallet": "quasar-wallet.json",
    "QuasarMaster": "quasar-master.json",
    "QuasarDeFi": "quasar-defi.json",
    "QuasarAdminTimelock": "quasar-admin-timelock.json",
}

TACT_ARTIFACTS = {
    "QuasarWallet": "quasar_QuasarWallet.abi",
    "QuasarMaster": "quasar_QuasarMaster.abi",
    "QuasarDeFi": "quasar_defi_QuasarDeFi.abi",
    "QuasarAdminTimelock": "quasar_admin_QuasarAdminTimelock.abi",
}


def tact_type(t: dict, *, stack: bool = False) -> dict:
    if t.get("kind") != "simple":
        raise ValueError(f"Unsupported Tact type: {t}")
    name, fmt = t["type"], t.get("format")
    if name in ("int", "uint"):
        kind = "int" if stack else ("coins" if fmt == "coins" else f"{name}{fmt or 257}")
    elif name == "fixed-bytes":
        kind = "slice" if stack else f"bits{fmt * 8}"
    elif name == "slice" and fmt == "remainder":
        kind = "slice" if stack else "remaining"
    else:
        kind = name
    return {"type": kind, "optional": bool(t.get("optional", False))}


def tolk_type(abi: dict, idx: int, *, stack: bool = False, seen: frozenset = frozenset()) -> dict:
    if idx in seen:
        raise ValueError(f"Recursive ABI alias at type {idx}")
    t = abi["unique_types"][idx]
    kind = t["kind"]
    if kind == "nullable":
        result = tolk_type(abi, t["inner_ty_idx"], stack=stack, seen=seen | {idx})
        return {**result, "optional": True}
    if kind == "AliasRef":
        declaration = next(d for d in abi["declarations"] if d["name"] == t["alias_name"])
        return tolk_type(abi, declaration["target_ty_idx"], stack=stack, seen=seen | {idx})
    if kind == "StructRef":
        kind = t["struct_name"]
    elif kind in ("intN", "uintN", "bitsN"):
        kind = ("slice" if kind == "bitsN" else "int") if stack else f"{kind[:-1]}{t['n']}"
    elif kind == "coins" and stack:
        kind = "int"
    elif kind in ("addressOpt", "addressAny"):
        # MsgAddress uses addr_none directly, without an extra presence bit.
        kind = "address"
    elif kind == "remaining":
        kind = "slice" if stack else "remaining"
    elif kind == "cellOf":
        kind = "cell"
    return {"type": kind, "optional": False}


def compare_abi(reference: dict, abi: dict) -> list[str]:
    errors: list[str] = []
    if abi.get("abi_schema_version") != "1.0" or abi.get("compiler_name") != "tolk":
        return ["Unsupported compiler ABI schema or compiler"]
    if abi.get("contract_name") != reference["contract"]:
        errors.append("Contract name differs")
    structs = {d["ty_idx"]: d for d in abi["declarations"] if d["kind"] == "struct"}
    actual = {}
    for receiver in abi["incoming_messages"]:
        idx = receiver["body_ty_idx"]
        if idx not in structs:
            errors.append(f"Unsupported incoming body type {idx}")
            continue
        d = structs[idx]
        prefix = d.get("prefix", {})
        if prefix.get("prefix_len") != 32:
            errors.append(f"{d['name']}: opcode must be 32 bits")
        actual[d["name"]] = {
            "opcode": f"0x{prefix.get('prefix_num', 0):08x}",
            "fields": [(f["name"], tolk_type(abi, f["ty_idx"])) for f in d["fields"]],
        }
    expected = {m["name"]: {
        "opcode": m["opcode"],
        "fields": [(f["name"], tact_type(f["type"])) for f in m["fields"]],
    } for m in reference["messages"]}
    for name in sorted(expected.keys() | actual.keys()):
        if expected.get(name) != actual.get(name):
            errors.append(f"message {name}: expected {expected.get(name)!r}, got {actual.get(name)!r}")
    # Text receivers are handled manually in QUASAR, not represented in compiler ABI.
    # The local scripts and regression tests exercise those separately.
    if abi.get("incoming_external"):
        errors.append("Unexpected external-in receivers")
    getters = {g["name"]: g for g in abi["get_methods"]}
    expected_getters = {g["name"]: g for g in reference["getters"]}
    for name in sorted(expected_getters.keys() | getters.keys()):
        if name not in getters or name not in expected_getters:
            errors.append(f"getter {name}: missing or unexpected")
            continue
        g, r = getters[name], expected_getters[name]
        wanted = (r["methodId"], [(f["name"], tact_type(f["type"], stack=True)) for f in r["arguments"]], tact_type(r["returns"], stack=True))
        got = (g["tvm_method_id"], [(f["name"], tolk_type(abi, f["ty_idx"], stack=True)) for f in g["parameters"]], tolk_type(abi, g["return_ty_idx"], stack=True))
        if wanted != got:
            errors.append(f"getter {name}: expected {wanted!r}, got {got!r}")
    return errors


def compare_getter_layouts(tact_abi: dict, abi: dict) -> list[str]:
    """Check named return structures, whose fields are absent from snapshots."""
    expected = {d["name"]: d for d in tact_abi["types"]}
    actual = {d["name"]: d for d in abi["declarations"] if d["kind"] == "struct"}
    pending = [g["returnType"]["type"] for g in tact_abi["getters"]]
    visited = set()
    errors = []
    while pending:
        name = pending.pop()
        if name not in expected or name in visited:
            continue
        visited.add(name)
        wanted = [(f["name"], tact_type(f["type"], stack=True)) for f in expected[name]["fields"]]
        got = [(f["name"], tolk_type(abi, f["ty_idx"], stack=True)) for f in actual.get(name, {}).get("fields", [])]
        if name not in actual or wanted != got:
            errors.append(f"getter return struct {name}: expected {wanted!r}, got {got!r}")
        pending.extend(f["type"]["type"] for f in expected[name]["fields"])
    return errors


def verify(root: Path, abi_dir: Path | None = None) -> dict:
    summary = {}
    failures = []
    for contract, filename in CONTRACTS.items():
        reference = json.loads((root / "docs/abi" / filename).read_text())
        abi = json.loads(((abi_dir or root / "tolk/build/synchronized/abi") / f"{contract}.json").read_text())
        errors = compare_abi(reference, abi)
        tact_abi = json.loads((root / "build" / TACT_ARTIFACTS[contract]).read_text())
        errors.extend(compare_getter_layouts(tact_abi, abi))
        failures.extend(f"{contract}: {error}" for error in errors)
        summary[contract] = {"messages": len(reference["messages"]), "getters": len(reference["getters"])}
    if failures:
        raise ValueError("ABI conformance failed:\n" + "\n".join(failures))
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        print(json.dumps(verify(args.root), indent=2))
        return 0
    except (OSError, ValueError, KeyError, StopIteration, IndexError) as error:
        print(str(error))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

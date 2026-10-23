#!/usr/bin/env python3
"""Create and verify compiler-neutral QUASAR public ABI snapshots from Tolk.

The snapshot is derived exclusively from the Acton/Tolk compiler ABI.  It is an
interface gate for a fresh Tolk deployment generation; it does not claim that
Tolk storage, code hashes, addresses, gas, or action traces match legacy Tact
contracts.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
ABI_DIR = ROOT / "tolk" / "build" / "synchronized" / "abi"
SNAPSHOT_DIR = ROOT / "docs" / "abi"
CONTRACTS = {
    "QuasarWallet": "quasar-wallet.json",
    "QuasarMaster": "quasar-master.json",
    "QuasarDeFi": "quasar-defi.json",
    "QuasarAdminTimelock": "quasar-admin-timelock.json",
}


def type_shape(abi: dict[str, Any], index: int, seen: frozenset[int] = frozenset()) -> dict[str, Any]:
    """Return a stable, compiler-neutral representation of a Tolk ABI type."""
    if index in seen:
        raise ValueError(f"recursive ABI type at index {index}")
    try:
        value = abi["unique_types"][index]
    except (IndexError, KeyError) as error:
        raise ValueError(f"invalid ABI type index {index}") from error

    kind = value["kind"]
    if kind == "nullable":
        inner = type_shape(abi, value["inner_ty_idx"], seen | {index})
        return {**inner, "optional": True}
    if kind == "AliasRef":
        declaration = next(
            item for item in abi["declarations"] if item.get("name") == value["alias_name"]
        )
        return type_shape(abi, declaration["target_ty_idx"], seen | {index})
    if kind == "StructRef":
        return {"type": f"struct:{value['struct_name']}", "optional": False}
    if kind in {"intN", "uintN", "bitsN"}:
        prefix = {"intN": "int", "uintN": "uint", "bitsN": "bits"}[kind]
        return {"type": f"{prefix}{value['n']}", "optional": False}
    if kind == "cellOf":
        return {"type": "cell", "optional": False}
    if kind in {"addressOpt", "addressAny"}:
        return {"type": "address", "optional": kind == "addressOpt"}
    return {"type": kind, "optional": False}


def declaration_map(abi: dict[str, Any]) -> dict[int, dict[str, Any]]:
    return {
        item["ty_idx"]: item
        for item in abi["declarations"]
        if item.get("kind") == "struct" and "ty_idx" in item
    }


def create_snapshot(abi: dict[str, Any]) -> dict[str, Any]:
    if abi.get("abi_schema_version") != "1.0" or abi.get("compiler_name") != "tolk":
        raise ValueError("unsupported compiler ABI: expected Tolk schema 1.0")
    structs = declaration_map(abi)
    messages = []
    for receiver in abi.get("incoming_messages", []):
        declaration = structs.get(receiver.get("body_ty_idx"))
        if not declaration:
            raise ValueError(f"unsupported incoming message declaration: {receiver!r}")
        prefix = declaration.get("prefix", {})
        if prefix.get("prefix_len") != 32:
            raise ValueError(f"{declaration['name']}: incoming message must have a 32-bit opcode")
        messages.append({
            "name": declaration["name"],
            "opcode": f"0x{prefix['prefix_num']:08x}",
            "fields": [
                {"name": field["name"], "type": type_shape(abi, field["ty_idx"])}
                for field in declaration.get("fields", [])
            ],
        })
    getters = []
    for getter in abi.get("get_methods", []):
        getters.append({
            "name": getter["name"],
            "methodId": getter["tvm_method_id"],
            "arguments": [
                {"name": field["name"], "type": type_shape(abi, field["ty_idx"])}
                for field in getter.get("parameters", [])
            ],
            "returns": type_shape(abi, getter["return_ty_idx"]),
        })
    return {
        "schemaVersion": 2,
        "compiler": {
            "name": abi["compiler_name"],
            "version": abi["compiler_version"],
        },
        "contract": abi["contract_name"],
        "messages": sorted(messages, key=lambda item: item["name"]),
        "getters": sorted(getters, key=lambda item: item["name"]),
    }


def verify(root: Path = ROOT, abi_dir: Path | None = None, update: bool = False) -> dict[str, dict[str, int]]:
    resolved_abi_dir = abi_dir or root / "tolk" / "build" / "synchronized" / "abi"
    snapshot_dir = root / "docs" / "abi"
    summary: dict[str, dict[str, int]] = {}
    failures: list[str] = []
    for contract, filename in CONTRACTS.items():
        actual = create_snapshot(json.loads((resolved_abi_dir / f"{contract}.json").read_text()))
        snapshot_path = snapshot_dir / filename
        if update:
            snapshot_path.write_text(json.dumps(actual, indent=2, sort_keys=True) + "\n")
        else:
            expected = json.loads(snapshot_path.read_text())
            if actual != expected:
                failures.append(
                    f"{contract}: ABI snapshot differs; run `npm run abi:update` and review the diff"
                )
        summary[contract] = {"messages": len(actual["messages"]), "getters": len(actual["getters"])}
    if failures:
        raise ValueError("ABI conformance failed:\n" + "\n".join(failures))
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--abi-dir", type=Path)
    parser.add_argument("--update", action="store_true", help="replace reviewed snapshots from Tolk ABI")
    args = parser.parse_args()
    try:
        print(json.dumps(verify(args.root, args.abi_dir, args.update), indent=2))
        return 0
    except (OSError, ValueError, KeyError, IndexError, StopIteration, TypeError) as error:
        print(str(error))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

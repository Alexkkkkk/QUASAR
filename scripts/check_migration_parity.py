#!/usr/bin/env python3
"""Compare the archived Tact compiler ABI with canonical Tolk ABI snapshots.

The historical ABI snapshots are evidence generated from the pre-migration git
parent; the checker itself never invokes Tact or compiles archived source.
"""
from __future__ import annotations

import json
import ast
import re
import sys
from decimal import Decimal
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / "docs" / "historical" / "tact-reference" / "abi"
CURRENT = ROOT / "docs" / "abi"
PAIRS = {
    "Master": ("quasar_QuasarMaster.abi.json", "quasar-master.json"),
    "DeFi": ("quasar_defi_QuasarDeFi.abi.json", "quasar-defi.json"),
    "Wallet": ("quasar_QuasarWallet.abi.json", "quasar-wallet.json"),
    "AdminTimelock": ("quasar_admin_QuasarAdminTimelock.abi.json", "quasar-admin-timelock.json"),
}
# These five fields deliberately broaden Tact's internal-address-only type to
# Tolk's MsgAddress-compatible nullable address, allowing the standard addr_none
# sentinel required by the TEP-74/89 reply and no-response paths. They keep the
# same TL-B MsgAddress wire encoding for all historical internal addresses.
NULLABLE_ADDRESS_WIDENINGS = {
    ("Master", "BurnNotification", "responseDestination"),
    ("Wallet", "TokenTransfer", "responseDestination"),
    ("Wallet", "TokenBurn", "responseDestination"),
    ("Wallet", "InternalTransfer", "responseDestination"),
    ("Wallet", "PoolPayout", "responseDestination"),
}
# Schema 3 distinguishes any_address from internal address. These existing
# TEP-89 query fields accept addr_none/unsupported owners and return addr_none;
# no other address field may silently broaden to an arbitrary MsgAddress.
ANY_ADDRESS_WIDENINGS = {
    ("Master", "ProvideWalletAddress", "ownerAddress"),
    ("Wallet", "ProvideWalletAddress", "ownerAddress"),
}
CONSTANT_SOURCES = {
    "legacy": [
        ROOT / "docs/historical/tact-reference/contracts/quasar_common.tact",
        ROOT / "docs/historical/tact-reference/contracts/quasar.tact",
        ROOT / "docs/historical/tact-reference/contracts/quasar_admin.tact",
    ],
    "tolk": [
        ROOT / "tolk/contracts/QuasarCommon.tolk",
        ROOT / "tolk/contracts/QuasarMaster.tolk",
        ROOT / "tolk/contracts/QuasarAdminTimelock.tolk",
    ],
}
TEXT_DISPATCH_SOURCES = {
    "Master": ROOT / "tolk/contracts/QuasarMaster.tolk",
    "DeFi": ROOT / "tolk/contracts/QuasarDeFi.tolk",
}


def load(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load ABI {path.relative_to(ROOT)}: {exc}") from exc


def canonical_type(type_data: dict[str, Any], legacy: bool) -> str:
    if legacy:
        if type_data.get("kind") != "simple":
            return f"{type_data.get('kind')}:{type_data.get('type')}"
        name, fmt = type_data.get("type"), type_data.get("format")
        if fmt == "coins":
            return "coins"
        if name in ("uint", "int") and isinstance(fmt, int):
            return name if fmt == 257 else f"{name}{fmt}"
        if name == "fixed-bytes" and isinstance(fmt, int):
            return f"bits{fmt * 8}"
        if name == "slice" and fmt == "remainder":
            return "remaining"
        if name not in {"address", "bool", "cell", "slice", "string", "int", "uint", "fixed-bytes"}:
            return f"struct:{str(name).casefold()}"
        return str(name)

    name = str(type_data.get("type", "unknown"))
    if name.startswith("struct:") or name.startswith("enum:"):
        prefix, type_name = name.split(":", 1)
        return f"{prefix}:{type_name.casefold()}"
    if name == "remaining":
        return "remaining"
    if name == "bits512":
        return "bits512"
    if name == "int257":
        return "int"
    return name


def optional(type_data: dict[str, Any]) -> bool:
    return bool(type_data.get("optional", False))


def old_incoming(abi: dict[str, Any]) -> dict[str, dict[str, Any]]:
    types = {item["name"]: item for item in abi.get("types", [])}
    names = {
        item["message"]["type"]
        for item in abi.get("receivers", [])
        if item.get("receiver") == "internal" and item.get("message", {}).get("kind") == "typed"
    }
    return {name: types[name] for name in names if name in types}


def signature_fields(fields: list[dict[str, Any]], legacy: bool) -> list[tuple[str, str, bool]]:
    return [
        (field["name"], canonical_type(field["type"], legacy), optional(field["type"]))
        for field in fields
    ]


def eval_integer_expr(expr: str, values: dict[str, int]) -> int:
    """Evaluate the small integer-only grammar used by these protocol constants."""
    expr = re.sub(
        r"(?:ton|grams)\(\s*\"([0-9]+(?:\.[0-9]+)?)\"\s*\)",
        lambda match: str(int(Decimal(match.group(1)) * Decimal(1_000_000_000))),
        expr,
    )

    def visit(node: ast.AST) -> int:
        if isinstance(node, ast.Expression):
            return visit(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, int):
            return node.value
        if isinstance(node, ast.Name) and node.id in values:
            return values[node.id]
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
            number = visit(node.operand)
            return -number if isinstance(node.op, ast.USub) else number
        if isinstance(node, ast.BinOp):
            left, right = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Add):
                return left + right
            if isinstance(node.op, ast.Sub):
                return left - right
            if isinstance(node.op, ast.Mult):
                return left * right
            if isinstance(node.op, (ast.Div, ast.FloorDiv)):
                if right == 0 or left % right:
                    raise ValueError("non-integral division")
                return left // right
            if isinstance(node.op, ast.LShift):
                return left << right
        raise ValueError(f"unsupported integer expression: {expr}")

    return visit(ast.parse(expr, mode="eval"))


def numeric_constants(paths: list[Path], legacy: bool) -> dict[str, int]:
    assignments: list[tuple[str, str]] = []
    pattern = (
        re.compile(r"^\s*const\s+(\w+)\s*:\s*[^=]+\s*=\s*(.+?);\s*$")
        if legacy
        else re.compile(r"^\s*const\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*(.+?)\s*$")
    )
    for path in paths:
        for line in path.read_text().splitlines():
            match = pattern.match(line)
            if match:
                assignments.append((match.group(1), match.group(2).rstrip(";")))
    values: dict[str, int] = {}
    pending = assignments[:]
    while pending:
        remaining = []
        progressed = False
        for name, expr in pending:
            try:
                values[name] = eval_integer_expr(expr.strip(), values)
                progressed = True
            except (ValueError, SyntaxError, ZeroDivisionError):
                remaining.append((name, expr))
        if not progressed:
            break
        pending = remaining
    return values


def check_constants() -> list[str]:
    legacy = numeric_constants(CONSTANT_SOURCES["legacy"], legacy=True)
    tolk = numeric_constants(CONSTANT_SOURCES["tolk"], legacy=False)
    errors = []
    for name in sorted(legacy.keys() & tolk.keys()):
        if legacy[name] != tolk[name]:
            errors.append(
                f"constant {name} changed: legacy={legacy[name]} Tolk={tolk[name]}"
            )
    return errors


def check_text_receivers(label: str, old_abi: dict[str, Any]) -> tuple[list[str], int]:
    source_path = TEXT_DISPATCH_SOURCES.get(label)
    if source_path is None:
        return [], 0
    source = source_path.read_text().lower()
    messages = [
        item["message"]["text"]
        for item in old_abi.get("receivers", [])
        if item.get("receiver") == "internal"
        and item.get("message", {}).get("kind") == "text"
    ]
    errors = []
    for text in messages:
        payload_hex = "0x" + text.encode("utf-8").hex()
        if payload_hex not in source:
            errors.append(f"{label}: legacy text receiver payload missing: {text!r}")
    return errors, len(messages)


def check_contract(label: str, old: dict[str, Any], new: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    old_msgs = old_incoming(old)
    new_msgs = {item["name"]: item for item in new.get("messages", [])}
    old_ci = {name.casefold(): name for name in old_msgs}
    new_ci = {name.casefold(): name for name in new_msgs}

    for key in sorted(old_ci.keys() - new_ci.keys()):
        errors.append(f"{label}: Tolk is missing incoming message {old_ci[key]}")
    for key in sorted(new_ci.keys() - old_ci.keys()):
        errors.append(f"{label}: unexpected typed Tolk receiver {new_ci[key]}")

    for key in sorted(old_ci.keys() & new_ci.keys()):
        old_name, new_name = old_ci[key], new_ci[key]
        old_msg, new_msg = old_msgs[old_name], new_msgs[new_name]
        old_opcode = old_msg.get("header")
        if isinstance(old_opcode, str):
            old_opcode = int(old_opcode, 0)
        new_opcode = int(new_msg["opcode"], 16)
        if old_opcode != new_opcode:
            errors.append(
                f"{label}.{old_name}: opcode mismatch {old_opcode!r} != 0x{new_opcode:08x}"
            )

        old_fields = signature_fields(old_msg.get("fields", []), legacy=True)
        new_fields = signature_fields(new_msg.get("fields", []), legacy=False)
        if len(old_fields) != len(new_fields):
            errors.append(
                f"{label}.{old_name}: field count mismatch {len(old_fields)} != {len(new_fields)}"
            )
        for index, (old_field, new_field) in enumerate(zip(old_fields, new_fields)):
            address_widening = (
                old_field[0] == new_field[0]
                and old_field[1] == "address"
                and new_field[1] == "any_address"
                and (label, old_name, old_field[0]) in ANY_ADDRESS_WIDENINGS
            )
            if old_field[:2] != new_field[:2] and not address_widening:
                errors.append(
                    f"{label}.{old_name} field {index}: name/type mismatch "
                    f"{old_field[:2]!r} != {new_field[:2]!r}"
                )
                continue
            if old_field[2] == new_field[2]:
                continue
            allowed = (
                not old_field[2]
                and new_field[2]
                and old_field[1] == "address"
                and (label, old_name, old_field[0]) in NULLABLE_ADDRESS_WIDENINGS
            )
            if not allowed:
                errors.append(
                    f"{label}.{old_name}.{old_field[0]}: optionality changed "
                    f"{old_field[2]} -> {new_field[2]} without an approved widening"
                )

    old_getters = {item["name"]: item for item in old.get("getters", [])}
    new_getters = {item["name"]: item for item in new.get("getters", [])}
    for name in sorted(old_getters.keys() - new_getters.keys()):
        errors.append(f"{label}: Tolk is missing getter {name}")
    for name in sorted(new_getters.keys() - old_getters.keys()):
        errors.append(f"{label}: unexpected Tolk getter {name}")
    for name in sorted(old_getters.keys() & new_getters.keys()):
        old_getter, new_getter = old_getters[name], new_getters[name]
        if old_getter.get("methodId") != new_getter.get("methodId"):
            errors.append(
                f"{label}.{name}: method ID mismatch "
                f"{old_getter.get('methodId')} != {new_getter.get('methodId')}"
            )
        old_args = old_getter.get("arguments", [])
        new_args = new_getter.get("arguments", [])
        if len(old_args) != len(new_args):
            errors.append(f"{label}.{name}: getter argument count changed")
        for index, (old_arg, new_arg) in enumerate(zip(old_args, new_args)):
            if (
                old_arg.get("name") != new_arg.get("name")
                or canonical_type(old_arg["type"], True) != canonical_type(new_arg["type"], False)
                or optional(old_arg["type"]) != optional(new_arg["type"])
            ):
                errors.append(f"{label}.{name}: getter argument {index} changed")
        old_return = old_getter.get("returnType", {})
        new_return = new_getter.get("returns", {})
        old_return_type = canonical_type(old_return, True)
        new_return_type = canonical_type(new_return, False)
        approved_unsigned_key = (
            name == "get_ai_oracle_key"
            and old_return_type == "int"
            and new_return_type == "uint256"
        )
        if (
            (old_return_type != new_return_type and not approved_unsigned_key)
            or optional(old_return) != optional(new_return)
        ):
            errors.append(
                f"{label}.{name}: getter return changed "
                f"({old_return_type}, optional={optional(old_return)}) -> "
                f"({new_return_type}, optional={optional(new_return)})"
            )
    return errors


def main() -> int:
    errors: list[str] = check_constants()
    totals: list[str] = []
    text_receiver_count = 0
    for label, (old_name, new_name) in PAIRS.items():
        old_path, new_path = BASELINE / old_name, CURRENT / new_name
        if not old_path.is_file() or not new_path.is_file():
            errors.append(f"{label}: missing ABI baseline/current snapshot")
            continue
        old, new = load(old_path), load(new_path)
        errors.extend(check_contract(label, old, new))
        text_errors, text_count = check_text_receivers(label, old)
        errors.extend(text_errors)
        text_receiver_count += text_count
        totals.append(
            f"{label}: {len(old_incoming(old))} typed receivers, "
            f"{len(old.get('getters', []))} getters"
        )

    if errors:
        print("Migration parity check FAILED:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Migration wire-ABI parity passed (message fields/opcodes/getters):")
    for item in totals:
        print(f"- {item}")
    print(f"Approved widening: {len(NULLABLE_ADDRESS_WIDENINGS)} response-destination addresses accept addr_none")
    print(f"Numeric protocol constants checked: {len(numeric_constants(CONSTANT_SOURCES['legacy'], True).keys() & numeric_constants(CONSTANT_SOURCES['tolk'], False).keys())}")
    print(f"Legacy text receiver payloads checked: {text_receiver_count}")
    print("Note: ABI parity does not prove storage, code hash, or behavioral equivalence.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Бандит Томпсона для выбора стратегии автопочинки.

Связь с проектом: scripts/autofix/classify_failure.py детерминированно
классифицирует отказ CI (workflow-yaml, action-pin-drift, formatting,
lint-typescript, dependency-audit, ...). Для каждого класса нужно выбрать
следующий шаг починки. Бандит Томпсона (апостериорные Beta(alpha, beta))
балансирует исследование и эксплуатацию по истории успехов/провалов;
история сохраняется в JSON, чтобы политика была идемпотентной между
прогонами workflow.
"""
from __future__ import annotations

import json
import random
import zlib
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional


@dataclass
class ArmState:
    wins: int = 0
    pulls: int = 0

    def posterior(self) -> tuple[float, float]:
        return 1.0 + self.wins, 1.0 + self.pulls - self.wins


class ThompsonBandit:
    """Бандит Томпсона для Бернулли-наград (успех/провал починки)."""

    def __init__(self, arms: List[str], seed: int = 0) -> None:
        self.arms = list(arms)
        self.rng = random.Random(seed)
        self.state: Dict[str, ArmState] = {a: ArmState() for a in self.arms}

    def choose(self) -> str:
        samples = {
            a: self.rng.betavariate(*self.state[a].posterior()) for a in self.arms
        }
        return max(samples, key=lambda a: samples[a])

    def record(self, arm: str, success: bool) -> None:
        st = self.state[arm]
        st.pulls += 1
        if success:
            st.wins += 1

    def best_arm(self) -> str:
        return max(
            self.arms, key=lambda a: self.state[a].wins / max(1, self.state[a].pulls)
        )

    def to_dict(self) -> dict:
        return {
            a: {"wins": self.state[a].wins, "pulls": self.state[a].pulls}
            for a in self.arms
        }

    def load_dict(self, data: dict) -> None:
        for arm, st in data.items():
            if arm in self.state:
                self.state[arm].wins = int(st.get("wins", 0))
                self.state[arm].pulls = int(st.get("pulls", 0))


class AutofixPolicy:
    """Политика выбора стратегии починки для каждого класса отказа."""

    STRATEGIES = (
        "formatting",
        "pins-sync",
        "audit-fix",
        "ts-narrow",
        "yaml-refmt",
        "escalate-human",
    )
    SCHEMA_VERSION = 1

    def __init__(self, path: Optional[Path] = None, seed: int = 0) -> None:
        self.path = Path(path) if path else None
        self.base_seed = seed
        self.bandits: Dict[str, ThompsonBandit] = {}
        if self.path is not None and self.path.exists():
            self._load()

    def bandit_for(self, failure_class: str) -> ThompsonBandit:
        if failure_class not in self.bandits:
            arm_seed = (self.base_seed + zlib.crc32(failure_class.encode())) % (2 ** 31)
            bandit = ThompsonBandit(list(self.STRATEGIES), seed=arm_seed)
            self.bandits[failure_class] = bandit
        return self.bandits[failure_class]

    def choose(self, failure_class: str) -> str:
        return self.bandit_for(failure_class).choose()

    def record(self, failure_class: str, strategy: str, success: bool) -> None:
        self.bandit_for(failure_class).record(strategy, success)

    def save(self) -> None:
        if self.path is None:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "schemaVersion": self.SCHEMA_VERSION,
            "classes": {cls: b.to_dict() for cls, b in self.bandits.items()},
        }
        self.path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))

    def _load(self) -> None:
        data = json.loads(self.path.read_text())
        for cls, arms in data.get("classes", {}).items():
            bandit = self.bandit_for(cls)
            bandit.load_dict(arms)
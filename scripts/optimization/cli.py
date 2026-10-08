"""CLI пакета оптимизации.

Примеры:
    python3 -m scripts.optimization.cli --algorithm tpe --objective fee_profile --budget 300 --seed 42
    python3 -m scripts.optimization.cli --algorithm cmaes --objective sphere --dims 2 --budget 400
    python3 -m scripts.optimization.cli --demo-policy
"""
from __future__ import annotations

import argparse
import json
import random
import tempfile
from pathlib import Path
from typing import List, Optional, Sequence

from .annealing import SA
from .bandit import AutofixPolicy
from .bayes_tpe import TPE
from .benchmarks import make_problem
from .cmaes import CMAES
from .evolution import DE
from .objectives import decode_fee_profile, fee_profile_problem

ALGORITHMS = {"tpe": TPE, "cmaes": CMAES, "de": DE, "sa": SA}
OBJECTIVES = ("sphere", "rastrigin", "rosenbrock", "fee_profile")


def demo_policy() -> str:
    """Демонстрация бандита автопочинки на синтетической истории."""
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "policy.json"
        truth = {
            "workflow-yaml": {"yaml-refmt": 0.95, "formatting": 0.2, "escalate-human": 0.1},
            "lint-typescript": {"ts-narrow": 0.8, "formatting": 0.5, "escalate-human": 0.1},
        }
        policy = AutofixPolicy(path=path, seed=42)
        rng = random.Random(7)
        lines: List[str] = []
        for failure_class, probs in truth.items():
            for _ in range(60):
                strategy = policy.choose(failure_class)
                policy.record(failure_class, strategy, rng.random() < probs.get(strategy, 0.05))
            bandit = policy.bandit_for(failure_class)
            stats = ", ".join(
                f"{a}: {bandit.state[a].wins}/{bandit.state[a].pulls}" for a in AutofixPolicy.STRATEGIES
                if bandit.state[a].pulls
            )
            lines.append(f"  {failure_class}: выбирает «{bandit.best_arm()}» ({stats})")
        policy.save()
        lines.append(f"  история сохранена в {path.name}")
        return "\n".join(lines)


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python3 -m scripts.optimization.cli",
        description="Оптимизаторы QUASAR: TPE, CMA-ES, DE, имитация отжига, бандит Томпсона",
    )
    parser.add_argument("--algorithm", choices=sorted(ALGORITHMS), default="tpe")
    parser.add_argument("--objective", choices=OBJECTIVES, default="fee_profile")
    parser.add_argument("--dims", type=int, default=2)
    parser.add_argument("--budget", type=int, default=200)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--demo-policy", action="store_true", help="демо бандита автопочинки")
    args = parser.parse_args(argv)

    if args.demo_policy:
        print("Политика автопочинки (бандит Томпсона):")
        print(demo_policy())
        return 0

    problem = (
        fee_profile_problem()
        if args.objective == "fee_profile"
        else make_problem(args.objective, args.dims)
    )
    optimizer = ALGORITHMS[args.algorithm]()
    result = optimizer.optimize(problem, args.budget, args.seed)
    print(result.summary())
    if args.objective == "fee_profile":
        print(json.dumps(decode_fee_profile(result.best_x), ensure_ascii=False, indent=2))
    else:
        print("best_x:", [round(v, 6) for v in result.best_x])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
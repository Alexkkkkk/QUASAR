"""Тесты пакета оптимизации QUASAR.

Сходимость каждого алгоритма проверяется на эталонных функциях при
фиксированных seed: тесты детерминированы и выполняются за секунды.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.optimization import (  # noqa: E402
    SA,
    TPE,
    AutofixPolicy,
    CMAES,
    DE,
    ThompsonBandit,
)
from scripts.optimization.benchmarks import make_problem  # noqa: E402
from scripts.optimization.objectives import (  # noqa: E402
    decode_fee_profile,
    fee_profile_objective,
    fee_profile_problem,
)


def test_tpe_converges_on_sphere() -> None:
    result = TPE().optimize(make_problem("sphere", 2), 150, seed=42)
    assert result.best_f < 1e-2, result.summary()
    assert result.n_evals <= 150


def test_cmaes_converges_on_sphere() -> None:
    result = CMAES().optimize(make_problem("sphere", 2), 400, seed=7)
    assert result.best_f < 0.1, result.summary()


def test_de_converges_on_rastrigin() -> None:
    result = DE().optimize(make_problem("rastrigin", 2), 3000, seed=42)
    assert result.best_f < 6.0, result.summary()


def test_sa_converges_on_rosenbrock() -> None:
    result = SA().optimize(make_problem("rosenbrock", 2), 8000, seed=3)
    assert result.best_f < 10.0, result.summary()


def test_thompson_bandit_finds_best_arm() -> None:
    bandit = ThompsonBandit(["weak", "strong"], seed=11)
    truth = {"weak": 0.25, "strong": 0.85}
    for _ in range(400):
        arm = bandit.choose()
        bandit.record(arm, bandit.rng.random() < truth[arm])
    assert bandit.state["strong"].pulls > 300, bandit.state
    assert bandit.best_arm() == "strong"


def test_autofix_policy_persists(tmp_path) -> None:
    path = tmp_path / "policy.json"
    policy = AutofixPolicy(path=path, seed=5)
    strategy = policy.choose("lint-typescript")
    assert strategy in AutofixPolicy.STRATEGIES
    policy.record("lint-typescript", strategy, True)
    policy.save()

    reloaded = AutofixPolicy(path=path, seed=5)
    state = reloaded.bandit_for("lint-typescript").state[strategy]
    assert state.pulls == 1 and state.wins == 1


def test_fee_profile_respects_contract_policy() -> None:
    problem = fee_profile_problem()
    result = TPE().optimize(problem, 120, seed=17)
    params = decode_fee_profile(result.best_x)
    assert problem.lower[0] <= params["fee_bps"] <= problem.upper[0]
    assert params["max_wallet_bps"] >= 2.5 * params["max_tx_bps"]
    assert result.best_f == fee_profile_objective(result.best_x)
"""Пакет оптимизации QUASAR: TPE, CMA-ES, DE, SA, бандит Томпсона."""
from .annealing import SA
from .bandit import ArmState, AutofixPolicy, ThompsonBandit
from .bayes_tpe import TPE
from .benchmarks import make_problem, rastrigin, rosenbrock, sphere
from .cmaes import CMAES
from .core import Optimizer, Problem, Result
from .evolution import DE
from .pso import PSO
from .objectives import decode_fee_profile, fee_profile_objective, fee_profile_problem

__version__ = "1.0.0"

__all__ = [
    "ArmState",
    "AutofixPolicy",
    "CMAES",
    "DE",
    "Optimizer",
    "Problem",
    "PSO",
    "Result",
    "SA",
    "TPE",
    "ThompsonBandit",
    "decode_fee_profile",
    "fee_profile_objective",
    "fee_profile_problem",
    "make_problem",
    "rastrigin",
    "rosenbrock",
    "sphere",
]
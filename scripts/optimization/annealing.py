"""Имитация отжига с геометрическим охлаждением.

Простой и надёжный глобальный поиск для задач с «узкими» долинами
(например, Rosenbrock): гауссово возмущение с шагом, сжимающимся как
sqrt(T), критерий Метрополиса, геометрическое охлаждение T -> t_min.
"""
from __future__ import annotations

import math
import random
import time

from .core import Optimizer, Problem, Result, Vec


class SA(Optimizer):
    name = "sa"

    def __init__(self, t0: float = 1.0, t_min: float = 1e-6, step_frac: float = 0.2) -> None:
        self.t0 = t0
        self.t_min = t_min
        self.step_frac = step_frac

    def optimize(self, problem: Problem, budget: int, seed: int) -> Result:
        rng = random.Random(seed)
        start = time.perf_counter()
        span = sum(problem.upper[d] - problem.lower[d] for d in range(problem.dims)) / problem.dims

        x = problem.random_point(rng)
        f = problem.objective(x)
        best_f, best_x = f, list(x)
        history = [f]
        alpha = (self.t_min / self.t0) ** (1.0 / max(budget, 1))

        for step in range(budget):
            T = self.t0 * alpha ** step
            scale = self.step_frac * span * math.sqrt(T)
            cand = [problem.clamp_dim(x[d] + rng.gauss(0.0, scale), d) for d in range(problem.dims)]
            fc = problem.objective(cand)
            history.append(fc)
            dE = fc - f
            if dE < 0.0 or rng.random() < math.exp(-dE / max(T, 1e-12)):
                x, f = cand, fc
                if f < best_f:
                    best_f, best_x = f, list(x)

        return Result(
            self.name, problem.name, best_x, best_f, budget, history,
            time.perf_counter() - start,
        )
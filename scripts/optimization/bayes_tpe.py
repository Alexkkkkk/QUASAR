"""TPE: Tree-structured Parzen Estimator с критерием ожидаемого улучшения.

Идея: наблюдения делятся на «лучшие» (доля gamma) и «худшие»; для каждой
размерности строятся два ядерных распределения l(x) и g(x); кандидаты,
нарисованные из l, оцениваются по log l(x) - log g(x) (прокси ожидаемого
улучшения), и лучший кандидат возвращается в целевую функцию. Байесовская
оптимизация такого типа выигрывает на дорогих целевых функциях (десятки-сотни
вызовов), поэтому подходит для настройки параметров проекта.
"""
from __future__ import annotations

import math
import random
import time
from typing import List, Sequence, Tuple

from .core import Optimizer, Problem, Result, Vec


class TPE(Optimizer):
    name = "tpe"

    def __init__(
        self,
        gamma: float = 0.25,
        candidates: int = 24,
        prior_weight: float = 0.15,
        bandwidth: float = 0.20,
    ) -> None:
        self.gamma = gamma
        self.candidates = candidates
        self.prior_weight = prior_weight
        self.bandwidth = bandwidth

    def optimize(self, problem: Problem, budget: int, seed: int) -> Result:
        rng = random.Random(seed)
        start = time.perf_counter()
        obs: List[Tuple[float, Vec]] = []
        history: List[float] = []

        best_x = problem.random_point(rng)
        best_f = problem.objective(best_x)
        obs.append((best_f, list(best_x)))
        history.append(best_f)
        evals = 1

        n_init = max(8, min(24, budget // 6))
        while evals < min(budget, n_init):
            x = problem.random_point(rng)
            f = problem.objective(problem.clamp(x))
            obs.append((f, x))
            history.append(f)
            evals += 1
            if f < best_f:
                best_f, best_x = f, list(x)

        while evals < budget:
            order = sorted(obs, key=lambda t: t[0])
            n_good = max(1, int(math.ceil(len(order) * self.gamma)))
            good = [x for _, x in order[:n_good]]
            bad = [x for _, x in order[n_good:]] or good

            cand, score = None, -math.inf
            for _ in range(self.candidates):
                x = self._draw(rng, problem, good)
                s = self._score(problem, good, bad, x)
                if s > score:
                    cand, score = x, s
            f = problem.objective(cand)
            obs.append((f, cand))
            history.append(f)
            evals += 1
            if f < best_f:
                best_f, best_x = f, list(cand)

        return Result(
            self.name, problem.name, best_x, best_f, evals, history,
            time.perf_counter() - start,
        )

    # ------------------------------------------------------------------ #
    def _bw(self, problem: Problem, d: int, k: int) -> float:
        span = problem.upper[d] - problem.lower[d]
        return max(1e-9, span * self.bandwidth * k ** -0.2)

    def _draw(self, rng: random.Random, problem: Problem, good: List[Vec]) -> Vec:
        out: Vec = []
        for d in range(problem.dims):
            if not good or rng.random() < self.prior_weight:
                out.append(rng.uniform(problem.lower[d], problem.upper[d]))
            else:
                center = rng.choice(good)[d]
                out.append(
                    problem.clamp_dim(
                        rng.gauss(center, self._bw(problem, d, len(good))), d
                    )
                )
        return out

    def _score(
        self, problem: Problem, good: List[Vec], bad: List[Vec], x: Vec
    ) -> float:
        total = 0.0
        for d in range(problem.dims):
            span = problem.upper[d] - problem.lower[d]
            prior = math.log(max(span, 1e-12))
            l_term = (
                math.log(self.prior_weight)
                + prior
                + self._mixture_logpdf(
                    [p[d] for p in good], self._bw(problem, d, len(good)), x[d]
                )
            )
            g_term = (
                math.log(1.0 - self.prior_weight)
                + prior
                + self._mixture_logpdf(
                    [p[d] for p in bad], self._bw(problem, d, max(1, len(bad))), x[d]
                )
            )
            total += l_term - g_term
        return total

    @staticmethod
    def _mixture_logpdf(points: Sequence[float], bw: float, x: float) -> float:
        if not points:
            return 0.0
        comps = [
            -0.5 * ((x - p) / bw) ** 2 - math.log(bw * math.sqrt(2.0 * math.pi))
            for p in points
        ]
        m = max(comps)
        return m + math.log(sum(math.exp(c - m) for c in comps) / len(points))
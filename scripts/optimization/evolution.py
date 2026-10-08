"""Дифференциальная эволюция DE/rand/1/bin с джиттером масштаба.

Робастный глобальный поиск на мультимодальных ландшафтах (типа Rastrigin):
мутант строится как x_r1 + F*(x_r2 - x_r3), биномиальное скрещивание с CR,
жадная замена родителя. Джиттер F делает поиск устойчивым к неудачному
масштабу задачи.
"""
from __future__ import annotations

import random
import time
from typing import List

from .core import Optimizer, Problem, Result, Vec


class DE(Optimizer):
    name = "de"

    def __init__(
        self, pop_size: int | None = None, F: float = 0.7, CR: float = 0.9
    ) -> None:
        self.pop_size = pop_size
        self.F = F
        self.CR = CR

    def optimize(self, problem: Problem, budget: int, seed: int) -> Result:
        rng = random.Random(seed)
        start = time.perf_counter()
        n = problem.dims
        NP = self.pop_size or max(16, 4 * n)

        pop = [problem.random_point(rng) for _ in range(NP)]
        fit = [problem.objective(x) for x in pop]
        evals = NP
        history = list(fit)
        best_i = min(range(NP), key=lambda i: fit[i])
        best_f, best_x = fit[best_i], list(pop[best_i])

        while evals < budget:
            for i in range(NP):
                if evals >= budget:
                    break
                a, b, c = rng.sample([j for j in range(NP) if j != i], 3)
                F = self.F * (0.5 + rng.random())
                j_rand = rng.randrange(n)
                trial: Vec = [
                    (
                        pop[a][d] + F * (pop[b][d] - pop[c][d])
                        if rng.random() < self.CR or d == j_rand
                        else pop[i][d]
                    )
                    for d in range(n)
                ]
                trial = problem.clamp(trial)
                ft = problem.objective(trial)
                evals += 1
                history.append(ft)
                if ft <= fit[i]:
                    pop[i] = trial
                    fit[i] = ft
                    if ft < best_f:
                        best_f, best_x = ft, list(trial)

        return Result(
            self.name, problem.name, best_x, best_f, evals, history,
            time.perf_counter() - start,
        )
"""CMA-ES: (mu/mu_w, lambda)-эволюционная стратегия с адаптацией ковариации.

Реализованы: выборка через разложение Холецкого ковариационной матрицы,
эволюционные пути p_sigma и p_c, ранг-один и ранг-mu обновления C,
CSA-адаптация шага. Полезна там, где целевая функция гладкая, а переменные
сильно скоррелированы (например, связанные между собой ограничения профиля
комиссий).
"""
from __future__ import annotations

import math
import random
import time
from typing import List

from .core import Optimizer, Problem, Result, Vec


def _cholesky(a: List[List[float]]) -> List[List[float]]:
    n = len(a)
    L = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1):
            s = a[i][j] - sum(L[i][k] * L[j][k] for k in range(j))
            if i == j:
                L[i][j] = math.sqrt(s if s > 1e-14 else 1e-14)
            else:
                L[i][j] = s / L[j][j]
    return L


def _forward_solve(L: List[List[float]], b: Sequence[float]) -> List[float]:
    """Решает L @ u = b; u = C^{-1/2} b при C = L L^T."""
    n = len(L)
    u = [0.0] * n
    for i in range(n):
        u[i] = (b[i] - sum(L[i][k] * u[k] for k in range(i))) / L[i][i]
    return u


class CMAES(Optimizer):
    name = "cmaes"

    def __init__(self, sigma0: float = 0.3) -> None:
        self.sigma0 = sigma0

    def optimize(self, problem: Problem, budget: int, seed: int) -> Result:
        n = problem.dims
        rng = random.Random(seed)
        start = time.perf_counter()
        span = sum(problem.upper[d] - problem.lower[d] for d in range(n)) / n

        xmean = problem.random_point(rng)
        sigma = max(1e-6, self.sigma0 * span)

        lam = max(6, 4 + int(3 * math.log(max(n, 2))))
        mu = lam // 2
        w_raw = [math.log(lam * 0.5 + 0.5) - math.log(i + 1) for i in range(mu)]
        w_sum = sum(w_raw)
        w = [v / w_sum for v in w_raw]
        mueff = w_sum ** 2 / sum(v * v for v in w_raw)
        cc = (4.0 + mueff / n) / (n + 4.0 + 2.0 * mueff / n)
        cs = (mueff + 2.0) / (n + mueff + 5.0)
        c1 = 2.0 / ((n + 1.3) ** 2 + mueff)
        cmu = min(1.0 - c1, 2.0 * (mueff - 2.0 + 1.0 / mueff) / ((n + 2.0) ** 2 + mueff))
        damps = 1.0 + 2.0 * max(0.0, math.sqrt((mueff - 1.0) / (n + 1.0))) + cs
        chi_n = math.sqrt(n) * (1.0 - 1.0 / (4.0 * n) + 1.0 / (21.0 * n * n))

        pc = [0.0] * n
        ps = [0.0] * n
        C = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]

        gen = 0
        evals = 0
        history: List[float] = []
        best_f = math.inf
        best_x = list(xmean)

        while evals < budget:
            gen += 1
            L = _cholesky(C)
            pop_x: List[Vec] = []
            pop_f: List[float] = []
            for _ in range(lam):
                z = [rng.gauss(0.0, 1.0) for _ in range(n)]
                x = problem.clamp(
                    [
                        xmean[d] + sigma * sum(L[d][k] * z[k] for k in range(n))
                        for d in range(n)
                    ]
                )
                f = problem.objective(x)
                pop_x.append(x)
                pop_f.append(f)
                history.append(f)
                evals += 1
                if f < best_f:
                    best_f, best_x = f, list(x)
                if evals >= budget:
                    break

            order = sorted(range(len(pop_x)), key=lambda i: pop_f[i])
            xw = [sum(w[i] * pop_x[order[i]][d] for i in range(mu)) for d in range(n)]
            yw = [(xw[d] - xmean[d]) / sigma for d in range(n)]
            y_sel = [
                [(pop_x[order[i]][d] - xmean[d]) / sigma for d in range(n)]
                for i in range(mu)
            ]

            cinv_yw = _forward_solve(L, yw)
            ps = [
                (1.0 - cs) * ps[d] + math.sqrt(cs * (2.0 - cs) * mueff) * cinv_yw[d]
                for d in range(n)
            ]
            ps_norm = math.sqrt(sum(v * v for v in ps))
            hsig = ps_norm / math.sqrt(1.0 - (1.0 - cs) ** (2 * gen)) < (
                1.4 + 2.0 / (n + 1)
            ) * chi_n
            pc = [
                (1.0 - cc) * pc[d]
                + (math.sqrt(cc * (2.0 - cc) * mueff) if hsig else 0.0) * yw[d]
                for d in range(n)
            ]
            C = [
                [
                    (1.0 - c1 - cmu) * C[d][e]
                    + c1 * (
                        pc[d] * pc[e] + (0.0 if hsig else cc * (2.0 - cc) * C[d][e])
                    )
                    + cmu * sum(w[i] * y_sel[i][d] * y_sel[i][e] for i in range(mu))
                    for e in range(n)
                ]
                for d in range(n)
            ]
            sigma = min(
                1e6,
                max(1e-12, sigma * math.exp((cs / damps) * (ps_norm / chi_n - 1.0))),
            )
            xmean = xw

        return Result(
            self.name, problem.name, best_x, best_f, evals, history,
            time.perf_counter() - start,
        )
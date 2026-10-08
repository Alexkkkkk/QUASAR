"""PSO: Particle Swarm Optimization с линейно убывающей инерцией.

Классический алгоритм Кеннеди—Эберхарта: каждая частица помнит свою лучшую
позицию (pbest) и знает лучшую позицию роя (gbest); скорость обновляется
как w*v + c1*r1*(pbest - x) + c2*r2*(gbest - x). Инерция w линейно
убывает от w_start к w_end — балансировка исследования и доэксплуатации.
Хорошо работает на мультимодальных ландшафтах и дополняет DE/SA пакета.
"""
from __future__ import annotations

import random
import time
from typing import List

from .core import Optimizer, Problem, Result, Vec


class PSO(Optimizer):
    name = "pso"

    def __init__(
        self,
        swarm_size: int = 40,
        w_start: float = 0.9,
        w_end: float = 0.4,
        c1: float = 2.0,
        c2: float = 2.0,
        v_max_frac: float = 0.2,
    ) -> None:
        self.swarm_size = swarm_size
        self.w_start = w_start
        self.w_end = w_end
        self.c1 = c1
        self.c2 = c2
        self.v_max_frac = v_max_frac

    def optimize(self, problem: Problem, budget: int, seed: int) -> Result:
        rng = random.Random(seed)
        start = time.perf_counter()
        n = problem.dims
        S = self.swarm_size

        pos = [problem.random_point(rng) for _ in range(S)]
        span = [
            problem.upper[d] - problem.lower[d] for d in range(n)
        ]
        v_max = [self.v_max_frac * span[d] for d in range(n)]
        vel = [
            [rng.uniform(-v_max[d], v_max[d]) for d in range(n)] for _ in range(S)
        ]
        fit = [problem.objective(x) for x in pos]
        evals = S
        history = list(fit)

        pbest_x = [list(x) for x in pos]
        pbest_f = list(fit)
        g_i = min(range(S), key=lambda i: pbest_f[i])
        gbest_x, gbest_f = list(pbest_x[g_i]), pbest_f[g_i]

        iters = max(1, budget // S)
        for it in range(iters):
            w = self.w_start + (self.w_end - self.w_start) * (it / iters)
            for i in range(S):
                if evals >= budget:
                    break
                new_v: List[float] = []
                new_x: Vec = []
                for d in range(n):
                    r1, r2 = rng.random(), rng.random()
                    v = (
                        w * vel[i][d]
                        + self.c1 * r1 * (pbest_x[i][d] - pos[i][d])
                        + self.c2 * r2 * (gbest_x[d] - pos[i][d])
                    )
                    v = max(-v_max[d], min(v_max[d], v))
                    new_v.append(v)
                    new_x.append(problem.clamp_dim(pos[i][d] + v, d))
                f = problem.objective(new_x)
                evals += 1
                history.append(f)
                vel[i], pos[i] = new_v, new_x
                if f < pbest_f[i]:
                    pbest_f[i], pbest_x[i] = f, list(new_x)
                    if f < gbest_f:
                        gbest_f, gbest_x = f, list(new_x)
                if evals >= budget:
                    break
            if evals >= budget:
                break

        return Result(
            self.name, problem.name, gbest_x, gbest_f, evals, history,
            time.perf_counter() - start,
        )
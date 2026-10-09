"""Общий интерфейс оптимизаторов QUASAR.

Каждый алгоритм — чистый модуль на стандартной библиотеке Python (без внешних
зависимостей) с единым протоколом: ``optimizer.optimize(problem, budget, seed)
-> Result``. Все алгоритмы детерминированы при фиксированном ``seed`` и решают
задачу минимизации в ограниченном параллелепипеде.

Состав пакета:
  bayes_tpe  — TPE (Tree-structured Parzen Estimator), критерий ожидаемого улучшения;
  cmaes      — CMA-ES (адаптация ковариационной матрицы);
  evolution  — дифференциальная эволюция DE/rand/1/bin;
  annealing  — имитация отжига с геометрическим охлаждением;
  bandit     — бандит Томпсона для выбора стратегии автопочинки (autofix).

Целевые функции, согласованные с инвариантами проекта, — в ``objectives.py``,
эталонные функции для тестов сходимости — в ``benchmarks.py``.
"""
from __future__ import annotations

import math
import random
import time
from dataclasses import dataclass, field
from typing import Callable, List, Sequence

Vec = List[float]

__all__ = ["Problem", "Result", "Optimizer", "Vec"]


@dataclass
class Problem:
    """Задача минимизации в ограниченном параллелепипеде."""

    name: str
    lower: Vec
    upper: Vec
    objective: Callable[[Vec], float]

    def __post_init__(self) -> None:
        if len(self.lower) != len(self.upper) or not self.lower:
            raise ValueError("lower/upper должны быть одинаковой ненулевой длины")
        for lo, hi in zip(self.lower, self.upper):
            if not (math.isfinite(lo) and math.isfinite(hi)) or hi < lo:
                raise ValueError("границы должны быть конечными и упорядоченными")

    @property
    def dims(self) -> int:
        return len(self.lower)

    def clamp(self, x: Sequence[float]) -> Vec:
        return [self.clamp_dim(v, d) for d, v in enumerate(x)]

    def clamp_dim(self, v: float, d: int) -> float:
        lo, hi = self.lower[d], self.upper[d]
        if not math.isfinite(v):
            return lo
        span = hi - lo
        if span <= 0:
            return lo
        # периодическое отображение внутрь диапазона — сохраняет разнообразие
        t = (v - lo) / span
        t -= math.floor(t)
        return lo + t * span

    def random_point(self, rng: random.Random) -> Vec:
        return [rng.uniform(lo, hi) for lo, hi in zip(self.lower, self.upper)]


@dataclass
class Result:
    """Результат прогона оптимизатора."""

    algorithm: str
    problem: str
    best_x: Vec
    best_f: float
    n_evals: int
    history: List[float] = field(default_factory=list)
    wall_time: float = 0.0

    def summary(self) -> str:
        return (
            f"[{self.algorithm}] {self.problem}: best_f={self.best_f:.6g} "
            f"за {self.n_evals} вызовов целевой функции, {self.wall_time:.2f} с"
        )


class Optimizer:
    """Протокол оптимизатора; подклассы реализуют optimize()."""

    name = "optimizer"

    def optimize(self, problem: Problem, budget: int, seed: int) -> Result:
        raise NotImplementedError
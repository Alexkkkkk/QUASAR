"""Эталонные функции для тестов сходимости оптимизаторов."""
from __future__ import annotations

import math

from .core import Problem, Vec

BOUNDS = {
    "sphere": (-5.0, 5.0),
    "rosenbrock": (-2.0, 2.0),
    "rastrigin": (-5.12, 5.12),
}


def sphere(x: Vec) -> float:
    return sum(v * v for v in x)


def rosenbrock(x: Vec) -> float:
    return sum(
        100.0 * (x[i + 1] - x[i] ** 2) ** 2 + (1.0 - x[i]) ** 2
        for i in range(len(x) - 1)
    )


def rastrigin(x: Vec) -> float:
    n = len(x)
    return 10.0 * n + sum(v * v - 10.0 * math.cos(2.0 * math.pi * v) for v in x)


BENCHMARKS = {"sphere": sphere, "rosenbrock": rosenbrock, "rastrigin": rastrigin}


def make_problem(name: str, dims: int) -> Problem:
    if name not in BENCHMARKS:
        raise ValueError(f"неизвестный эталон: {name}")
    lo, hi = BOUNDS[name]
    return Problem(
        name=f"{name}-{dims}d",
        lower=[lo] * dims,
        upper=[hi] * dims,
        objective=BENCHMARKS[name],
    )
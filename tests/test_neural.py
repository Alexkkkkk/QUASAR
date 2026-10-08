"""Тесты нейромодуля QUASAR: градиентная проверка и обучение."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.optimization.neural import (  # noqa: E402
    Adam,
    Dense,
    MSELoss,
    Momentum,
    ReLU,
    Sequential,
    SGD,
    Sigmoid,
    SoftmaxCrossEntropy,
    Tanh,
    numerical_gradient_check,
    train,
)


def test_gradient_check_mse() -> None:
    """Аналитические градиенты совпадают с численными (< 1e-6)."""
    model = Sequential(Dense(3, 5, seed=1), Tanh(), Dense(5, 2, seed=2))
    loss = MSELoss()
    rng = np.random.default_rng(0)
    x = rng.normal(size=(4, 3))
    y = rng.normal(size=(4, 2))
    err = numerical_gradient_check(model, loss, x, y)
    assert err < 1e-6, f"относительная ошибка градиента {err}"


def test_gradient_check_softmax_ce() -> None:
    model = Sequential(Dense(4, 6, seed=3), ReLU(), Dense(6, 3, seed=4))
    loss = SoftmaxCrossEntropy()
    rng = np.random.default_rng(1)
    x = rng.normal(size=(5, 4))
    y = np.eye(3)[rng.integers(0, 3, size=5)]
    err = numerical_gradient_check(model, loss, x, y)
    assert err < 1e-6, f"относительная ошибка градиента {err}"


def test_xor_trains_with_adam() -> None:
    """MLP 2-8-1 сходится на XOR: MSE < 0.01."""
    x = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
    y = np.array([[0.0], [1.0], [1.0], [0.0]])
    model = Sequential(Dense(2, 8, seed=5), Tanh(), Dense(8, 1, seed=6))
    opt = Adam(model.params_and_grads(), lr=0.05)
    history = train(model, MSELoss(), x, y, opt, epochs=400, batch_size=4)
    final = model.forward(x)
    assert history[-1] < 0.01, f"final loss {history[-1]}"
    preds = (final > 0.5).astype(float)
    assert np.array_equal(preds, y), f"предсказания {preds}"


def test_spiral_classification_high_accuracy() -> None:
    """2-спираль: MLP 2-32-32-2 с Adam даёт точность > 0.9."""
    rng = np.random.default_rng(42)
    n_per = 60
    pts, labels = [], []
    for cls in (0, 1):
        t = np.linspace(0.0, 3.5 * np.pi, n_per) + (0.0 if cls == 0 else np.pi)
        r = 0.05 + 0.28 * t / (3.5 * np.pi)
        xs = r * np.cos(t) + rng.normal(0, 0.02, n_per)
        ys = r * np.sin(t) + rng.normal(0, 0.02, n_per)
        pts.append(np.stack([xs, ys], axis=1))
        labels.append(np.full(n_per, cls))
    x = np.concatenate(pts)
    y = np.eye(2)[np.concatenate(labels)]
    x = x / np.abs(x).max()  # нормализация входа в [-1, 1]

    model = Sequential(
        Dense(2, 32, seed=7, init="he"),
        ReLU(),
        Dense(32, 32, seed=8, init="he"),
        ReLU(),
        Dense(32, 2, seed=9),
    )
    loss = SoftmaxCrossEntropy()
    opt = Adam(model.params_and_grads(), lr=0.02)
    train(model, loss, x, y, opt, epochs=1500, batch_size=24, seed=3)

    acc = float(np.mean(np.argmax(model.forward(x), axis=1) == np.argmax(y, axis=1)))
    assert acc > 0.9, f"точность {acc}"


def test_sgd_and_momentum_reduce_loss() -> None:
    x = np.array([[0.0, 0.0], [0.0, 1.0], [1.0, 0.0], [1.0, 1.0]])
    y = np.array([[0.0], [1.0], [1.0], [0.0]])
    for opt_cls in (SGD, Momentum):
        model = Sequential(Dense(2, 8, seed=10), Tanh(), Dense(8, 1, seed=11))
        opt = opt_cls(model.params_and_grads(), lr=0.1)
        history = train(model, MSELoss(), x, y, opt, epochs=1500, batch_size=4)
        assert history[-1] < history[0], f"{opt_cls.__name__} не снижает потерю"
        assert history[-1] < 0.05, f"{opt_cls.__name__}: final loss {history[-1]}"
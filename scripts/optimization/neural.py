"""Нейросетевые слои и обучение на numpy (без внешних зависимостей).

Компоненты:
  Dense, ReLU, Tanh, Sigmoid — слои с прямым и обратным проходом;
  Sequential                 — контейнер-сеть;
  MSELoss, SoftmaxCrossEntropy — функции потерь с аналитическими градиентами;
  SGD, Momentum, Adam        — оптимизаторы градиентного спуска;
  numerical_gradient_check   — проверка аналитических градиентов численно.

Всё на np.float64: численная проверка градиентов требует точности double.
"""
from __future__ import annotations

from typing import Iterator, List, Sequence, Tuple

import numpy as np

Array = np.ndarray
ParamGrad = Tuple[Array, Array]


# --------------------------------------------------------------------- #
# Слои
# --------------------------------------------------------------------- #
class Layer:
    def forward(self, x: Array) -> Array:
        raise NotImplementedError

    def backward(self, grad: Array) -> Array:
        raise NotImplementedError

    def params_and_grads(self) -> List[ParamGrad]:
        return []


class Dense(Layer):
    """Полносвязный слой: y = x @ W + b. Инициализация Xavier/Glorot."""

    def __init__(
        self, in_features: int, out_features: int, seed: int = 0, init: str = "xavier"
    ) -> None:
        rng = np.random.default_rng(seed)
        if init == "he":
            scale = np.sqrt(2.0 / in_features)
        else:
            scale = np.sqrt(2.0 / (in_features + out_features))
        self.W = rng.normal(0.0, scale, size=(in_features, out_features))
        self.b = np.zeros(out_features)
        self._x: Array | None = None
        self.dW: Array = np.zeros_like(self.W)
        self.db: Array = np.zeros_like(self.b)

    def forward(self, x: Array) -> Array:
        self._x = x
        return x @ self.W + self.b

    def backward(self, grad: Array) -> Array:
        assert self._x is not None, "backward вызван до forward"
        # Ин-плейс присваивание: оптимизаторы держат ссылку на эти же массивы.
        np.matmul(self._x.T, grad, out=self.dW)
        np.sum(grad, axis=0, out=self.db)
        return grad @ self.W.T

    def params_and_grads(self) -> List[ParamGrad]:
        return [(self.W, self.dW), (self.b, self.db)]


class ReLU(Layer):
    def forward(self, x: Array) -> Array:
        self._mask = x > 0.0
        return x * self._mask

    def backward(self, grad: Array) -> Array:
        return grad * self._mask


class Tanh(Layer):
    def forward(self, x: Array) -> Array:
        self._y = np.tanh(x)
        return self._y

    def backward(self, grad: Array) -> Array:
        return grad * (1.0 - self._y ** 2)


class Sigmoid(Layer):
    def forward(self, x: Array) -> Array:
        self._y = 1.0 / (1.0 + np.exp(-x))
        return self._y

    def backward(self, grad: Array) -> Array:
        return grad * self._y * (1.0 - self._y)


class Sequential(Layer):
    """Контейнер-сеть: последовательное применение слоёв."""

    def __init__(self, *layers: Layer) -> None:
        self.layers = list(layers)

    def forward(self, x: Array) -> Array:
        for layer in self.layers:
            x = layer.forward(x)
        return x

    def backward(self, grad: Array) -> Array:
        for layer in reversed(self.layers):
            grad = layer.backward(grad)
        return grad

    def params_and_grads(self) -> List[ParamGrad]:
        return [pg for layer in self.layers for pg in layer.params_and_grads()]


# --------------------------------------------------------------------- #
# Потери
# --------------------------------------------------------------------- #
class MSELoss:
    def forward(self, pred: Array, target: Array) -> float:
        self._diff = pred - target
        return float(np.mean(self._diff ** 2))

    def backward(self) -> Array:
        n = self._diff.size
        return 2.0 * self._diff / n

    __call__ = forward


class SoftmaxCrossEntropy:
    """Softmax + кросс-энтропия; аналитический градиент (p - y) / N."""

    def forward(self, logits: Array, target_onehot: Array) -> float:
        shifted = logits - logits.max(axis=1, keepdims=True)
        exp = np.exp(shifted)
        self._p = exp / exp.sum(axis=1, keepdims=True)
        self._y = target_onehot
        return float(-np.mean(np.sum(target_onehot * np.log(self._p + 1e-12), axis=1)))

    def backward(self) -> Array:
        n = self._p.shape[0]
        return (self._p - self._y) / n

    __call__ = forward


# --------------------------------------------------------------------- #
# Оптимизаторы градиентного спуска
# --------------------------------------------------------------------- #
class SGD:
    def __init__(self, params: Sequence[ParamGrad], lr: float = 0.1) -> None:
        self.params = list(params)
        self.lr = lr

    def step(self) -> None:
        for p, g in self.params:
            p -= self.lr * g


class Momentum(SGD):
    def __init__(
        self, params: Sequence[ParamGrad], lr: float = 0.1, momentum: float = 0.9
    ) -> None:
        super().__init__(params, lr)
        self.momentum = momentum
        self.vel = [np.zeros_like(p) for p, _ in self.params]

    def step(self) -> None:
        for (p, g), v in zip(self.params, self.vel):
            v *= self.momentum
            v -= self.lr * g
            p += v


class Adam:
    def __init__(
        self,
        params: Sequence[ParamGrad],
        lr: float = 0.01,
        beta1: float = 0.9,
        beta2: float = 0.999,
        eps: float = 1e-8,
    ) -> None:
        self.params = list(params)
        self.lr, self.beta1, self.beta2, self.eps = lr, beta1, beta2, eps
        self.m = [np.zeros_like(p) for p, _ in self.params]
        self.v = [np.zeros_like(p) for p, _ in self.params]
        self.t = 0

    def step(self) -> None:
        self.t += 1
        b1, b2 = self.beta1, self.beta2
        bc1 = 1.0 - b1 ** self.t
        bc2 = 1.0 - b2 ** self.t
        for (p, g), m, v in zip(self.params, self.m, self.v):
            m *= b1
            m += (1.0 - b1) * g
            v *= b2
            v += (1.0 - b2) * g * g
            p -= self.lr * (m / bc1) / (np.sqrt(v / bc2) + self.eps)


# --------------------------------------------------------------------- #
# Численная проверка градиентов и цикл обучения
# --------------------------------------------------------------------- #
def numerical_gradient_check(
    model: Sequential,
    loss_fn,
    x: Array,
    y: Array,
    eps: float = 1e-6,
) -> float:
    """Максимальная относительная ошибка аналитических градиентов."""
    loss_fn(model.forward(x), y)
    model.backward(loss_fn.backward())
    analytic = [g.copy() for _, g in model.params_and_grads()]

    max_err = 0.0
    for (p, _), ag in zip(model.params_and_grads(), analytic):
        flat = p.reshape(-1)
        aflat = ag.reshape(-1)
        for idx in range(flat.size):
            orig = flat[idx]
            flat[idx] = orig + eps
            fp = loss_fn(model.forward(x), y)
            flat[idx] = orig - eps
            fm = loss_fn(model.forward(x), y)
            flat[idx] = orig
            num = (fp - fm) / (2.0 * eps)
            denom = max(1e-12, abs(num) + abs(aflat[idx]))
            max_err = max(max_err, abs(num - aflat[idx]) / denom)
    return max_err


def train(
    model: Sequential,
    loss_fn,
    x: Array,
    y: Array,
    opt,
    epochs: int = 200,
    batch_size: int = 32,
    seed: int = 0,
    x_val: Array | None = None,
    y_val: Array | None = None,
    patience: int = 25,
    verbose: bool = False,
) -> List[float]:
    """Мини-батчевое обучение с опциональным early stopping по val-потере."""
    rng = np.random.default_rng(seed)
    n = x.shape[0]
    history: List[float] = []
    best_val = np.inf
    wait = 0

    for epoch in range(epochs):
        order = rng.permutation(n)
        epoch_loss = 0.0
        for start in range(0, n, batch_size):
            idx = order[start : start + batch_size]
            pred = model.forward(x[idx])
            loss = loss_fn(pred, y[idx])
            model.backward(loss_fn.backward())
            opt.step()
            epoch_loss += loss * len(idx)
        history.append(epoch_loss / n)

        if x_val is not None:
            val_loss = loss_fn(model.forward(x_val), y_val)
            if val_loss < best_val - 1e-6:
                best_val, wait = val_loss, 0
            else:
                wait += 1
                if wait >= patience:
                    if verbose:
                        print(f"early stopping на эпохе {epoch}: val={val_loss:.6f}")
                    break
        if verbose and (epoch % 50 == 0 or epoch == epochs - 1):
            print(f"epoch {epoch}: loss={history[-1]:.6f}")
    return history
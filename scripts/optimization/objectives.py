"""Целевые функции QUASAR для автоматической настройки параметров.

fee_profile: прокси-модель профиля комиссий джеттона. Пространство
согласовано с инвариантами контракта contracts/quasar.tact: базовая комиссия
QUASAR_WALLET_FEE_BPS (0.30% = 30 bps), политика кошелька «исходящий перевод
<= 1% предложения, принимающий кошелёк <= 3% предложения», cooldown между
переводами. Модель детерминированная и служит скоринг-функцией при подготовке
предложения владельцу через owner-governed управление (SetFeeConfig) — модуль
не выполняет никаких on-chain действий.
"""
from __future__ import annotations

import math

from .core import Problem, Vec

# Границы согласованы с контрактом:
#   feeBps: базовое 30 (0.30%), допустимый диапазон настройки 5..600 bps;
#   burnShare: 0..100 % комиссии, уходящие в burn;
#   maxTxBps: cap исходящего перевода, 1% предложения = 100 bps;
#   maxWalletBps: cap входящего, 3% предложения = 300 bps;
#   cooldown: 60..86400 с.
FEE_BPS = (5.0, 600.0)
BURN_SHARE = (0.0, 100.0)
MAX_TX = (50.0, 1000.0)
MAX_WALLET = (100.0, 3000.0)
COOLDOWN = (60.0, 86400.0)

LOWER = [FEE_BPS[0], BURN_SHARE[0], MAX_TX[0], MAX_WALLET[0], COOLDOWN[0]]
UPPER = [FEE_BPS[1], BURN_SHARE[1], MAX_TX[1], MAX_WALLET[1], COOLDOWN[1]]


def decode_fee_profile(x: Vec) -> dict:
    return {
        "fee_bps": x[0],
        "burn_share_pct": x[1],
        "max_tx_bps": x[2],
        "max_wallet_bps": x[3],
        "cooldown_s": x[4],
    }


def fee_profile_objective(x: Vec) -> float:
    fee, burn, max_tx, max_wallet, cooldown = x

    # Жёсткое ограничение политики: cap приёма должен кратно превышать cap
    # отправки (в контракте 3% против 1%), иначе конфигурация отвергается.
    if max_wallet < 2.5 * max_tx:
        return 1e6 + (2.5 * max_tx - max_wallet)

    # Чувствительность объёма к комиссии (эластичность).
    volume = 1_000_000.0 * math.exp(-fee / 250.0)
    revenue = volume * fee / 10_000.0
    # Бонус выкупа: доля комиссии в burn укрепляет дефицит предложения.
    burn_bonus = revenue * 0.25 * burn / 100.0
    # Отток пользователей растёт нелинейно с комиссией.
    churn = 900.0 * (fee / 600.0) ** 1.5
    # Предпочтение политики 3:1 между wallet-cap и tx-cap.
    safety = 0.15 * revenue * (1.0 - abs(max_wallet - 3.0 * max_tx) / (3.0 * max_tx + 1.0))
    # Длинный cooldown блокирует торговлю — штраф за «заморозку» ликвидности.
    liquidity = 0.35 * revenue * (1.0 - cooldown / 86400.0)

    return -(revenue + burn_bonus + safety + liquidity - churn)


def fee_profile_problem() -> Problem:
    return Problem(
        name="fee_profile",
        lower=list(LOWER),
        upper=list(UPPER),
        objective=fee_profile_objective,
    )
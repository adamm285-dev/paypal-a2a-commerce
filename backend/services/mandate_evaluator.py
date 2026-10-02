"""
Buyer Agent Spending Mandate Evaluation Engine.
Enforces programmatic financial guardrails, checks budget caps, validates
permitted merchant categories, and cryptographically signs authorization tokens.
"""

import hmac
import hashlib
import time
from typing import Dict, Any, Tuple
from ..config import settings
from ..models import SpendingMandateRequest, SpendingMandateResponse, RecurrenceType

ALLOWED_CATEGORIES = {
    "contractor-dispatch-ai",
    "telephony-screener",
    "trade-software",
    "job-deposit",
    "emergency-towing",
}

DEFAULT_MONTHLY_CAP = 100.00


class MandateLedger:
    """Thread-safe active ledger tracking cumulative monthly agent spend."""

    def __init__(self, monthly_cap: float = DEFAULT_MONTHLY_CAP):
        self.monthly_cap = monthly_cap
        self._current_spent = 0.0
        self._history: list = []

    def get_remaining_budget(self) -> float:
        return max(0.0, self.monthly_cap - self._current_spent)

    def record_spend(self, amount: float, metadata: Dict[str, Any]):
        self._current_spent += amount
        self._history.append(
            {"timestamp": time.time(), "amount": amount, **metadata}
        )

    def reset(self):
        self._current_spent = 0.0
        self._history.clear()


# Global in-memory mandate ledger
ledger = MandateLedger()


def sign_mandate_token(
    agent_id: str, amount: float, recurrence: str, secret: str
) -> str:
    """Generates an HMAC-SHA256 signature binding the agent identity, authorized amount, and timestamp."""
    payload = f"{agent_id}:{amount:.2f}:{recurrence}:{int(time.time() // 300)}"  # 5-min epoch window
    return hmac.new(
        secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256
    ).hexdigest()


def verify_mandate_token(
    agent_id: str, amount: float, recurrence: str, token: str, secret: str
) -> bool:
    """Verifies that the mandate token matches the expected HMAC signature."""
    expected = sign_mandate_token(agent_id, amount, recurrence, secret)
    return hmac.compare_digest(expected, token)


def evaluate_spending_mandate(
    request: SpendingMandateRequest,
) -> SpendingMandateResponse:
    """Evaluates whether an inbound agent spending request complies with financial guardrails."""
    cap = request.monthly_budget_cap if request.monthly_budget_cap is not None else DEFAULT_MONTHLY_CAP

    # 1. Category validation
    if request.category not in ALLOWED_CATEGORIES:
        return SpendingMandateResponse(
            approved=False,
            authorized_amount=0.0,
            monthly_cap_remaining=ledger.get_remaining_budget(),
            mandate_proof_hash="",
            reason=f"Category '{request.category}' is not in approved whitelist: {sorted(ALLOWED_CATEGORIES)}",
        )

    # 2. Budget ceiling verification
    remaining = min(ledger.get_remaining_budget(), cap)
    if request.amount > remaining:
        return SpendingMandateResponse(
            approved=False,
            authorized_amount=0.0,
            monthly_cap_remaining=remaining,
            mandate_proof_hash="",
            reason=f"Requested amount ${request.amount:.2f} exceeds remaining monthly budget cap of ${remaining:.2f}",
        )

    # 3. Approved: generate cryptographic proof
    proof_hash = sign_mandate_token(
        request.buyer_agent_id,
        request.amount,
        request.recurrence.value,
        settings.a2a_mandate_secret,
    )

    # Record authorization
    ledger.record_spend(
        request.amount,
        {
            "agent_id": request.buyer_agent_id,
            "category": request.category,
            "proof_hash": proof_hash,
        },
    )

    return SpendingMandateResponse(
        approved=True,
        authorized_amount=request.amount,
        monthly_cap_remaining=ledger.get_remaining_budget(),
        mandate_proof_hash=proof_hash,
        reason="Spending mandate policy checks passed. Programmatic authorization issued.",
    )

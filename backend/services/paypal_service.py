"""
PayPal Service Gateway.
Handles PayPal OAuth2 tokens, Orders v2, and Subscriptions.
Operates seamlessly in Mock Mode when credentials are omitted, and switches to
live PayPal Sandbox REST APIs when PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are provided.
"""

import uuid
import logging
from typing import Optional, Dict, Any
import httpx
from ..config import settings
from ..models import PayPalOrderResponse

logger = logging.getLogger("paypal_service")


class PayPalService:
    def __init__(self):
        self.base_url = settings.paypal_base_url
        self.client_id = settings.paypal_client_id
        self.client_secret = settings.paypal_client_secret
        self.mock_mode = (
            settings.mock_external_apis or not self.client_id or not self.client_secret
        )

    async def get_access_token(self) -> Optional[str]:
        """Obtains an OAuth2 bearer token from PayPal Sandbox."""
        if self.mock_mode:
            logger.info(
                "[PayPal] Running in Mock Mode; returning synthetic bearer token."
            )
            return f"MOCK_BEARER_TOKEN_{uuid.uuid4().hex[:16]}"

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(
                    f"{self.base_url}/v1/oauth2/token",
                    auth=(self.client_id, self.client_secret),
                    data={"grant_type": "client_credentials"},
                    headers={"Accept": "application/json"},
                    timeout=10.0,
                )
                res.raise_for_status()
                data = res.json()
                return data.get("access_token")
            except Exception as e:
                logger.error(
                    f"[PayPal] Failed to obtain OAuth token from {self.base_url}: {e}"
                )
                return None

    async def create_order(
        self,
        amount: float,
        currency: str = "USD",
        description: str = "FieldSmith Pro Subscription",
        custom_id: Optional[str] = None,
    ) -> PayPalOrderResponse:
        """Creates a PayPal Checkout Order (v2/checkout/orders)."""
        if self.mock_mode:
            mock_id = f"ORDER-MOCK-{uuid.uuid4().hex[:12].upper()}"
            mock_approval_url = f"https://www.sandbox.paypal.com/checkoutnow?token={mock_id}"
            logger.info(
                f"[PayPal MOCK] Created synthetic order {mock_id} for ${amount:.2f} {currency}"
            )
            return PayPalOrderResponse(
                order_id=mock_id,
                status="CREATED",
                approval_url=mock_approval_url,
                mock_mode=True,
            )

        token = await self.get_access_token()
        if not token:
            raise RuntimeError(
                "Failed to authenticate with PayPal Sandbox API. Verify PAYPAL_CLIENT_ID/SECRET in .env."
            )

        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {"currency_code": currency, "value": f"{amount:.2f}"},
                    "description": description,
                    "custom_id": custom_id or "fieldsmith-a2a",
                }
            ],
            "application_context": {
                "return_url": "http://localhost:5173/payment-success",
                "cancel_url": "http://localhost:5173/payment-cancelled",
                "brand_name": "FieldSmith Pro A2A",
                "user_action": "PAY_NOW",
            },
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{self.base_url}/v2/checkout/orders",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=10.0,
            )
            res.raise_for_status()
            data = res.json()

            approval_url = None
            for link in data.get("links", []):
                if link.get("rel") == "approve":
                    approval_url = link.get("href")
                    break

            return PayPalOrderResponse(
                order_id=data.get("id"),
                status=data.get("status", "CREATED"),
                approval_url=approval_url,
                mock_mode=False,
            )

    async def verify_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Checks the active status of a PayPal Recurring Subscription."""
        if self.mock_mode:
            logger.info(
                f"[PayPal MOCK] Verifying synthetic subscription {subscription_id}"
            )
            return {
                "id": subscription_id,
                "status": "ACTIVE",
                "plan_id": "P-5ML4271244454362WXNWU5NQ",
                "subscriber": {
                    "email_address": "verified-contractor@floorsmith.pro",
                    "name": {"given_name": "Verified", "surname": "Contractor"},
                },
                "mock_mode": True,
            }

        token = await self.get_access_token()
        if not token:
            raise RuntimeError("PayPal authentication failed.")

        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{self.base_url}/v1/billing/subscriptions/{subscription_id}",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0,
            )
            res.raise_for_status()
            return res.json()


paypal_service = PayPalService()

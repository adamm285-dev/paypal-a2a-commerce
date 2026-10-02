"""
Telnyx Telephony Line Provisioning Service.
Binds verified PayPal subscriber identity to dedicated local 10DLC telephone lines.
Supports full mock fallback when TELNYX_API_KEY is not configured in .env.
"""

import uuid
import logging
from typing import Dict, Any
import httpx
from ..config import settings
from ..models import ProvisionRequest, ProvisionResponse

logger = logging.getLogger("telnyx_provisioner")

# Local deterministic DID pool for sandbox/mock testing
MOCK_DID_POOL = [
    "+18638026000",
    "+18635550144",
    "+18635550188",
    "+18635550199",
]


class TelnyxProvisioner:
    def __init__(self):
        self.api_key = settings.telnyx_api_key
        self.mock_mode = settings.mock_external_apis or not self.api_key
        self._allocated_inventory: Dict[str, Dict[str, Any]] = {}

    async def provision_did(self, request: ProvisionRequest) -> ProvisionResponse:
        """Provisions a dedicated 10DLC telephone DID anchored to verified PayPal identity."""
        if self.mock_mode:
            # Deterministic allocation based on subscription ID hash
            idx = abs(hash(request.subscription_id)) % len(MOCK_DID_POOL)
            assigned_did = MOCK_DID_POOL[idx]

            record = {
                "did": assigned_did,
                "subscription_id": request.subscription_id,
                "contractor_email": request.contractor_email,
                "status": "ALLOCATED_AND_ACTIVE",
                "carrier": "Telnyx LLC (Simulated Sandbox Pool)",
                "routing_state": "ACTIVE_10DLC_BOUND",
            }
            self._allocated_inventory[request.subscription_id] = record

            logger.info(
                f"[Telnyx MOCK] Allocated DID {assigned_did} to {request.contractor_email} (Sub: {request.subscription_id})"
            )

            return ProvisionResponse(
                status="ALLOCATED",
                assigned_did=assigned_did,
                carrier="Telnyx LLC",
                routing_state="ACTIVE_10DLC_BOUND",
                subscription_id=request.subscription_id,
            )

        # Live Telnyx API path
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            # Search available phone numbers
            res = await client.get(
                "https://api.telnyx.com/v2/available_phone_numbers",
                params={
                    "filter[country_code]": "US",
                    "filter[national_destination_code]": request.area_code,
                    "filter[limit]": 1,
                },
                headers=headers,
                timeout=10.0,
            )
            res.raise_for_status()
            numbers = res.json().get("data", [])
            if not numbers:
                raise RuntimeError(
                    f"No available numbers found in area code {request.area_code}"
                )

            selected_number = numbers[0]["phone_number"]

            # Order phone number
            order_res = await client.post(
                "https://api.telnyx.com/v2/number_orders",
                headers=headers,
                json={"phone_numbers": [{"phone_number": selected_number}]},
                timeout=10.0,
            )
            order_res.raise_for_status()

            return ProvisionResponse(
                status="ALLOCATED",
                assigned_did=selected_number,
                carrier="Telnyx LLC",
                routing_state="ACTIVE_10DLC_BOUND",
                subscription_id=request.subscription_id,
            )


telnyx_provisioner = TelnyxProvisioner()

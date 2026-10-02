"""
Seller Agent (FieldSmith Pro MCP Server).
Exposes the merchant capability catalog and executes autonomous trade commitments.
Can be queried programmatically by any Model Context Protocol (MCP) compliant client or Buyer Agent.
"""

import json
from typing import Dict, Any, List
from ..models import (
    QuoteRequest,
    SpendingMandateRequest,
    ProvisionRequest,
    DispatchLockRequest,
    ZapierSyncRequest,
    RecurrenceType,
)
from ..services.mandate_evaluator import evaluate_spending_mandate
from ..services.paypal_service import paypal_service
from ..services.telnyx_provisioner import telnyx_provisioner
from ..services.zapier_mcp_dispatcher import zapier_mcp_dispatcher

# Model Context Protocol (MCP) Tool Declarations
SELLER_MCP_TOOLS = [
    {
        "name": "get_service_catalog",
        "description": "Returns all available trade telephony tiers, monthly pricing, and deposit rules.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "calculate_quote",
        "description": "Calculates estimated labor range, waste allowance, and required deposit for a trade scope.",
        "input_schema": {
            "type": "object",
            "required": [
                "trade_id",
                "square_footage",
                "material_type",
                "postal_code",
            ],
            "properties": {
                "trade_id": {"type": "string"},
                "square_footage": {"type": "number"},
                "material_type": {"type": "string"},
                "postal_code": {"type": "string"},
            },
        },
    },
    {
        "name": "evaluate_spending_mandate",
        "description": "Validates buyer agent programmatic budget caps and generates signed mandate proof tokens.",
        "input_schema": {
            "type": "object",
            "required": ["buyer_agent_id", "amount", "recurrence", "category"],
            "properties": {
                "buyer_agent_id": {"type": "string"},
                "amount": {"type": "number"},
                "recurrence": {
                    "type": "string",
                    "enum": ["one_time", "monthly", "annual"],
                },
                "category": {"type": "string"},
            },
        },
    },
    {
        "name": "provision_telecom_line",
        "description": "Allocates a dedicated local 10DLC telephone DID upon verified PayPal subscription.",
        "input_schema": {
            "type": "object",
            "required": ["subscription_id", "contractor_email"],
            "properties": {
                "subscription_id": {"type": "string"},
                "contractor_email": {"type": "string"},
                "area_code": {"type": "string", "default": "863"},
            },
        },
    },
]


class SellerAgent:
    def __init__(self, agent_name: str = "FieldSmith Pro Seller MCP"):
        self.agent_name = agent_name

    def list_mcp_tools(self) -> List[Dict[str, Any]]:
        """Returns the MCP tool definitions for agent tool-use discovery."""
        return SELLER_MCP_TOOLS

    async def get_service_catalog(self) -> Dict[str, Any]:
        """Tool implementation: Returns available trade solutions."""
        return {
            "provider": self.agent_name,
            "currency": "USD",
            "tiers": [
                {
                    "trade_id": "flooring-tile",
                    "title": "Tile & Custom Flooring",
                    "monthly_price": 89.00,
                    "features": [
                        "Sub-500ms Voice Screener",
                        "Substrate Scoping",
                        "Deposit Locking",
                    ],
                },
                {
                    "trade_id": "roofing-storm",
                    "title": "Roofing & Storm Restoration",
                    "monthly_price": 89.00,
                    "features": [
                        "Hail Damage Triage",
                        "Photo Intake Link",
                        "Insurance Intake",
                    ],
                },
                {
                    "trade_id": "plumbing-emergency",
                    "title": "Emergency Plumbing & Rooter",
                    "monthly_price": 89.00,
                    "features": [
                        "Burst Pipe Triage",
                        "Instant GPS Mobilization",
                        "24/7 Screening",
                    ],
                },
            ],
        }

    async def calculate_quote(
        self,
        trade_id: str,
        square_footage: float,
        material_type: str,
        postal_code: str,
    ) -> Dict[str, Any]:
        """Tool implementation: Estimates scope and required deposit."""
        waste = round(square_footage * 1.10, 1)
        deposit = 250.00 if square_footage >= 500 else 150.00
        return {
            "trade_id": trade_id,
            "waste_allowance_sq_ft": waste,
            "required_deposit": deposit,
            "labor_estimate": f"${square_footage * 4.00:.2f} - ${square_footage * 5.50:.2f}",
            "postal_code": postal_code,
        }

    async def verify_spending_mandate(
        self,
        buyer_agent_id: str,
        amount: float,
        recurrence: str,
        category: str,
        monthly_budget_cap: float = 100.00,
    ) -> Dict[str, Any]:
        """Tool implementation: Enforces buyer spending limits."""
        req = SpendingMandateRequest(
            buyerAgentId=buyer_agent_id,
            amount=amount,
            recurrence=RecurrenceType(recurrence),
            category=category,
            monthlyBudgetCap=monthly_budget_cap,
        )
        res = evaluate_spending_mandate(req)
        return res.model_dump(by_alias=True)

    async def provision_telecom_line(
        self,
        subscription_id: str,
        contractor_email: str,
        area_code: str = "863",
    ) -> Dict[str, Any]:
        """Tool implementation: Executes KYC-verified DID allocation."""
        req = ProvisionRequest(
            subscriptionId=subscription_id,
            contractorEmail=contractor_email,
            areaCode=area_code,
        )
        res = await telnyx_provisioner.provision_did(req)
        return res.model_dump(by_alias=True)


seller_agent = SellerAgent()

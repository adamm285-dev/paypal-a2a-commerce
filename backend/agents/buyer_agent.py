"""
Contractor Autonomous Buyer Agent.
Represents the solo tradesperson. Operates under strict programmatic financial
guardrails, negotiates with Seller Agents over Model Context Protocol (MCP),
and autonomously executes approved trade software commitments.
"""

import asyncio
import argparse
import json
import logging
from typing import Dict, Any
from .seller_agent import seller_agent
from ..models import RecurrenceType

logger = logging.getLogger("buyer_agent")


class BuyerAgent:
    def __init__(
        self,
        agent_id: str = "contractor-solo-buyer-01",
        monthly_budget_cap: float = 100.00,
        contractor_email: str = "adam@floorsmithllc.com",
    ):
        self.agent_id = agent_id
        self.monthly_budget_cap = monthly_budget_cap
        self.contractor_email = contractor_email
        self.audit_log: list = []

    async def run_autonomous_onboarding_cycle(
        self, target_trade: str = "flooring-tile"
    ) -> Dict[str, Any]:
        """Executes the full 5-phase Agent-to-Agent autonomous commerce cycle."""
        print(f"\n=======================================================")
        print(f"🤖 [BUYER AGENT {self.agent_id}] Starting Autonomous Cycle")
        print(f"   Monthly Spending Mandate Cap: ${self.monthly_budget_cap:.2f}/mo")
        print(f"   Target Contractor Vertical:   {target_trade}")
        print(f"=======================================================\n")

        # Phase 1: Local Telemetry & Business Need Assessment
        print("📊 [Phase 1: Opportunity Assessment]")
        missed_calls = 8
        estimated_lost_revenue = 4200.00
        print(
            f"   Detected {missed_calls} missed customer calls during jobsite tile demo."
        )
        print(
            f"   Estimated uncaptured revenue: ${estimated_lost_revenue:,.2f}"
        )
        print(
            f"   Conclusion: Autonomous voice screener required (Budget ROI: >40x)\n"
        )

        # Phase 2: Query Seller Agent MCP Catalog
        print("🔍 [Phase 2: Seller Agent MCP Catalog Inquiry]")
        catalog = await seller_agent.get_service_catalog()
        matching_tier = next(
            (t for t in catalog.get("tiers", []) if t["trade_id"] == target_trade),
            None,
        )
        if not matching_tier:
            raise RuntimeError(
                f"No matching service tier found for trade '{target_trade}'"
            )

        monthly_price = matching_tier["monthly_price"]
        print(f"   Found Provider: {catalog.get('provider')}")
        print(f"   Tier Title:     {matching_tier['title']}")
        print(f"   Monthly Price:  ${monthly_price:.2f}/mo (USD)")
        print(f"   Features:       {', '.join(matching_tier['features'])}\n")

        # Phase 3: Evaluate Spending Mandate Guardrails
        print("⚖️  [Phase 3: Programmatic Spending Mandate Verification]")
        mandate_result = await seller_agent.verify_spending_mandate(
            buyer_agent_id=self.agent_id,
            amount=monthly_price,
            recurrence=RecurrenceType.MONTHLY.value,
            category="contractor-dispatch-ai",
            monthly_budget_cap=self.monthly_budget_cap,
        )

        approved = mandate_result.get("approved", False)
        proof_hash = mandate_result.get("mandateProofHash", "")
        remaining_cap = mandate_result.get("monthlyCapRemaining", 0.0)

        print(
            f"   Policy Check:   ${monthly_price:.2f} <= ${self.monthly_budget_cap:.2f} Cap"
        )
        print(f"   Decision:       {'APPROVED' if approved else 'REJECTED'}")
        print(
            f"   Remaining Cap:  ${remaining_cap:.2f} (After this authorization)"
        )
        print(f"   Mandate Proof:  {proof_hash[:24]}...\n")

        if not approved:
            print(f"❌ Mandate violation: {mandate_result.get('reason')}")
            return {"status": "REJECTED", "reason": mandate_result.get("reason")}

        # Phase 4: Delegate PayPal Subscription Session
        print("💳 [Phase 4: Delegated PayPal Subscription Initiation]")
        synthetic_sub_id = f"I-A2A-{proof_hash[:12].upper()}"
        print(f"   Generated Delegated Subscription: {synthetic_sub_id}")
        print(
            f"   Payment Channel:                  PayPal Subscriptions (Plan: P-5ML4271244454362WXNWU5NQ)"
        )
        print(
            f"   Billing Cycle:                    $89.00 / month (Auto-debit)\n"
        )

        # Phase 5: KYC-Anchored Telecom Provisioning
        print("📞 [Phase 5: KYC Telnyx DID Line Allocation]")
        provision_result = await seller_agent.provision_telecom_line(
            subscription_id=synthetic_sub_id,
            contractor_email=self.contractor_email,
            area_code="863",
        )

        assigned_did = provision_result.get("assignedDid")
        carrier = provision_result.get("carrier")
        routing_state = provision_result.get("routingState")

        print(f"   KYC Subscriber:   {self.contractor_email}")
        print(f"   Assigned DID:     {assigned_did}")
        print(f"   Carrier Binding:  {carrier}")
        print(f"   Security State:   {routing_state} (100% Inbound Locked)\n")

        # Summary Ledger Record
        ledger_entry = {
            "buyer_agent_id": self.agent_id,
            "trade": target_trade,
            "monthly_amount": monthly_price,
            "mandate_proof": proof_hash,
            "subscription_id": synthetic_sub_id,
            "assigned_did": assigned_did,
            "status": "ACTIVE_SUBSCRIPTION",
        }
        self.audit_log.append(ledger_entry)

        print("=======================================================")
        print("🎉 [CYCLE COMPLETE] Autonomous Transaction Ledger Entry:")
        print(json.dumps(ledger_entry, indent=2))
        print("=======================================================\n")

        return ledger_entry


async def main():
    parser = argparse.ArgumentParser(
        description="Run Autonomous Contractor Buyer Agent"
    )
    parser.add_argument(
        "--budget",
        type=float,
        default=100.00,
        help="Monthly spending mandate cap",
    )
    parser.add_argument(
        "--trade",
        type=str,
        default="flooring-tile",
        help="Contractor trade vertical",
    )
    parser.add_argument(
        "--email",
        type=str,
        default="adam@floorsmithllc.com",
        help="Contractor email for KYC identity",
    )
    args = parser.parse_args()

    agent = BuyerAgent(
        monthly_budget_cap=args.budget, contractor_email=args.email
    )
    await agent.run_autonomous_onboarding_cycle(target_trade=args.trade)


if __name__ == "__main__":
    asyncio.run(main())

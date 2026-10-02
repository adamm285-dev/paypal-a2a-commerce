"""
Pydantic data models for FieldSmith Pro A2A Commerce & Multi-Agent Network.
Maps directly to openapi.yaml schemas.
"""

from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class RecurrenceType(str, Enum):
    ONE_TIME = "one_time"
    MONTHLY = "monthly"
    ANNUAL = "annual"


# --- Service Catalog Models ---
class TradeService(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    title: str
    monthly_subscription: float = Field(alias="monthlySubscription")
    deposit_range: str = Field(alias="depositRange")
    description: str


class CatalogResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: str = "active"
    currency: str = "USD"
    trades: List[TradeService]


# --- Quoting & Scoping Models ---
class QuoteRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    trade_id: str = Field(alias="tradeId")
    square_footage: float = Field(alias="squareFootage")
    material_type: str = Field(alias="materialType")
    postal_code: str = Field(alias="postalCode")


class QuoteResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    trade_id: str = Field(alias="tradeId")
    estimated_labor_range: str = Field(alias="estimatedLaborRange")
    waste_allowance_sq_ft: float = Field(alias="wasteAllowanceSqFt")
    required_deposit: float = Field(alias="requiredDeposit")
    deposit_policy: str = Field(alias="depositPolicy")


# --- Spending Mandate Models ---
class SpendingMandateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    buyer_agent_id: str = Field(alias="buyerAgentId")
    amount: float
    recurrence: RecurrenceType
    category: str
    monthly_budget_cap: Optional[float] = Field(
        default=100.00, alias="monthlyBudgetCap"
    )


class SpendingMandateResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    approved: bool
    authorized_amount: float = Field(alias="authorizedAmount")
    monthly_cap_remaining: float = Field(alias="monthlyCapRemaining")
    mandate_proof_hash: str = Field(alias="mandateProofHash")
    reason: Optional[str] = None


# --- Telephony Provisioning Models ---
class ProvisionRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    subscription_id: str = Field(alias="subscriptionId")
    contractor_email: str = Field(alias="contractorEmail")
    area_code: str = Field(default="863", alias="areaCode")


class ProvisionResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: str
    assigned_did: str = Field(alias="assignedDid")
    carrier: str
    routing_state: str = Field(alias="routingState")
    subscription_id: str = Field(alias="subscriptionId")


# --- Territory Dispatch Models ---
class DispatchLockRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    lead_id: str = Field(alias="leadId")
    territory_zone: str = Field(alias="territoryZone")
    slot_start_iso: str = Field(alias="slotStartIso")
    paypal_transaction_id: str = Field(alias="paypalTransactionId")


class DispatchLockResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    success: bool
    slot_locked_until: str = Field(alias="slotLockedUntil")
    crew_assigned: str = Field(alias="crewAssigned")
    territory_zone: str = Field(alias="territoryZone")


# --- Zapier MCP Models ---
class ZapierSyncRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    lead_id: str = Field(alias="leadId")
    customer_name: str = Field(alias="customerName")
    customer_phone: str = Field(alias="customerPhone")
    property_address: str = Field(alias="propertyAddress")
    deposit_amount: float = Field(alias="depositAmount")
    paypal_txn_id: str = Field(alias="paypalTxnId")


class ZapierSyncResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    jobber_quote_id: str = Field(alias="jobberQuoteId")
    qbo_draft_invoice_id: str = Field(alias="qboDraftInvoiceId")
    google_calendar_event_id: str = Field(alias="googleCalendarEventId")
    status: str


# --- PayPal Order Management Models ---
class PayPalOrderCreateRequest(BaseModel):
    amount: float
    currency: str = "USD"
    description: str
    custom_id: Optional[str] = None


class PayPalOrderResponse(BaseModel):
    order_id: str
    status: str
    approval_url: Optional[str] = None
    mock_mode: bool

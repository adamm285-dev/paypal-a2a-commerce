"""
Integration tests for FastAPI REST endpoints matching openapi.yaml contract.
"""

from fastapi.testclient import TestClient
from ..server import app

client = TestClient(app)


def test_health_check_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["mock_mode"] is True


def test_get_trade_catalog():
    res = client.get("/api/agent/catalog")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "active"
    assert len(data["trades"]) >= 3
    trade_ids = [t["id"] for t in data["trades"]]
    assert "flooring-tile" in trade_ids


def test_calculate_trade_quote():
    payload = {
        "tradeId": "flooring-tile",
        "squareFootage": 600,
        "materialType": "porcelain-plank",
        "postalCode": "33813",
    }
    res = client.post("/api/agent/quote", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["wasteAllowanceSqFt"] == 660.0
    assert data["requiredDeposit"] == 250.00
    assert "credited against final invoice" in data["depositPolicy"]


def test_evaluate_spending_mandate_endpoint():
    payload = {
        "buyerAgentId": "test-buyer-agent",
        "amount": 89.00,
        "recurrence": "monthly",
        "category": "contractor-dispatch-ai",
        "monthlyBudgetCap": 100.00,
    }
    res = client.post("/api/agent/spending-mandate/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["approved"] is True
    assert data["authorizedAmount"] == 89.00
    assert len(data["mandateProofHash"]) == 64


def test_provision_line_endpoint():
    payload = {
        "subscriptionId": "I-TEST-SUB-9941",
        "contractorEmail": "test@floorsmith.pro",
        "areaCode": "863",
    }
    res = client.post("/api/agent/provision", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "ALLOCATED"
    assert data["assignedDid"].startswith("+1863")
    assert data["routingState"] == "ACTIVE_10DLC_BOUND"


def test_lock_dispatch_slot():
    payload = {
        "leadId": "lead-sarah-jenkins",
        "territoryZone": "Zone 2 - South Lakeland",
        "slotStartIso": "2026-10-06T10:00:00-04:00",
        "paypalTransactionId": "TXN-998811",
    }
    res = client.post("/api/agent/dispatch/lock-slot", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Crew B" in data["crewAssigned"]


def test_trigger_zapier_mcp_sync():
    payload = {
        "leadId": "lead-sarah-jenkins",
        "customerName": "Sarah Jenkins",
        "customerPhone": "+18635550199",
        "propertyAddress": "4822 Cleveland Heights Blvd, Lakeland, FL 33813",
        "depositAmount": 250.00,
        "paypalTxnId": "TXN-998811",
    }
    res = client.post("/api/mcp/zapier-sync", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "COMPLETED"
    assert data["jobberQuoteId"].startswith("JOB-")
    assert data["qboDraftInvoiceId"].startswith("QBO-")
    assert data["googleCalendarEventId"].startswith("gcal_")


def test_create_paypal_order_mock():
    payload = {
        "amount": 250.00,
        "currency": "USD",
        "description": "Mobilization Deposit",
    }
    res = client.post("/api/paypal/create-order", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "CREATED"
    assert data["mock_mode"] is True
    assert "ORDER-MOCK-" in data["order_id"]

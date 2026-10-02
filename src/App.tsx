import { useState, useMemo, useCallback } from 'react';
import { AgStudio } from 'ag-studio-react';
import { AgStudioLicenseManager } from 'ag-studio';
import type { AgDataSourcesDefinition, AgStudioMode } from 'ag-studio';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  ShieldCheck,
  Zap,
  PhoneCall,
  Sliders,
  Eye,
  Edit3,
  X,
  Lock,
  LayoutGrid,
  Calendar,
  Network,
} from 'lucide-react';
import {
  initialA2aTransactions,
  tradeImpactData,
  kycAuditData,
  initialDashboardState,
  type A2aTransaction,
} from './data/telemetryData';
import {
  evaluateAgentNegotiation,
  executeProvisioningAfterSubscription,
  PAYPAL_CONFIG,
  type AgentNegotiationRequest,
  type AgentNegotiationResponse,
  type ProvisioningResult,
} from './services/paypalAgentService';
import { BryntumDispatchScheduler } from './components/BryntumDispatchScheduler';
import { ZapierMcpView } from './components/ZapierMcpView';
import './App.css';

// 1. Initialize AG Studio License if supplied via environment
const studioLicenseKey = import.meta.env.VITE_AG_STUDIO_LICENSE_KEY;
if (studioLicenseKey) {
  AgStudioLicenseManager.setLicenseKey(studioLicenseKey);
  console.log('[AG Studio]: License key registered.');
} else {
  console.log('[AG Studio]: Running in local developer trial mode.');
}

export function App() {
  const [activeTab, setActiveTab] = useState<'ag-studio' | 'bryntum' | 'zapier'>('ag-studio');
  const [mode, setMode] = useState<AgStudioMode>('view');
  const [transactions, setTransactions] = useState<A2aTransaction[]>(initialA2aTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<AgentNegotiationResponse | null>(null);
  const [provisioningResult, setProvisioningResult] = useState<ProvisioningResult | null>(null);

  // Form state for Buyer Agent simulation
  const [contractorName, setContractorName] = useState('Marcus Miller');
  const [businessEntity, setBusinessEntity] = useState('Miller Custom Flooring LLC');
  const [tradeVertical, setTradeVertical] = useState('Tile & Flooring');
  const [maxMonthlyBudget, setMaxMonthlyBudget] = useState(100.0);

  // Memoize data sources to maintain reference stability for AG Studio
  const studioData: AgDataSourcesDefinition = useMemo(() => {
    return {
      sources: [
        {
          id: 'transactions',
          data: transactions,
          fields: [
            { id: 'id', name: 'Transaction ID', format: 'textFormat' },
            { id: 'timestamp', name: 'Timestamp', format: 'textFormat' },
            { id: 'buyer_agent', name: 'Buyer Agent ID', format: 'textFormat' },
            { id: 'contractor_name', name: 'Contractor', format: 'textFormat' },
            { id: 'trade_vertical', name: 'Trade Vertical', format: 'textFormat' },
            { id: 'service_plan', name: 'Service Plan', format: 'textFormat' },
            { id: 'monthly_amount', name: 'Monthly Fee', format: 'currencyFormat' },
            { id: 'paypal_sub_id', name: 'PayPal Sub ID', format: 'textFormat' },
            { id: 'kyc_status', name: 'KYC Status', format: 'textFormat' },
            { id: 'kyc_legal_entity', name: 'Verified Legal Entity', format: 'textFormat' },
            { id: 'allocated_did', name: 'Allocated DID Phone', format: 'textFormat' },
            { id: 'tcpa_guard', name: 'TCPA Compliance Guard', format: 'textFormat' },
            { id: 'status', name: 'Subscription State', format: 'textFormat' },
          ],
        },
        {
          id: 'trade_impact',
          data: tradeImpactData,
          fields: [
            { id: 'trade', name: 'Trade Vertical', format: 'textFormat' },
            { id: 'missed_calls_prevented', name: 'Missed Calls Saved', format: 'integerFormat' },
            { id: 'leads_captured', name: 'Booked Leads', format: 'integerFormat' },
            { id: 'recovered_revenue', name: 'Recovered Revenue', format: 'currencyFormat' },
            { id: 'subscription_cost', name: 'PayPal Cost ($89/mo)', format: 'currencyFormat' },
            { id: 'roi_multiple', name: 'ROI Multiplier (x)', format: 'decimalFormat' },
          ],
        },
        {
          id: 'kyc_audit',
          data: kycAuditData,
          fields: [
            { id: 'allocated_did', name: 'Assigned DID Phone', format: 'textFormat' },
            { id: 'carrier_resporg', name: 'Carrier RespOrg', format: 'textFormat' },
            { id: 'tcr_campaign_id', name: '10DLC TCR Campaign', format: 'textFormat' },
            { id: 'subscriber_legal_name', name: 'KYC Verified Subscriber', format: 'textFormat' },
            { id: 'paypal_payer_id', name: 'PayPal Verified Payer ID', format: 'textFormat' },
            { id: 'autodialer_blocked', name: 'Autodialer Lock (FCC/TCPA)', format: 'booleanFormat' },
            { id: 'statutory_shield_status', name: 'Statutory Shield Status', format: 'textFormat' },
          ],
        },
      ],
    };
  }, [transactions]);

  // Start Autonomous Negotiation Simulation
  const handleStartNegotiation = useCallback(() => {
    setIsNegotiating(true);
    setProvisioningResult(null);

    const req: AgentNegotiationRequest = {
      contractorName,
      businessEntity,
      tradeVertical,
      maxMonthlyBudget,
      missedCallLossEstimate: 6200.0,
    };

    setTimeout(() => {
      const res = evaluateAgentNegotiation(req);
      setNegotiationResult(res);
      setIsNegotiating(false);
    }, 600);
  }, [contractorName, businessEntity, tradeVertical, maxMonthlyBudget]);

  // Complete Subscription & Provision Line
  const handleSubscriptionApproved = useCallback(
    async (subId: string) => {
      const result = await executeProvisioningAfterSubscription(subId, businessEntity);
      setProvisioningResult(result);

      // Append new autonomous transaction to live AG Studio dataset
      const newTxn: A2aTransaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        buyer_agent: `AutonomousBuyerAgent-${contractorName.split(' ')[0]}-${tradeVertical.replace(/\s+/g, '')}`,
        contractor_name: contractorName,
        trade_vertical: tradeVertical,
        service_plan: 'AI Screener Pro (PayPal A2A)',
        monthly_amount: 89.0,
        paypal_sub_id: subId,
        kyc_status: 'VERIFIED (PayPal Identity Bound)',
        kyc_legal_entity: businessEntity,
        allocated_did: result.allocatedDid,
        tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
        status: 'ACTIVE_STREAMING',
      };

      setTransactions((prev) => [newTxn, ...prev]);
    },
    [contractorName, businessEntity, tradeVertical]
  );

  return (
    <div className="app-container">
      {/* Executive Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Zap size={22} />
          </div>
          <div className="brand-titles">
            <h1>FieldSmith Pro &mdash; Autonomous A2A Commerce Portal</h1>
            <p className="brand-subtitle">
              Solo Tradesperson Telephony Fleet &bull; Powered by PayPal Agentic Commerce, AG Studio &amp; Bryntum
            </p>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: '8px', padding: '3px', border: '1px solid #334155' }}>
          <button
            onClick={() => setActiveTab('ag-studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'ag-studio' ? '#0284c7' : 'transparent',
              color: activeTab === 'ag-studio' ? '#fff' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LayoutGrid size={14} /> AG Studio Fleet Ledger
          </button>
          <button
            onClick={() => setActiveTab('bryntum')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'bryntum' ? '#0284c7' : 'transparent',
              color: activeTab === 'bryntum' ? '#fff' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Calendar size={14} /> Bryntum Territory Dispatch
          </button>
          <button
            onClick={() => setActiveTab('zapier')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'zapier' ? '#0284c7' : 'transparent',
              color: activeTab === 'zapier' ? '#fff' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Network size={14} /> Zapier MCP Bridge
          </button>
        </div>

        <div className="header-actions">
          {/* AG Studio Mode toggle (only visible when in AG Studio view) */}
          {activeTab === 'ag-studio' && (
            <div className="mode-toggle-group">
              <button
                className={`mode-btn ${mode === 'view' ? 'active' : ''}`}
                onClick={() => setMode('view')}
                title="Executive Dashboard View"
              >
                <Eye size={14} /> View
              </button>
              <button
                className={`mode-btn ${mode === 'edit' ? 'active' : ''}`}
                onClick={() => setMode('edit')}
                title="Interactive Report Editor"
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>
          )}

          <button className="btn-simulate" onClick={() => setIsModalOpen(true)}>
            <Sliders size={15} /> Simulate A2A Purchase
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="studio-canvas-container">
        {activeTab === 'ag-studio' && (
          <AgStudio
            data={studioData}
            mode={mode}
            initialState={initialDashboardState}
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {activeTab === 'bryntum' && <BryntumDispatchScheduler />}

        {activeTab === 'zapier' && <ZapierMcpView />}
      </main>

      {/* Modal: A2A Commerce Negotiation & Subscription Simulator */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <PhoneCall size={18} /> Autonomous Agent-to-Agent Commerce Simulator
              </h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Simulate how a solo contractor&apos;s <strong>Autonomous Buyer Agent</strong> discovers call leaks,
                checks local spending limits, negotiates with FieldSmith&apos;s Seller MCP Server, and executes a
                recurring PayPal subscription with verified KYC identity.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  backgroundColor: '#0f172a',
                  padding: '14px',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Contractor Name
                  </label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Legal Business Entity
                  </label>
                  <input
                    type="text"
                    value={businessEntity}
                    onChange={(e) => setBusinessEntity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Trade Vertical
                  </label>
                  <select
                    value={tradeVertical}
                    onChange={(e) => setTradeVertical(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Tile & Flooring">Tile &amp; Custom Flooring</option>
                    <option value="Emergency Plumbing">Emergency 24/7 Plumbing</option>
                    <option value="Roofing & Storm">Roofing &amp; Storm Restoration</option>
                    <option value="Towing & Roadside">Towing &amp; Heavy Roadside</option>
                    <option value="HVAC & Mechanical">HVAC &amp; Mechanical Service</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Max Monthly Spending Mandate ($)
                  </label>
                  <input
                    type="number"
                    value={maxMonthlyBudget}
                    onChange={(e) => setMaxMonthlyBudget(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <button
                className="btn-simulate"
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                onClick={handleStartNegotiation}
                disabled={isNegotiating}
              >
                {isNegotiating ? 'Evaluating Telemetry & Mandate...' : '1. Run A2A Autonomous Negotiation'}
              </button>

              {negotiationResult && (
                <div className="negotiation-panel">
                  <div className="negotiation-line">[BuyerAgent]: Ingesting telephony logs... Missed call loss: $6,200/mo.</div>
                  <div className="negotiation-line">[BuyerAgent]: Querying FieldSmith MCP Catalog: {negotiationResult.sellerMcpEndpoint}</div>
                  <div className="negotiation-line">[SellerMCP]: Quoted Plan: {negotiationResult.agreedPlanName} @ ${negotiationResult.monthlyFee}/mo</div>
                  <div className={`negotiation-line ${negotiationResult.mandateSatisfied ? 'success' : 'warning'}`}>
                    {negotiationResult.message}
                  </div>
                  {negotiationResult.mandateSatisfied && (
                    <div className="negotiation-line success">
                      [A2A Protocol]: Spending mandate approved. Ready for delegated PayPal subscription token.
                    </div>
                  )}
                </div>
              )}

              {/* KYC Telecom Protection Notice */}
              <div className="kyc-verification-box">
                <Lock size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div className="kyc-details">
                  <h4>Statutory KYC Telecom Anchor (FCC &amp; TCPA Guard)</h4>
                  <p>
                    Unlike anonymous bot services, lines are provisioned strictly via verified PayPal subscriber identity.
                    The provisioned line is locked 100% to inbound screening &mdash; zero autodialers, zero unsolicited outbound robocalls.
                  </p>
                </div>
              </div>

              {/* Interactive PayPal Payment Integration */}
              {negotiationResult && negotiationResult.mandateSatisfied && !provisioningResult && (
                <div className="paypal-interactive-wrapper">
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                    2. Execute Verified PayPal Subscription
                  </h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                    Subscribes to $89.00/month recurring plan. Once verified, the Seller Agent allocates a live Telnyx DID.
                  </p>

                  <div style={{ width: '100%', maxWidth: '320px', minHeight: '50px' }}>
                    <PayPalScriptProvider
                      options={{
                        clientId: PAYPAL_CONFIG.clientId,
                        vault: true,
                        intent: 'subscription',
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'subscribe' }}
                        createSubscription={(_data, actions) => {
                          return actions.subscription.create({
                            plan_id: PAYPAL_CONFIG.planId,
                          });
                        }}
                        onApprove={async (data) => {
                          const subId = data.subscriptionID || `I-PP${Math.floor(100000 + Math.random() * 900000)}`;
                          await handleSubscriptionApproved(subId);
                        }}
                        onError={(err) => {
                          console.warn('[PayPal]: Sandbox interaction fallback trigger:', err);
                          const simulatedSubId = `I-PP${Math.floor(100000 + Math.random() * 900000)}`;
                          handleSubscriptionApproved(simulatedSubId);
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>

                  {/* Fallback button for instant one-click demo */}
                  <button
                    onClick={() => {
                      const simulatedSubId = `I-AUTONOMOUS-${Math.floor(100000 + Math.random() * 900000)}`;
                      handleSubscriptionApproved(simulatedSubId);
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px dashed #475569',
                      color: '#94a3b8',
                      fontSize: '11px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    (Demo Shortcut: Simulate Instant PayPal Approval)
                  </button>
                </div>
              )}

              {/* Provisioning Success Confirmation */}
              {provisioningResult && (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700 }}>
                    <ShieldCheck size={20} />
                    <span>A2A Transaction Complete &amp; Telecom Line Live!</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#f8fafc', lineHeight: 1.6 }}>
                    <div>
                      <strong>PayPal Subscription:</strong>{' '}
                      <span style={{ color: '#38bdf8' }}>{provisioningResult.subscriptionId}</span>
                    </div>
                    <div>
                      <strong>Allocated DID:</strong>{' '}
                      <span style={{ color: '#fbbf24' }}>{provisioningResult.allocatedDid}</span>
                    </div>
                    <div>
                      <strong>Carrier / RespOrg:</strong> {provisioningResult.carrierRespOrg}
                    </div>
                    <div>
                      <strong>KYC Bound Entity:</strong> {provisioningResult.kycBoundEntity}
                    </div>
                    <div>
                      <strong>TCPA Guard:</strong>{' '}
                      <span style={{ color: '#34d399' }}>100% INBOUND ONLY (ZERO AUTODIALING)</span>
                    </div>
                  </div>
                  <button
                    className="btn-simulate"
                    style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    View in Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

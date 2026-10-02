import type { AgDataSourcesDefinition, AgReportState } from 'ag-studio';

export interface A2aTransaction {
  id: string;
  timestamp: string;
  buyer_agent: string;
  contractor_name: string;
  trade_vertical: string;
  service_plan: string;
  monthly_amount: number;
  paypal_sub_id: string;
  kyc_status: string;
  kyc_legal_entity: string;
  allocated_did: string;
  tcpa_guard: string;
  status: string;
}

export const initialA2aTransactions: A2aTransaction[] = [
  {
    id: 'TXN-9021',
    timestamp: '2026-10-02 02:14:22',
    buyer_agent: 'AutonomousBuyerAgent-Marcus-Tile',
    contractor_name: 'Marcus Miller',
    trade_vertical: 'Tile & Flooring',
    service_plan: 'AI Screener Pro (1 Dedicated Line)',
    monthly_amount: 89.00,
    paypal_sub_id: 'I-BW452NX993L2',
    kyc_status: 'VERIFIED (PayPal Identity Bound)',
    kyc_legal_entity: 'Miller Custom Flooring LLC',
    allocated_did: '+1 (863) 802-6000',
    tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
    status: 'ACTIVE_STREAMING',
  },
  {
    id: 'TXN-9022',
    timestamp: '2026-10-02 01:45:10',
    buyer_agent: 'AutonomousBuyerAgent-Dave-Plumbing',
    contractor_name: 'Dave Vance',
    trade_vertical: 'Emergency Plumbing',
    service_plan: 'AI Screener Dispatch (GPS + Deposit)',
    monthly_amount: 89.00,
    paypal_sub_id: 'I-PL782MK110Q9',
    kyc_status: 'VERIFIED (PayPal Identity Bound)',
    kyc_legal_entity: 'Vance Rapid Drain & Plumbing Inc',
    allocated_did: '+1 (863) 356-7801',
    tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
    status: 'ACTIVE_STREAMING',
  },
  {
    id: 'TXN-9023',
    timestamp: '2026-10-01 23:18:44',
    buyer_agent: 'AutonomousBuyerAgent-Elena-Roofing',
    contractor_name: 'Elena Rostova',
    trade_vertical: 'Roofing & Storm',
    service_plan: 'AI Screener Commercial (Photo Scope)',
    monthly_amount: 89.00,
    paypal_sub_id: 'I-RF994ZZ331A8',
    kyc_status: 'VERIFIED (PayPal Identity Bound)',
    kyc_legal_entity: 'Apex Storm & Roofing Specialists',
    allocated_did: '+1 (863) 356-7802',
    tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
    status: 'ACTIVE_STREAMING',
  },
  {
    id: 'TXN-9024',
    timestamp: '2026-10-01 21:02:15',
    buyer_agent: 'AutonomousBuyerAgent-Hank-Towing',
    contractor_name: 'Hank Schrader',
    trade_vertical: 'Towing & Roadside',
    service_plan: 'AI Screener Dispatch (24/7 Roadside)',
    monthly_amount: 89.00,
    paypal_sub_id: 'I-TW551PP882B4',
    kyc_status: 'VERIFIED (PayPal Identity Bound)',
    kyc_legal_entity: 'Schrader Heavy Duty Towing LLC',
    allocated_did: '+1 (863) 356-7803',
    tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
    status: 'ACTIVE_STREAMING',
  },
  {
    id: 'TXN-9025',
    timestamp: '2026-10-01 19:30:00',
    buyer_agent: 'AutonomousBuyerAgent-Sam-HVAC',
    contractor_name: 'Samira Khan',
    trade_vertical: 'HVAC & Mechanical',
    service_plan: 'AI Screener Pro (Seasonal Dispatch)',
    monthly_amount: 89.00,
    paypal_sub_id: 'I-HV119CC447T1',
    kyc_status: 'VERIFIED (PayPal Identity Bound)',
    kyc_legal_entity: 'Khan Climate & Cooling Co',
    allocated_did: '+1 (863) 356-7804',
    tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
    status: 'ACTIVE_STREAMING',
  },
  {
    id: 'TXN-9026',
    timestamp: '2026-10-01 16:11:58',
    buyer_agent: 'AutonomousBuyerAgent-Pamela-Accounting',
    contractor_name: 'Pamela Green',
    trade_vertical: 'Contractor Tax & Bookkeeping',
    service_plan: 'AI Screener Receptionist (Sole Prop)',
    monthly_amount: 89.00,
    paypal_sub_id: 'I-TX882GG990W3',
    kyc_status: 'VERIFIED (PayPal Identity Bound)',
    kyc_legal_entity: 'Express 1040 Inc',
    allocated_did: '+1 (863) 356-7805',
    tcpa_guard: '100% INBOUND ONLY (ZERO ROBOCALLS)',
    status: 'ACTIVE_STREAMING',
  }
];

export interface TradeImpact {
  trade: string;
  missed_calls_prevented: number;
  leads_captured: number;
  recovered_revenue: number;
  subscription_cost: number;
  roi_multiple: number;
}

export const tradeImpactData: TradeImpact[] = [
  {
    trade: 'Tile & Flooring',
    missed_calls_prevented: 18,
    leads_captured: 14,
    recovered_revenue: 12600.0,
    subscription_cost: 89.0,
    roi_multiple: 141.5,
  },
  {
    trade: 'Emergency Plumbing',
    missed_calls_prevented: 24,
    leads_captured: 21,
    recovered_revenue: 18900.0,
    subscription_cost: 89.0,
    roi_multiple: 212.3,
  },
  {
    trade: 'Roofing & Storm',
    missed_calls_prevented: 12,
    leads_captured: 9,
    recovered_revenue: 31500.0,
    subscription_cost: 89.0,
    roi_multiple: 353.9,
  },
  {
    trade: 'Towing & Roadside',
    missed_calls_prevented: 31,
    leads_captured: 29,
    recovered_revenue: 7250.0,
    subscription_cost: 89.0,
    roi_multiple: 81.4,
  },
  {
    trade: 'HVAC & Mechanical',
    missed_calls_prevented: 16,
    leads_captured: 13,
    recovered_revenue: 15600.0,
    subscription_cost: 89.0,
    roi_multiple: 175.2,
  },
];

export interface KycAuditRecord {
  allocated_did: string;
  carrier_resporg: string;
  tcr_campaign_id: string;
  subscriber_legal_name: string;
  paypal_payer_id: string;
  autodialer_blocked: boolean;
  statutory_shield_status: string;
}

export const kycAuditData: KycAuditRecord[] = [
  {
    allocated_did: '+1 (863) 802-6000',
    carrier_resporg: 'Telnyx (Wholesale RespOrg)',
    tcr_campaign_id: '4b3001a0-c5af-db76-3128-a88a3d668ff6',
    subscriber_legal_name: 'Marcus Miller (Miller Custom Flooring LLC)',
    paypal_payer_id: 'PAYER-MM8912',
    autodialer_blocked: true,
    statutory_shield_status: '100% PASS (ZERO TCPA EXPOSURE)',
  },
  {
    allocated_did: '+1 (863) 356-7801',
    carrier_resporg: 'Telnyx (Wholesale RespOrg)',
    tcr_campaign_id: '4b3001a0-c5af-db76-3128-a88a3d668ff6',
    subscriber_legal_name: 'Dave Vance (Vance Rapid Drain & Plumbing Inc)',
    paypal_payer_id: 'PAYER-DV3391',
    autodialer_blocked: true,
    statutory_shield_status: '100% PASS (ZERO TCPA EXPOSURE)',
  },
  {
    allocated_did: '+1 (863) 356-7802',
    carrier_resporg: 'Telnyx (Wholesale RespOrg)',
    tcr_campaign_id: '4b3001a0-c5af-db76-3128-a88a3d668ff6',
    subscriber_legal_name: 'Elena Rostova (Apex Storm & Roofing Specialists)',
    paypal_payer_id: 'PAYER-ER4410',
    autodialer_blocked: true,
    statutory_shield_status: '100% PASS (ZERO TCPA EXPOSURE)',
  },
  {
    allocated_did: '+1 (863) 356-7803',
    carrier_resporg: 'Telnyx (Wholesale RespOrg)',
    tcr_campaign_id: '4b3001a0-c5af-db76-3128-a88a3d668ff6',
    subscriber_legal_name: 'Hank Schrader (Schrader Heavy Duty Towing LLC)',
    paypal_payer_id: 'PAYER-HS7723',
    autodialer_blocked: true,
    statutory_shield_status: '100% PASS (ZERO TCPA EXPOSURE)',
  },
];

export const a2aDataSources: AgDataSourcesDefinition = {
  sources: [
    {
      id: 'transactions',
      data: initialA2aTransactions,
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
        { id: 'allocated_did', name: 'Allocated DID', format: 'textFormat' },
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

export const initialDashboardState: AgReportState = {
  selectedPageId: 'fleet-telemetry',
  pages: [
    {
      id: 'fleet-telemetry',
      widgets: {
        'kpi-mrr': {
          type: 'value',
          dataMapping: {
            value: [{ id: 'transactions.monthly_amount', aggregation: 'sum' }],
          },
          format: {
            title: { enabled: true, text: 'Total A2A Active Subscriptions' },
          },
        },
        'kpi-leads': {
          type: 'value',
          dataMapping: {
            value: [{ id: 'trade_impact.leads_captured', aggregation: 'sum' }],
          },
          format: {
            title: { enabled: true, text: 'Total Booked Leads Captured' },
          },
        },
        'kpi-revenue': {
          type: 'value',
          dataMapping: {
            value: [{ id: 'trade_impact.recovered_revenue', aggregation: 'sum' }],
          },
          format: {
            title: { enabled: true, text: 'Total Net Revenue Recovered' },
          },
        },
        'chart-recovered-revenue': {
          type: 'bar-chart-grouped',
          dataMapping: {
            categoryKey: [{ id: 'trade_impact.trade' }],
            valueKey: [{ id: 'trade_impact.recovered_revenue', aggregation: 'sum' }],
          },
          format: {
            title: { enabled: true, text: 'Recovered Job Revenue by Trade Vertical ($)' },
          },
        },
        'grid-a2a-ledger': {
          type: 'grid',
          dataMapping: {
            cols: [
              { id: 'transactions.id' },
              { id: 'transactions.timestamp' },
              { id: 'transactions.contractor_name' },
              { id: 'transactions.trade_vertical' },
              { id: 'transactions.service_plan' },
              { id: 'transactions.monthly_amount' },
              { id: 'transactions.paypal_sub_id' },
              { id: 'transactions.kyc_status' },
              { id: 'transactions.allocated_did' },
              { id: 'transactions.status' },
            ],
          },
          format: {
            title: { enabled: true, text: 'Autonomous A2A Commerce Audit Ledger' },
          },
        },
      },
      widgetLayout: {
        'kpi-mrr': { xTrack: 0, yTrack: 0, xSpan: 8, ySpan: 6 },
        'kpi-leads': { xTrack: 8, yTrack: 0, xSpan: 8, ySpan: 6 },
        'kpi-revenue': { xTrack: 16, yTrack: 0, xSpan: 8, ySpan: 6 },
        'chart-recovered-revenue': { xTrack: 0, yTrack: 6, xSpan: 24, ySpan: 14 },
        'grid-a2a-ledger': { xTrack: 0, yTrack: 20, xSpan: 24, ySpan: 16 },
      },
    },
    {
      id: 'telecom-kyc-guard',
      widgets: {
        'grid-kyc-audit': {
          type: 'grid',
          dataMapping: {
            cols: [
              { id: 'kyc_audit.allocated_did' },
              { id: 'kyc_audit.carrier_resporg' },
              { id: 'kyc_audit.subscriber_legal_name' },
              { id: 'kyc_audit.paypal_payer_id' },
              { id: 'kyc_audit.autodialer_blocked' },
              { id: 'kyc_audit.statutory_shield_status' },
            ],
          },
          format: {
            title: { enabled: true, text: 'Telecom KYC & Carrier 10DLC Compliance Registry' },
          },
        },
      },
      widgetLayout: {
        'grid-kyc-audit': { xTrack: 0, yTrack: 0, xSpan: 24, ySpan: 20 },
      },
    },
  ],
};

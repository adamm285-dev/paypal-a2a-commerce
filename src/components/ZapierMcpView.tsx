import { useState } from 'react';
import { Network, CheckCircle2, Play, FileText, Calendar, Building2 } from 'lucide-react';
import { executeZapierMcpWorkflow, type QualifiedLead, type ZapierExecutionResult } from '../services/zapierMcpService';

export function ZapierMcpView() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<ZapierExecutionResult | null>(null);

  const [lead] = useState<QualifiedLead>({
    callerName: 'Sarah Jenkins',
    callerPhone: '+1 (863) 555-0199',
    propertyAddress: '4822 Cleveland Heights Blvd, Lakeland, FL 33813',
    tradeVertical: 'Tile & Custom Flooring',
    scopeSummary: '650 sq ft porcelain plank tile in kitchen & hallway',
    territoryZone: 'Zone 2 - South Lakeland',
    appointmentTime: 'Tuesday, Oct 6 @ 10:00 AM',
    depositAmount: 250.0,
    paypalTransactionId: 'I-BW452NX993L2',
  });

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    const res = await executeZapierMcpWorkflow(lead);
    setLastResult(res);
    setIsRunning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#0f172a', padding: '24px', overflowY: 'auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} color="#38bdf8" /> Zapier MCP Autonomous CRM &amp; Accounting Dispatcher
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            When FieldSmith screens a homeowner and verifies the PayPal deposit, the agent dispatches Zapier MCP actions to eliminate contractor paperwork.
          </p>
        </div>

        <button
          onClick={handleRunWorkflow}
          disabled={isRunning}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#0284c7',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Play size={15} /> {isRunning ? 'Invoking Zapier MCP...' : 'Test Autonomous Zapier MCP Chain'}
        </button>
      </div>

      {/* Grid: Left Input Card, Right Output Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        {/* Qualified Lead Input Card */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '18px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} color="#38bdf8" /> Inbound Lead Qualified by Gemini Live
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Homeowner Name:</span>
              <div style={{ color: '#f8fafc', fontWeight: 600 }}>{lead.callerName}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Phone Number:</span>
              <div style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{lead.callerPhone}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Jobsite Address:</span>
              <div style={{ color: '#f8fafc' }}>{lead.propertyAddress}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Trade &amp; Scope:</span>
              <div style={{ color: '#f8fafc' }}>{lead.tradeVertical} &bull; {lead.scopeSummary}</div>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Territory Zone &amp; Slot:</span>
              <div style={{ color: '#38bdf8', fontWeight: 600 }}>[{lead.territoryZone}] &bull; {lead.appointmentTime}</div>
            </div>
            <div style={{ marginTop: '8px', padding: '10px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px' }}>
              <div style={{ color: '#34d399', fontWeight: 600 }}>Verified PayPal Deposit: ${lead.depositAmount.toFixed(2)}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>Transaction ID: {lead.paypalTransactionId}</div>
            </div>
          </div>
        </div>

        {/* Zapier Execution Pipeline Trace */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={16} color="#34d399" /> Zapier MCP Action Execution Trace
          </h3>

          {!lastResult && !isRunning && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px', padding: '30px' }}>
              <Network size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Click &quot;Test Autonomous Zapier MCP Chain&quot; to execute the live multi-app dispatch.</p>
            </div>
          )}

          {isRunning && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '13px' }}>
              Handshaking with Zapier MCP protocol...
            </div>
          )}

          {lastResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lastResult.logs.map((log) => (
                <div
                  key={log.actionId}
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', color: '#f8fafc' }}>
                      {log.targetApp === 'Jobber' && <FileText size={15} color="#38bdf8" />}
                      {log.targetApp === 'QuickBooks Online' && <Building2 size={15} color="#10b981" />}
                      {log.targetApp === 'Google Calendar' && <Calendar size={15} color="#fbbf24" />}
                      <span>{log.targetApp}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>({log.toolName})</span>
                    </div>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> {log.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {log.payloadSummary}
                  </p>
                  <span style={{ fontSize: '10px', color: '#475569', alignSelf: 'flex-end' }}>{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZapierMcpView;

import { useEffect, useRef, useState } from 'react';
import '@bryntum/scheduler/scheduler.css';
import '@bryntum/scheduler/stockholm-dark.css';
import '@bryntum/scheduler/fontawesome/css/fontawesome.css';
import '@bryntum/scheduler/fontawesome/css/solid.css';
import { Scheduler } from '@bryntum/scheduler';
import { Calendar, Zap } from 'lucide-react';

export interface ScheduleEvent {
  id: number | string;
  resourceId: string;
  name: string;
  startDate: string;
  endDate: string;
  eventColor: string;
  iconCls: string;
  depositStatus: string;
  paypalTxn: string;
}

export function BryntumDispatchScheduler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const schedulerRef = useRef<Scheduler | null>(null);
  const [lastPaymentSync, setLastPaymentSync] = useState<string>('2026-10-02 02:14:22');

  useEffect(() => {
    if (!containerRef.current) return;

    // Define Contractor Crews / Territory Zones
    const resources = [
      {
        id: 'crew-1',
        name: 'Marcus Miller',
        zone: 'Zone 1 - North Lakeland',
        trade: 'Tile & Custom Flooring',
        status: 'DISPATCH_READY',
      },
      {
        id: 'crew-2',
        name: 'Dave Vance',
        zone: 'Zone 2 - South Lakeland',
        trade: 'Emergency 24/7 Plumbing',
        status: 'ON_JOB',
      },
      {
        id: 'crew-3',
        name: 'Elena Rostova',
        zone: 'Zone 3 - Winter Haven',
        trade: 'Roofing & Storm Restoration',
        status: 'ESTIMATES_ACTIVE',
      },
      {
        id: 'crew-4',
        name: 'Hank Schrader',
        zone: 'Zone 4 - Bartow / South County',
        trade: 'Towing & Heavy Roadside',
        status: 'STANDBY_ON_CALL',
      },
    ];

    // Define 75-minute estimate slots and booked jobs locked by PayPal deposits
    const events: ScheduleEvent[] = [
      {
        id: 1,
        resourceId: 'crew-1',
        name: '650 sq ft LVP Estimate [LOCKED BY PAYPAL]',
        startDate: '2026-10-02 09:00',
        endDate: '2026-10-02 10:15',
        eventColor: 'green',
        iconCls: 'b-fa b-fa-check-circle',
        depositStatus: 'PAID ($250.00)',
        paypalTxn: 'I-BW452NX993L2',
      },
      {
        id: 2,
        resourceId: 'crew-1',
        name: 'Master Bath Shower Pan Inspection',
        startDate: '2026-10-02 11:00',
        endDate: '2026-10-02 12:15',
        eventColor: 'green',
        iconCls: 'b-fa b-fa-check-circle',
        depositStatus: 'PAID ($250.00)',
        paypalTxn: 'I-BW452NX993L2',
      },
      {
        id: 3,
        resourceId: 'crew-2',
        name: 'Emergency Mainline Drain Burst',
        startDate: '2026-10-02 08:30',
        endDate: '2026-10-02 10:30',
        eventColor: 'green',
        iconCls: 'b-fa b-fa-bolt',
        depositStatus: 'PAID ($250.00)',
        paypalTxn: 'I-PL782MK110Q9',
      },
      {
        id: 4,
        resourceId: 'crew-2',
        name: 'Tankless Water Heater Consult [AWAITING DEPOSIT]',
        startDate: '2026-10-02 13:00',
        endDate: '2026-10-02 14:15',
        eventColor: 'orange',
        iconCls: 'b-fa b-fa-clock',
        depositStatus: 'PENDING PAYPAL LINK',
        paypalTxn: 'PENDING',
      },
      {
        id: 5,
        resourceId: 'crew-3',
        name: 'Hail Damage Roof Inspection [LOCKED BY PAYPAL]',
        startDate: '2026-10-02 10:00',
        endDate: '2026-10-02 11:30',
        eventColor: 'green',
        iconCls: 'b-fa b-fa-shield-alt',
        depositStatus: 'PAID ($250.00)',
        paypalTxn: 'I-RF994ZZ331A8',
      },
      {
        id: 6,
        resourceId: 'crew-4',
        name: 'Flatbed Highway Recovery (SR-570)',
        startDate: '2026-10-02 07:30',
        endDate: '2026-10-02 09:00',
        eventColor: 'green',
        iconCls: 'b-fa b-fa-truck',
        depositStatus: 'PAID ($149.00)',
        paypalTxn: 'I-TW551PP882B4',
      },
    ];

    // Initialize Bryntum Scheduler instance
    const scheduler = new Scheduler({
      appendTo: containerRef.current,
      startDate: new Date(2026, 9, 2, 7, 0),
      endDate: new Date(2026, 9, 2, 18, 0),
      viewPreset: 'hourAndDay',
      rowHeight: 64,
      barMargin: 8,
      eventStyle: 'filled',
      columns: [
        { text: 'Contractor Crew', field: 'name', width: 170 },
        { text: 'Territory Zone', field: 'zone', width: 170 },
        { text: 'Primary Vertical', field: 'trade', width: 180 },
      ],
      resources,
      events,
      eventRenderer({ eventRecord }: { eventRecord: any }) {
        const isPaid = eventRecord.depositStatus.includes('PAID');
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;width:100%;height:100%;padding:4px 8px;font-size:11px;font-weight:600;">
            <div style="display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              <i class="${eventRecord.iconCls}"></i>
              <span>${eventRecord.name}</span>
            </div>
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;background-color:${
              isPaid ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'
            };color:${isPaid ? '#34d399' : '#fbbf24'};border:1px solid ${
              isPaid ? '#10b981' : '#f59e0b'
            };flex-shrink:0;">
              ${eventRecord.depositStatus}
            </span>
          </div>
        `;
      },
    });

    schedulerRef.current = scheduler;

    return () => {
      scheduler.destroy();
    };
  }, []);

  // Simulate incoming call that clears PayPal deposit and locks a new slot
  const handleSimulateLock = () => {
    if (!schedulerRef.current) return;

    const newId = Date.now();
    const newSlot: ScheduleEvent = {
      id: newId,
      resourceId: 'crew-1',
      name: 'South Lakeland Kitchen Tile Estimate [PAYPAL VERIFIED]',
      startDate: '2026-10-02 14:00',
      endDate: '2026-10-02 15:15',
      eventColor: 'green',
      iconCls: 'b-fa b-fa-check-circle',
      depositStatus: 'PAID ($250.00)',
      paypalTxn: `I-PP${Math.floor(100000 + Math.random() * 900000)}`,
    };

    schedulerRef.current.eventStore.add(newSlot);
    setLastPaymentSync(new Date().toISOString().replace('T', ' ').substring(0, 19));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#0f172a' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#0b1120',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Bryntum Smart Dispatch &amp; Territory Zoning Board
            </h3>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              4 Territory Zones &bull; 75-Min Estimate Blocks &bull; Slots Locked Exclusively via Verified PayPal Deposits
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Last PayPal Event Sync:{' '}
            <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{lastPaymentSync}</span>
          </div>

          <button
            onClick={handleSimulateLock}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Zap size={14} /> Simulate Inbound Call + $250 Deposit Lock
          </button>
        </div>
      </div>

      {/* Bryntum Scheduler Container */}
      <div ref={containerRef} style={{ flex: 1, width: '100%', height: 'calc(100% - 60px)' }} />
    </div>
  );
}
export default BryntumDispatchScheduler;

# FieldSmith Pro &mdash; Autonomous A2A Commerce Portal & Fleet Telemetry

> **Autonomous Agent-to-Agent (A2A) Commerce for Solo Tradespeople**  
> Built with **PayPal Agentic Commerce** (`@paypal/react-paypal-js`, `@paypal/paypal-server-sdk`, `@paypal/mcp`) & **AG Studio v3.0.0** (`ag-studio-react`, `ag-studio`).

---

## 1. Executive Summary & Problem

Solo contractors (flooring, plumbing, roofing, towing) lose an estimated **$6,200/month in revenue** from missed calls while on jobsites or driving. Traditional SaaS requires manual signups, complex credit card entries, and human administration that solo contractors don't have time to perform.

FieldSmith Pro introduces **Autonomous Agent-to-Agent (A2A) Commerce**:
1. **Autonomous Buyer Agent:** Evaluates local telephony call logs, calculates lost lead value, inspects the contractor's hard spending mandate (`maxMonthlyBudget < $100/mo`), and autonomously negotiates with service providers.
2. **Autonomous Seller Agent:** Exposes a machine-readable catalog over Model Context Protocol (MCP), verifies spending parameters, and issues delegated PayPal Subscription requests.
3. **Verified KYC Telecom Provisioning:** Solves the critical telecom compliance problem (FCC/TCPA) by binding the verified PayPal subscriber identity directly to local Telnyx DID line allocation. The allocated line is locked 100% to inbound screening &mdash; preventing anonymous rogue robocallers.
4. **AG Studio Executive Analytics:** Embedded dashboard powered by AG Studio v3.0.0 displaying real-time A2A audit ledgers, recovered revenue by trade, and telecom compliance tracking.

---

## 2. Technology Stack & Hackathon Alignments

| Category | Technology | Purpose |
|----------|------------|---------|
| **Agentic Commerce** | PayPal Subscriptions & AI-Toolkit | Autonomous recurring billing, buyer delegated tokens, and MCP server integration |
| **Embedded Analytics** | AG Studio v3.0.0 (`ag-studio-react`) | Interactive self-service dashboards, charts, and audit ledgers |
| **Grid Engine** | AG Grid Enterprise (bundled in AG Studio) | High-performance A2A transaction ledger |
| **Frontend Framework** | React 19 + TypeScript + Vite | Modern reactive application runtime |
| **Telephony Gateway** | Telnyx Wholesale Voice & 10DLC | Carrier-grade DID allocation with zero cold-outbound dialing |

---

## 3. AG Studio License Configuration

AG Studio v3.0.0 runs locally in trial/developer mode out of the box (with watermark).  
Per official AG Studio documentation ([Installing a Licence Key](https://www.ag-grid.com/studio/react/licence-install/)):

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your AG Studio License key:
   ```env
   VITE_AG_STUDIO_LICENSE_KEY=your_ag_studio_license_key_here
   ```
3. The application automatically initializes the license in `src/App.tsx`:
   ```ts
   import { AgStudioLicenseManager } from 'ag-studio';

   const studioLicenseKey = import.meta.env.VITE_AG_STUDIO_LICENSE_KEY;
   if (studioLicenseKey) {
     AgStudioLicenseManager.setLicenseKey(studioLicenseKey);
   }
   ```

---

## 4. Quick Start

```bash
# Navigate to portal directory
cd a2a_commerce_portal

# Install dependencies (AG Studio, PayPal SDKs, Lucide)
npm install

# Run Vite development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Architectural Features

- **Toggle Modes:** Seamlessly switch between **View Mode** (executive KPI cards, grouped bar charts, and transactional data grid) and **Edit Mode** (AG Studio drag-and-drop report builder).
- **A2A Purchase Simulator:** Interactive modal that runs the full Buyer Agent $\rightarrow$ Seller Agent negotiation loop, displays live mandate verification, renders the PayPal Subscription checkout button, and dynamically appends approved transactions to AG Studio's live dataset.
- **Statutory TCPA Shield:** Demonstrates compliance and KYC identity anchoring for telephony assets.

# Engineering & Execution Plan: Production-Ready US Roofing Website Template for Whop

**Status:** APPROVED  
**Mode:** SCOPE EXPANSION  
**Project:** US Roofing Website Template (`whop.site` / `whop.app`)  
**Target Platform:** Whop Websites (Vite React SPA deployed to Cloudflare Workers / Whop Websites runtime) & Whop Developer Platform  
**Author:** Antigravity (Pair Programming with machinerg)  
**Date:** 2026-10-25  

---

## 1. Executive Summary & Vision

### Problem Statement
US roofing contractors sell high-ticket services ($8k–$30k roof replacements, $500–$2,500 emergency leak repairs) in a low-trust local market. Today, contractors lose 10–15 hours every week manually chasing physical paper checks, dealing with slow net-30 accounts receivable, and suffering a 40%+ dropoff on generic contact forms. Homeowners ghost estimates because of friction, sticker shock, and the absence of frictionless digital financing.

### The 10x Solution
A production-ready, white-label website template built natively on Whop Websites. It turns static roofing websites into an automated cash-flow and conversion engine:
1. **Upfront Commitment Plans:** $149 Drone & Hazard Inspection, $500 Project Deposit with Card-on-File (`setupFutureUsage: 'off_session'`), and $2,499 Emergency Flat-Rate Leak Repair.
2. **Whop Payment Elements:** Embedded `PaymentElement` / `CheckoutElement` + `ExpressCheckoutElement` (Apple Pay / Google Pay) + required `BrandingElement`. Automatically surfaces consumer financing (Klarna, Splitit, Afterpay) for approved merchants without the roofer needing a separate loan broker.
3. **Whop Leads API:** 3-step interactive estimate funnel that records qualified homeowners directly as leads on the Whop account.
4. **Card-on-File to Final Invoice:** Automatically saves payment method during deposit checkout, with an interactive Roofer Portal demo showing 1-click final balance invoicing via `Whop Invoices API` (auto-charge or manual send).
5. **Real-time Whop Tracking:** Fires `estimate_requested`, `service_viewed`, and `deposit_started` via `whop.track`.
6. **Zero-Code Configuration:** A single central config (`roofing.config.ts`) allows any roofing company to rebrand in under 5 minutes.

---

## 2. Decision Ledger & Scope Tracking

| ID & Owner | Contract & Evidence | Current | Proposed | Status | Exact Approval & Scope |
|---|---|---|---|---|---|
| DEC-01 (Architecture) | Single-source configuration schema | Hardcoded values in components | Central `roofing.config.ts` defining company info, license, service areas, Whop company ID, and plan IDs | APPROVED | Full config-driven template architecture |
| DEC-02 (Payments) | Whop Elements Checkout & Financing | Generic redirect links | Embedded modal checkout with `PaymentElement`, `ExpressCheckoutElement`, and `BrandingElement` with `setupFutureUsage: 'off_session'` | APPROVED | Whop Elements exclusively; no custom card forms |
| DEC-03 (Lead Gen) | Whop Leads API Integration | Standard mailto or generic webhook | Secure proxy route `/api/leads` -> `POST /api/v1/leads` with `WHOP_API_KEY` (and demo simulation fallback) | APPROVED | Lead created with name, phone, address, and roof details |
| DEC-04 (Invoicing) | Card-on-file Setup & Invoices API | Manual paper check collection | Card saved on deposit checkout + Roofer Invoice Demo Portal for final balance auto-charge via `/api/invoices` | APPROVED | End-to-end deposit -> card-on-file -> final invoice |
| DEC-05 (Telemetry) | Whop Pixel Event Tracking | No client-side analytics | `whop.track` custom events + Dev HUD inspector | APPROVED | `estimate_requested`, `service_viewed`, `deposit_started` |
| EXP-01 (Delight) | Roofer Pitch Simulation Bar | None | Toggle between Homeowner View and Contractor Invoicing View | APPROVED | Included in scope |
| EXP-02 (Delight) | Zip Code Service Area Validator | Static text list | Interactive live zip code checker with local crew availability badge | APPROVED | Included in scope |
| EXP-03 (Delight) | Financing Breakout Callout | None | "As low as $89/mo with Whop Financing" badges | APPROVED | Included in scope |
| EXP-04 (Delight) | 3-Step Interactive Estimate Funnel | Basic contact form | Multi-step Roof Type + Issue + Contact information flow | APPROVED | Included in scope |
| EXP-05 (Delight) | Live whop.track Event Inspector HUD | Invisible background execution | Real-time on-screen event verification toast/HUD in demo mode | APPROVED | Included in scope |

---

## 3. Section 1: Architecture Review

### System Overview
The template is structured as a client-side Vite React application backed by serverless API handlers for secure credential handling, running on Cloudflare Workers / Whop Websites runtime.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                    |
|                                                                                   |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  |  Hero & Zip Check  |  | 3-Step Estimate Form|  | Services & Financing Cards  |  |
|  +---------+----------+  +---------+----------+  +--------------+--------------+  |
|            |                       |                            |                 |
|            v                       v                            v                 |
|     Local Zip Lookup        POST /api/leads           Whop Elements Checkout      |
|    (roofing.config.ts)   (PitchDemoContext State)   (Payment + Express + Branding)|
|                                    |                            |                 |
|  +---------------------------------+----------------------------+--------------+  |
|  |                       whop.track Event Telemetry                             |  |
|  |       ['estimate_requested', 'service_viewed', 'deposit_started']           |  |
|  +-----------------------------------------------------------------------------+  |
|                                    |                                              |
|  +---------------------------------+-------------------------------------------+  |
|  |             Interactive Roofer Pitch Mode & Invoicing HUD                   |  |
|  |   [View Leads] -> [Card on File: pmt_xxx] -> [Auto-Charge Final Invoice]    |  |
|  +---------------------------------+-------------------------------------------+  |
+------------------------------------+----------------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                     SERVERLESS API LAYER (/api/*) & PROXIES                       |
|   - Holds WHOP_API_KEY securely in environment variables                          |
|   - In Demo/Sandbox Mode: simulates responses if keys not set                     |
|                                                                                   |
|   POST /api/leads -----------> POST https://api.whop.com/api/v1/leads             |
|   POST /api/invoices --------> POST https://api.whop.com/api/v1/invoices          |
+-----------------------------------------------------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                               WHOP BACKEND & APIS                                 |
|                                                                                   |
|   +-------------------+  +---------------------+  +----------------------------+  |
|   |  Leads API        |  |  Setup Intents API  |  |  Invoices API              |  |
|   |  (/api/v1/leads)  |  | (/v1/setup_intents) |  |  (/api/v1/invoices)         |  |
|   +-------------------+  +---------------------+  +----------------------------+  |
|   +----------------------------------------------------------------------------+  |
|   |                      Whop Payments Engine                                  |  |
|   |     (Card, Apple Pay, Google Pay, Klarna, Splitit, Afterpay)               |  |
|   +----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Data Flows (All Four Paths)

#### 1. Happy Path
```
User selects Plan ($500 Deposit) -> whop.track('deposit_started') -> Whop Checkout Modal opens ->
WhopElements mounts with setupFutureUsage: 'off_session' -> User pays with Apple Pay / Card ->
Card saved on file (pmt_xxx) -> Callback updates PitchDemoContext state -> 
Roofer Portal reflects Card-on-File -> Job Completed -> Contractor clicks 'Charge Final Invoice' ->
Serverless route /api/invoices dispatches Whop Invoices API call -> Invoice paid & settled.
```

#### 2. Nil Path (Missing/Null Input)
```
User submits estimate form with blank phone/email ->
Client validation in EstimateFunnel stops submission -> Inline field error displays ->
No Whop API call initiated -> Zero corrupted leads created.
```

#### 3. Empty/Zero Path
```
Contractor attempts to generate invoice with $0 remaining balance or empty line items ->
Validation helper intercepts request -> Displays toast 'Invoice amount must exceed $0.00' ->
Prevents zero-dollar invoice submission to Whop API.
```

#### 4. Error Path (Upstream API Failure / Network Drop)
```
Whop API returns 429 RateLimit or 500 Server Error on Lead creation ->
Serverless proxy catches error -> Gracefully stores lead in localStorage backup queue ->
Shows friendly confirmation to homeowner: 'Estimate received! A roofing specialist will call shortly' ->
Attempts non-blocking retry in background -> Zero user panic.
```

### State Machine: Deposit to Job to Final Settlement
```
  [ QUOTE REQUESTED ]
          |
          v (Homeowner books online or approves proposal)
  [ DEPOSIT CHECKOUT ] <--- whop.track('deposit_started')
          |
          +--> [ FAILED ] ---> User retries or changes card
          |
          v (Payment succeeds with setupFutureUsage: 'off_session')
  [ DEPOSIT PAID & CARD ON FILE SAVED (pmt_xxx) ]
          |
          v (Roofing crew delivers materials, tears off, repairs)
  [ JOB COMPLETED (WALKTHROUGH APPROVED) ]
          |
          +-----------------------+-----------------------+
          | (Auto-Charge Option)  | (Manual Pay Option)   |
          v                       v                       v
    Whop Invoices API        Whop Invoices API      Card Declined
   charges stored pmt_xxx    sends hosted link       (Graceful retry)
          |                       |                       |
          +-----------------------+-----------------------+
                                  |
                                  v
                      [ INVOICE PAID & CLOSED ]
```

---

## 4. Section 2: Error & Rescue Map

| Method / Codepath | What Can Go Wrong | Exception / Error Class | Rescued? | Rescue Action | User / Client Outcome |
|---|---|---|---|---|---|
| `whop.track(event, data)` | `window.whop` not injected or blocked by ad blocker | `TypeError: undefined is not a function` | Y | Defensive wrapper checks `typeof window !== 'undefined' && window.whop?.track`; pushes event to `PitchDemoContext` Dev HUD buffer | Silent fallback for user; Dev HUD logs event locally |
| `submitLead(leadData)` | Whop API down, 500 error, or invalid token | `WhopApiError / NetworkError` | Y | Catch block logs error; saves lead to `localStorage.saved_leads`; returns success response to user | User sees optimistic success screen; roofer doesn't lose lead |
| `mountWhopElements()` | Failed to fetch token or SDK load timeout | `ElementsInitError` | Y | Display friendly retry card with direct phone support CTA | User is given 1-click retry button + contractor phone number |
| `createSetupIntent()` | 3D Secure verification fails or card authentication cancelled | `AuthenticationRequiredError` | Y | Triggers `handleNextAction(client_secret)` modal prompt | Homeowner completes bank app authorization |
| `dispatchInvoice()` | Stored payment method expired or NSF | `InvoiceChargeFailedError` | Y | Whop Invoices automatically falls back to emailing hosted payment invoice link to homeowner | Contractor alerted to send text reminder; customer receives payment link |

---

## 5. Section 3: Security & Threat Model

1. **Payment Data Isolation:** No credit card numbers or banking credentials ever touch template code, DOM inputs, or application memory. All payment credentials are encrypted and collected directly inside Whop's PCI-DSS Level 1 compliant iframes via `PaymentElement`.
2. **API Key Protection:** The client template only exposes public publishable tokens or app IDs. Privileged actions (e.g. creating real invoices or querying all company accounts) are routed through serverless endpoints (`/api/leads`, `/api/invoices`) where `WHOP_API_KEY` is secured in environment variables. In client-only demo mode, safe simulated mock responses are provided so no secrets leak.
3. **Input Sanitization:** Estimate form fields (homeowner name, street address, damage notes) are sanitized against XSS, SQL injection, and payload bloat before submission.
4. **Rate Limiting:** Lead submission endpoints enforce client-side debounce (1 submission per 10 seconds per IP/session) to prevent lead database spamming.

---

## 6. Section 4: Data Flow & Interaction Edge Cases

- **Double-Click / Stale Submit:** Estimate form submit button disables immediately upon click, shows animated spinner, and prevents duplicate API calls.
- **Back Button & Modal Navigation:** Closing the checkout modal does not lose the user's selected plan or quote details.
- **Offline / Flaky Connection:** Lead submission utilizes an optimistic UI state; if network disconnects mid-flight, service worker / localStorage caches the payload and synchronizes on reconnect.
- **Mobile Viewport & Touch Targets:** All tap targets for shingle selection, phone links, and checkout buttons are sized to at least 48x48px with 16px minimum typography to prevent iOS auto-zoom on input focus.

---

## 7. Section 5: Code Quality & Module Architecture

### Directory Structure
```
/
├── CLAUDE.md                   # Agent routing & development rules
├── docs/
│   ├── designs/
│   │   └── roofing-whop-template.md  # Approved Design Doc
│   └── plans/
│       └── roofing-whop-template-plan.md  # This execution plan
├── roofing.config.ts           # Central rebrandable configuration
├── api/                        # Serverless handlers (Cloudflare Workers / Whop Functions)
│   ├── leads.ts                # Proxies POST /api/v1/leads with WHOP_API_KEY
│   └── invoices.ts             # Proxies POST /api/v1/invoices with WHOP_API_KEY
├── src/
│   ├── context/
│   │   └── PitchDemoContext.tsx # Shared state for Leads, Card-on-File, & Events HUD
│   ├── components/
│   │   ├── Navbar.tsx          # High-trust header, emergency CTA, phone
│   │   ├── Hero.tsx            # Headline, trust badges, zip checker
│   │   ├── ZipChecker.tsx      # Local service area validator
│   │   ├── Services.tsx        # Repair, Replacement, Inspection
│   │   ├── Plans.tsx           # $149 Inspection, $500 Deposit, $2,499 Flat-Rate
│   │   ├── EstimateFunnel.tsx  # 3-step lead form (Roof Type + Issue + Contact)
│   │   ├── FinancingSection.tsx# Klarna/Splitit callout & monthly breakdown
│   │   ├── ReviewsTrust.tsx    # Customer reviews, licensing, warranties
│   │   ├── WhopCheckoutModal.tsx # PaymentElement + ExpressCheckout + BrandingElement
│   │   ├── RooferPitchBar.tsx  # Contractor pitch demo HUD (Invoices API simulator)
│   │   ├── EventInspector.tsx  # Dev HUD verifying whop.track events
│   │   └── Footer.tsx          # Full footer, coverage area, disclosures
│   ├── utils/
│   │   ├── tracking.ts         # Defensive whop.track wrapper with Dev HUD sync
│   │   └── whopClient.ts       # Whop SDK & API client helpers
│   ├── App.tsx                 # Main application layout
│   └── main.tsx                # Client entrypoint
├── package.json
└── vite.config.ts
```

### The `roofing.config.ts` Schema
```typescript
export interface RoofingCompanyConfig {
  whop: {
    companyId: string; // e.g. "biz_xxxxxxxxxxxxxx"
    appId?: string;     // e.g. "app_xxxxxxxxxxxxxx"
    sandbox?: boolean;  // defaults to true in dev
  };
  company: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    licenseNumber: string;
    yearsInBusiness: number;
    rating: number;
    reviewCount: number;
    emergencyAvailable: boolean;
  };
  serviceArea: {
    primaryCity: string;
    state: string;
    coveredZipCodes: string[];
  };
  plans: {
    inspection: {
      id: string; // Whop plan_xxx
      name: string;
      price: number;
      description: string;
    };
    deposit: {
      id: string; // Whop plan_xxx
      name: string;
      price: number;
      description: string;
    };
    flatRateService: {
      id: string; // Whop plan_xxx
      name: string;
      price: number;
      description: string;
    };
  };
  financing: {
    minMonthlyPayment: number;
    supportedProviders: string[]; // ["Klarna", "Splitit", "Afterpay"]
  };
}
```

### 3-Step Interactive Estimate Funnel Fields
- **Step 1: Roof Material**
  - Options: *Asphalt Architectural Shingles*, *Standing Seam Metal*, *Spanish / Concrete Tile*, *Flat / Commercial TPO / EPDM*.
- **Step 2: Primary Issue & Urgency**
  - Options: *Active Water Leak / Emergency*, *Recent Hail or Storm Damage*, *Old Roof (15+ Years) Replacement*, *Comprehensive Safety & Hazard Inspection*.
- **Step 3: Property & Contact Info**
  - Fields: *Full Name*, *Phone Number*, *Property Street Address*, *Zip Code*, *Additional Damage Notes*.
  - Action: Dispatches to `/api/leads` and fires `whop.track('estimate_requested', { roofType, urgency, zipCode })`.

---

## 8. Section 6: Test & Verification Strategy

1. **Unit Tests (`bun:test` or Vitest):**
   - Config integrity check: verifies `roofing.config.ts` has all required fields including `whop.companyId`.
   - Tracking wrapper test: verifies `whop.track` triggers with exact event names (`estimate_requested`, `service_viewed`, `deposit_started`).
   - Zip code validator test: verifies covered zips return active crew status, outside zips display fallback contact.
2. **Integration / Sandbox Checkout:**
   - Mount Whop Elements in sandbox mode.
   - Verify `BrandingElement` renders Whop badge compliant with guidelines.
   - Complete test payment and verify `setupFutureUsage: 'off_session'` passes payment method ID to `PitchDemoContext`.
3. **Leads API Test:**
   - Simulate 3-step estimate submission.
   - Verify payload structure matches `POST /api/v1/leads` specification.
4. **End-to-End Walkthrough:**
   - Load homepage -> Verify Hero & Service Area.
   - Trigger `whop.track('service_viewed')`.
   - Submit Estimate form -> Verify `whop.track('estimate_requested')`.
   - Click Deposit ($500) -> Verify `whop.track('deposit_started')` and open Checkout Modal.
   - Toggle Roofer Pitch Bar -> Test "Simulate Walkthrough & Invoice" trigger.

---

## 9. Section 7: Performance & Core Web Vitals

- **LCP (Largest Contentful Paint) < 1.2s:** Critical hero images preloaded, system font fallbacks, zero heavy blocking script bundles.
- **CLS (Cumulative Layout Shift) = 0.00:** Explicit height/width aspects on hero graphics, fixed dimensions on Whop Element containers with smooth skeleton loaders.
- **Zero Heavy Runtime Dependencies:** Built with lightweight modern React / Tailwind / Lucide-React; no bloated animation libraries.

---

## 10. Section 8: Observability & Pitch Demonstration HUD

- **In-App Dev Event Inspector:** Floating HUD in bottom right (collapsible) that logs live `whop.track` calls with timestamps and JSON payloads.
- **Roofer Pitch Simulation Bar:** Top banner with a 1-click toggle to demonstrate to contractor clients:
  - *Current Active Leads:* List of submitted estimates with homeowner address & roof damage type.
  - *Card-on-File Vault:* Shows tokenized payment method (`pmt_visa_4242`) stored at deposit.
  - *One-Click Balance Settlement:* Button to generate final invoice ($4,500 replacement balance) via Whop Invoices API.

---

## 11. Section 9: Deployment & Rollout Plan

1. **Scaffold / Link via Whop CLI:**
   - Initialize and link app via `@whop/cli apps init` or direct Vite template deployment.
2. **Deploy to Live `whop.site` / `whop.app`:**
   - Build assets (`bun run build` or `vite build`).
   - Ship to production via `npx @whop/cli apps deploy` or Whop Cloudflare Workers integration.
   - Verify live URL accessibility on mobile and desktop.
3. **Template Export & Distribution:**
   - Clean, uncoupled repository ready to clone for any commercial roofing business.

---

## 12. Section 10: Long-Term Trajectory

- **Phase 1 (This Build):** Turnkey high-converting marketing template + 3 Whop plans + Elements checkout + Leads API + Invoicing simulator + Pixel tracking.
- **Phase 2 (Contractor Portal):** Homeowner portal where clients log in via Whop to view drone inspection photos, contract agreements, and warranty certificates.
- **Phase 3 (Subcontractor Payouts):** Integrating Whop Transfers/Payouts API to automatically pay roofing crews upon milestone inspection sign-offs.

---

## 13. Section 11: Design & UX Review

### Design System & Visual Language
- **Aesthetic:** High-ticket, ultra-trustworthy American trade contractor aesthetic. Clean dark slate (`#0f172a`), deep roofing navy (`#1e293b`), safety accent amber/gold (`#f59e0b`), crisp white typography, and vibrant trust greens for financing and warranty badges.
- **Typography:** Modern, punchy sans-serif typography (`Inter` / system-ui) with clear visual hierarchy.
- **Hero & Content Hierarchy:**
  1. Instant value proposition ("Austin's #1 Rated Roof Repair & Replacement") + Emergency Dispatch Banner.
  2. Trust signals: BBB A+ Rating, GAF Master Elite Certified, 25-Year Warranty, 5.0 Star Google Reviews.
  3. Zip code availability validator.
  4. Core Service Grid with transparent starting prices and "As low as $89/mo" financing callouts.
  5. 3-Step Interactive Estimate Funnel.
  6. Transparent Online Booking Plans (Inspection $149, Deposit $500, Emergency Leak Repair $2,499).
  7. Whop Checkout Drawer / Modal.

---

## 14. Outside Voice Integration

- **Codex / Independent Perspective:** Preflight checked. Core insight confirms that contractors care far more about immediate cash flow certainty and eliminating uncollected checks than about generic website redesigns. Highlighting the card-on-file Setup Intent and the final Whop Invoice automation directly addresses their #1 operational headache.
- **Result:** Complete consensus on Approach A.

---

## 15. Temporal Interrogation (0I)
- **Hour 1 (Foundations):** Configure `roofing.config.ts`, Tailwind/Vite setup, clean typography, and asset structure.
- **Hour 2–3 (Core Logic & Whop Integrations):** Build Whop Checkout Modal with `PaymentElement`, `ExpressCheckoutElement`, and `BrandingElement`. Implement `whop.track` utility and Leads API estimate funnel.
- **Hour 4–5 (Pitch Tools & Invoicing):** Implement the interactive Roofer Pitch Bar, Card-on-File Setup Intent simulation, and Whop Invoices API settlement trigger. Add real-time Event Inspector.
- **Hour 6+ (Build, Polish & Deployment):** Mobile responsiveness testing, cross-browser verification, Whop CLI deploy to live `whop.site` / `whop.app`.

---

## 16. Approval Readiness Checklist

- [x] All 3 core business and technical premises validated and approved.
- [x] Review mode selected and confirmed: SCOPE EXPANSION.
- [x] All 5 high-leverage expansions accepted and integrated into scope.
- [x] All 11 Review Sections completed with diagrams, error maps, and security model.
- [x] Technical feasibility verified against Whop Websites, Elements, Leads, and Invoices API docs.
- [x] Live deployment path established via Whop CLI / Cloudflare Workers runtime.
- [x] Spec review findings resolved: `whop.companyId` added, serverless proxies defined, shared pitch context state specified, 3-step funnel fields enumerated.

---

## GSTACK REVIEW REPORT

| Category | Status | Details |
|---|---|---|
| Review Mode | SCOPE EXPANSION | Dream big, platonic ideal high-ticket roofing agency template |
| Architecture | PASS | Modular config-driven architecture with clean separation of concerns |
| Payment Flow | PASS | Whop PaymentElement + ExpressCheckoutElement + mandatory BrandingElement |
| Lead Generation | PASS | 3-step funnel wired to Whop Leads API with client-side debounce |
| High-Ticket Billing | PASS | Deposit checkout with Setup Intent card-on-file + Invoices API settlement |
| Telemetry | PASS | `whop.track` events (`estimate_requested`, `service_viewed`, `deposit_started`) |
| Live Deployment | READY | Deploys natively to live `whop.site` / `whop.app` via `@whop/cli` |

### VERDICT
**APPROVED — READY FOR IMPLEMENTATION**

NO UNRESOLVED DECISIONS

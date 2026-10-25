import { describe, it, expect, beforeEach } from 'bun:test';
import { roofingConfig } from '../roofing.config';
import { trackWhopEvent, whopTrack } from '../src/utils/tracking';
import { createWhopLead, createWhopInvoice } from '../src/utils/whopClient';

// Ensure browser-like window and EventTarget exist in test environment
if (typeof globalThis.window === 'undefined') {
  const listeners: Record<string, Function[]> = {};
  (globalThis as any).window = {
    addEventListener: (type: string, cb: Function) => {
      listeners[type] = listeners[type] || [];
      listeners[type].push(cb);
    },
    removeEventListener: (type: string, cb: Function) => {
      if (!listeners[type]) return;
      listeners[type] = listeners[type].filter((fn) => fn !== cb);
    },
    dispatchEvent: (event: any) => {
      if (listeners[event.type]) {
        listeners[event.type].forEach((fn) => fn(event));
      }
      return true;
    },
  };
  (globalThis as any).CustomEvent = class CustomEvent {
    type: string;
    detail: any;
    constructor(type: string, params: any = {}) {
      this.type = type;
      this.detail = params.detail;
    }
  };
}

describe('Roofing Template Configuration', () => {
  it('contains valid company profile and contact details', () => {
    expect(roofingConfig.company.name).toBe('Apex Shield Roofing & Restoration');
    expect(roofingConfig.company.formattedPhone).toBe('(512) 555-ROOF');
    expect(roofingConfig.company.email).toBe('dispatch@apexshieldroofing.com');
    expect(roofingConfig.company.licenseNumber).toBe('TX-RCL #882194-A');
  });

  it('defines the 3 required Whop plans with exact pricing', () => {
    // 1. One-time inspection fee ($149)
    expect(roofingConfig.plans.inspection.price).toBe(149);
    expect(roofingConfig.plans.inspection.id).toBe('plan_insp_149');

    // 2. Project deposit ($500)
    expect(roofingConfig.plans.deposit.price).toBe(500);
    expect(roofingConfig.plans.deposit.id).toBe('plan_dep_500');
    expect(roofingConfig.plans.deposit.depositOnly).toBe(true);

    // 3. Flat-rate service ($2,499)
    expect(roofingConfig.plans.flatRateService.price).toBe(2499);
    expect(roofingConfig.plans.flatRateService.id).toBe('plan_flat_2499');
  });

  it('includes service area regions and zip codes', () => {
    expect(roofingConfig.serviceArea.coveredZipCodes.length).toBeGreaterThan(5);
    expect(roofingConfig.serviceArea.coveredZipCodes).toContain('78701');
    expect(roofingConfig.serviceArea.coveredZipCodes).toContain('78746');
    expect(roofingConfig.serviceArea.primaryCity).toBe('Austin');
  });

  it('has valid Whop companyId and financing settings', () => {
    expect(roofingConfig.whop.companyId).toMatch(/^biz_/);
    expect(roofingConfig.financing.supportedProviders).toContain('Klarna');
    expect(roofingConfig.financing.supportedProviders).toContain('Splitit');
  });
});

describe('whop.track Custom Pixel Tracking', () => {
  it('dispatches estimate_requested event with required fields', () => {
    let capturedEvent: any = null;
    const listener = (e: any) => {
      capturedEvent = e.detail;
    };
    window.addEventListener('whop_custom_track', listener);

    whopTrack.estimateRequested({
      roofMaterial: 'Architectural Shingle',
      urgency: 'Active Leak',
      zipCode: '78704',
      name: 'Sarah Connor',
    });

    window.removeEventListener('whop_custom_track', listener);

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent.eventName).toBe('estimate_requested');
    expect(capturedEvent.payload.roof_material).toBe('Architectural Shingle');
    expect(capturedEvent.payload.zip_code).toBe('78704');
    expect(capturedEvent.payload.homeowner_name).toBe('Sarah Connor');
  });

  it('dispatches service_viewed event with pricing', () => {
    let capturedEvent: any = null;
    const listener = (e: any) => {
      capturedEvent = e.detail;
    };
    window.addEventListener('whop_custom_track', listener);

    whopTrack.serviceViewed({
      serviceId: 'plan_insp_149',
      serviceName: '32-Point Drone & Hazard Inspection',
      price: 149,
    });

    window.removeEventListener('whop_custom_track', listener);

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent.eventName).toBe('service_viewed');
    expect(capturedEvent.payload.price).toBe(149);
    expect(capturedEvent.payload.service_name).toBe('32-Point Drone & Hazard Inspection');
  });

  it('dispatches deposit_started event with setup_future_usage: off_session', () => {
    let capturedEvent: any = null;
    const listener = (e: any) => {
      capturedEvent = e.detail;
    };
    window.addEventListener('whop_custom_track', listener);

    whopTrack.depositStarted({
      planId: 'plan_dep_500',
      planName: 'Project Commitment & Crew Slot Deposit',
      depositAmount: 500,
      setupFutureUsage: true,
    });

    window.removeEventListener('whop_custom_track', listener);

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent.eventName).toBe('deposit_started');
    expect(capturedEvent.payload.amount).toBe(500);
    expect(capturedEvent.payload.setup_future_usage).toBe('off_session');
  });
});

describe('Whop Leads and Invoices API Simulation', () => {
  it('creates and records leads for Whop CRM ingestion', async () => {
    const res = await createWhopLead({
      name: 'John Miller',
      email: 'john@example.com',
      phone: '(512) 555-1212',
      address: '123 Austin Blvd',
      zipCode: '78701',
      roofMaterial: 'Metal',
      urgency: 'Emergency',
    });

    expect(res.success).toBe(true);
    expect(res.leadId).toBeDefined();
    expect(res.leadId).toMatch(/^lead_/);
  });

  it('dispatches final balance invoices via stored payment method', async () => {
    const inv = await createWhopInvoice({
      amount: 9850,
      description: 'Roof replacement completion balance',
      customerEmail: 'john@example.com',
      autoCharge: true,
      paymentMethodId: 'pmt_visa_4242',
    });

    expect(inv.success).toBe(true);
    expect(inv.invoiceId).toMatch(/^inv_/);
    expect(inv.status).toBe('paid');
  });
});

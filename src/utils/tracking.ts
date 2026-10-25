declare global {
  interface Window {
    whop?: {
      track?: (event: string, properties?: Record<string, unknown>) => void;
      setScope?: (companyId: string) => void;
    };
  }
}

export function trackWhopEvent(eventName: string, payload: Record<string, unknown> = {}) {
  try {
    if (typeof window !== 'undefined') {
      // 1. Call official Whop Pixel tracking if injected by whop.app / whop.site
      if (window.whop && typeof window.whop.track === 'function') {
        window.whop.track(eventName, payload);
      } else {
        console.log(`[Whop.track simulated] ${eventName}:`, payload);
      }

      // 2. Dispatch custom event for our on-screen Real-time Event Inspector HUD
      window.dispatchEvent(
        new CustomEvent('whop_custom_track', {
          detail: { eventName, payload, timestamp: new Date().toISOString() }
        })
      );
    }
  } catch (err) {
    console.warn(`[whop.track error] Failed to dispatch ${eventName}:`, err);
  }
}

export const whopTrack = {
  estimateRequested: (data: {
    roofMaterial: string;
    urgency: string;
    zipCode: string;
    name: string;
  }) => {
    trackWhopEvent('estimate_requested', {
      roof_material: data.roofMaterial,
      urgency: data.urgency,
      zip_code: data.zipCode,
      homeowner_name: data.name,
      currency: 'USD',
      lead_source: 'interactive_funnel',
    });
  },

  serviceViewed: (data: {
    serviceId: string;
    serviceName: string;
    price: number;
    category?: string;
  }) => {
    trackWhopEvent('service_viewed', {
      service_id: data.serviceId,
      service_name: data.serviceName,
      price: data.price,
      currency: 'USD',
      category: data.category || 'roofing_services',
    });
  },

  depositStarted: (data: {
    planId: string;
    planName: string;
    depositAmount: number;
    setupFutureUsage?: boolean;
  }) => {
    trackWhopEvent('deposit_started', {
      plan_id: data.planId,
      plan_name: data.planName,
      amount: data.depositAmount,
      currency: 'USD',
      card_on_file_requested: true,
      setup_future_usage: 'off_session',
    });
  },
};

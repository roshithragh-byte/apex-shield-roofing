import React, { createContext, useContext, useState, useEffect } from 'react';
import { roofingConfig } from '../../roofing.config';

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  zipCode: string;
  roofMaterial: string;
  urgency: string;
  notes?: string;
  timestamp: string;
  syncedToWhop: boolean;
}

export interface StoredPaymentMethod {
  id: string; // e.g. "pmt_visa_4242"
  brand: string;
  last4: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  depositAmount: number;
  timestamp: string;
  setupIntentId: string;
}

export interface InvoiceRecord {
  id: string; // e.g. "inv_882914"
  amount: number;
  description: string;
  status: 'paid' | 'sent' | 'draft';
  chargedVia: 'auto_charge_card_on_file' | 'manual_hosted_link';
  customerEmail: string;
  customerName: string;
  timestamp: string;
}

export interface TrackedPixelEvent {
  id: string;
  eventName: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

interface PitchDemoContextType {
  pitchMode: 'homeowner' | 'contractor';
  togglePitchMode: () => void;
  leads: LeadRecord[];
  addLead: (lead: Omit<LeadRecord, 'id' | 'timestamp' | 'syncedToWhop'>) => LeadRecord;
  storedPaymentMethod: StoredPaymentMethod | null;
  savePaymentMethod: (pm: StoredPaymentMethod) => void;
  invoices: InvoiceRecord[];
  dispatchFinalInvoice: (params: {
    amount: number;
    description: string;
    autoCharge: boolean;
  }) => InvoiceRecord;
  trackedEvents: TrackedPixelEvent[];
  recordTrackEvent: (eventName: string, payload: Record<string, unknown>) => void;
  selectedPlan: typeof roofingConfig.plans.inspection | typeof roofingConfig.plans.deposit | typeof roofingConfig.plans.flatRateService | null;
  isCheckoutOpen: boolean;
  openCheckout: (plan: typeof roofingConfig.plans.inspection | typeof roofingConfig.plans.deposit | typeof roofingConfig.plans.flatRateService) => void;
  closeCheckout: () => void;
}

const PitchDemoContext = createContext<PitchDemoContextType | undefined>(undefined);

export const PitchDemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pitchMode, setPitchMode] = useState<'homeowner' | 'contractor'>('homeowner');
  const [selectedPlan, setSelectedPlan] = useState<PitchDemoContextType['selectedPlan']>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initialize with realistic mock lead so the roofer pitch bar is demonstratable immediately
  const [leads, setLeads] = useState<LeadRecord[]>(() => {
    try {
      const saved = localStorage.getItem('apex_roofing_leads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'lead_demo_01',
        name: 'David & Rachel Miller',
        phone: '(512) 555-8931',
        email: 'd.miller@austin.rr.com',
        address: '4208 Scenic Valley Dr',
        zipCode: '78746',
        roofMaterial: 'Architectural Asphalt Shingle',
        urgency: 'Active Water Leak / Emergency',
        notes: 'Water dripping in upstairs nursery ceiling after Tuesday hail storm.',
        timestamp: 'Today, 8:42 AM',
        syncedToWhop: true,
      }
    ];
  });

  const [storedPaymentMethod, setStoredPaymentMethod] = useState<StoredPaymentMethod | null>(() => {
    try {
      const saved = localStorage.getItem('apex_roofing_card_on_file');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'pmt_visa_4242_vault',
      brand: 'Visa',
      last4: '4242',
      customerName: 'David Miller',
      customerEmail: 'd.miller@austin.rr.com',
      planName: 'Project Commitment & Crew Slot Deposit ($500)',
      depositAmount: 500,
      timestamp: 'Today, 9:15 AM',
      setupIntentId: 'seti_8921_vaulted_off_session'
    };
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('apex_roofing_invoices');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [trackedEvents, setTrackedEvents] = useState<TrackedPixelEvent[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_roofing_leads', JSON.stringify(leads));
    } catch {}
  }, [leads]);

  useEffect(() => {
    try {
      if (storedPaymentMethod) {
        localStorage.setItem('apex_roofing_card_on_file', JSON.stringify(storedPaymentMethod));
      }
    } catch {}
  }, [storedPaymentMethod]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_roofing_invoices', JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  const togglePitchMode = () => {
    setPitchMode(prev => prev === 'homeowner' ? 'contractor' : 'homeowner');
  };

  const addLead = (leadData: Omit<LeadRecord, 'id' | 'timestamp' | 'syncedToWhop'>): LeadRecord => {
    const newLead: LeadRecord = {
      ...leadData,
      id: `lead_${Date.now().toString(36)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      syncedToWhop: true,
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  };

  const savePaymentMethod = (pm: StoredPaymentMethod) => {
    setStoredPaymentMethod(pm);
  };

  const dispatchFinalInvoice = ({
    amount,
    description,
    autoCharge
  }: {
    amount: number;
    description: string;
    autoCharge: boolean;
  }): InvoiceRecord => {
    const newInvoice: InvoiceRecord = {
      id: `inv_${Date.now().toString(36).toUpperCase()}`,
      amount,
      description,
      status: autoCharge ? 'paid' : 'sent',
      chargedVia: autoCharge ? 'auto_charge_card_on_file' : 'manual_hosted_link',
      customerEmail: storedPaymentMethod?.customerEmail || 'client@example.com',
      customerName: storedPaymentMethod?.customerName || 'Valued Homeowner',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const recordTrackEvent = (eventName: string, payload: Record<string, unknown>) => {
    const eventItem: TrackedPixelEvent = {
      id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      eventName,
      payload,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setTrackedEvents(prev => [eventItem, ...prev].slice(0, 20)); // keep last 20
  };

  const openCheckout = (plan: typeof roofingConfig.plans.inspection | typeof roofingConfig.plans.deposit | typeof roofingConfig.plans.flatRateService) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <PitchDemoContext.Provider
      value={{
        pitchMode,
        togglePitchMode,
        leads,
        addLead,
        storedPaymentMethod,
        savePaymentMethod,
        invoices,
        dispatchFinalInvoice,
        trackedEvents,
        recordTrackEvent,
        selectedPlan,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </PitchDemoContext.Provider>
  );
};

export const usePitchDemo = () => {
  const context = useContext(PitchDemoContext);
  if (!context) {
    throw new Error('usePitchDemo must be used within a PitchDemoProvider');
  }
  return context;
};

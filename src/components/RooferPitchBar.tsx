import React, { useState } from 'react';
import { usePitchDemo } from '../context/PitchDemoContext';
import { roofingConfig } from '../../roofing.config';
import { whopTrack } from '../utils/tracking';
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Users,
  Receipt,
  CheckCircle2,
  Send,
  Zap,
  Info,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const RooferPitchBar: React.FC = () => {
  const {
    pitchMode,
    togglePitchMode,
    leads,
    storedPaymentMethod,
    invoices,
    dispatchFinalInvoice,
  } = usePitchDemo();

  const [isOpen, setIsOpen] = useState(true);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(9850);
  const [invoiceDesc, setInvoiceDesc] = useState('Final Balance — Architectural Shingle Installation & Clean-Up');
  const [autoCharge, setAutoCharge] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastDispatchedId, setLastDispatchedId] = useState<string | null>(null);

  const handleCreateFinalInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceAmount || invoiceAmount <= 0) return;

    setIsDispatching(true);
    setTimeout(() => {
      const inv = dispatchFinalInvoice({
        amount: invoiceAmount,
        description: invoiceDesc,
        autoCharge: autoCharge && !!storedPaymentMethod,
      });

      setLastDispatchedId(inv.id);
      setIsDispatching(false);

      // Track event
      whopTrack.serviceViewed({
        serviceId: inv.id,
        serviceName: `Final Invoice ${inv.id}`,
        price: invoiceAmount,
        category: 'final_invoice',
      });
    }, 800);
  };

  return (
    <aside
      aria-label="Contractor Demonstration HUD"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-amber-500/40 backdrop-blur-md shadow-2xl transition-all duration-300"
    >
      {/* Top Toggle Strip */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Roofer Pitch Simulation Cockpit
            </span>
          </div>

          <span className="hidden md:inline-block text-[11px] text-slate-400 border-l border-slate-700 pl-3">
            Simulating live contractor operations: <strong>Deposit → Job Completion → Final Invoice</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePitchMode}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
              pitchMode === 'contractor'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{pitchMode === 'contractor' ? 'Contractor Mode: Active' : 'Switch to Pitch Mode'}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse cockpit" : "Expand cockpit"}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Cockpit Body */}
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Column 1: Live Leads Counter */}
            <div className="lg:col-span-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Whop Leads API
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {leads.length} Active {leads.length === 1 ? 'Lead' : 'Leads'}
                </span>
              </div>

              <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {leads.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No estimate requests yet. Submit the form above!</p>
                ) : (
                  leads.map((l) => (
                    <div key={l.id} className="p-2 bg-slate-900/80 rounded border border-slate-800/80 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="font-medium text-slate-200 truncate">{l.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{l.zipCode} • {l.roofMaterial}</p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono flex-shrink-0">
                        Whop Lead
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: Card-on-File Vault */}
            <div className="lg:col-span-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Setup Intent Card-on-File
                </span>
                {storedPaymentMethod ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Vaulted Ready
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                    Awaiting Deposit
                  </span>
                )}
              </div>

              {storedPaymentMethod ? (
                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono text-white text-xs">
                    <span>{storedPaymentMethod.brand} •••• {storedPaymentMethod.last4}</span>
                    <span className="text-[10px] text-amber-400 font-sans font-semibold">Off-Session Chargeable</span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    Customer: {storedPaymentMethod.customerName} ({storedPaymentMethod.customerEmail})
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Intent: {storedPaymentMethod.setupIntentId}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 p-2 bg-slate-900/40 rounded border border-slate-800/40">
                  Pay the <strong>$500 Project Deposit</strong> above using Whop Elements to capture customer card on file.
                </p>
              )}
            </div>

            {/* Column 3: Final Invoice Trigger */}
            <div className="lg:col-span-5 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  Whop Invoices API (Post-Job Billing)
                </span>
                <span className="text-[10px] text-slate-400">Job Walkthrough Step</span>
              </div>

              <form onSubmit={handleCreateFinalInvoice} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      aria-label="Final invoice balance amount"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-750 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      placeholder="9850"
                      min={100}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isDispatching || !storedPaymentMethod}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    {isDispatching ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    <span>{autoCharge ? 'Auto-Charge Card' : 'Send Invoice'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={autoCharge}
                      onChange={(e) => setAutoCharge(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 w-3 h-3"
                    />
                    <span>Charge vaulted card on file directly</span>
                  </label>

                  {invoices.length > 0 && (
                    <span className="text-emerald-400 font-medium">
                      ✓ {invoices.length} {invoices.length === 1 ? 'Invoice' : 'Invoices'} Succeeded
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

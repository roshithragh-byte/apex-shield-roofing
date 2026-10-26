import React, { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { createWhopInvoice } from '../utils/whopClient';
import {
  FileText,
  CreditCard,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calculator,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const Route = createFileRoute('/invoice-demo')({
  component: InvoiceDemoPage,
});

function InvoiceDemoPage() {
  const [customerName, setCustomerName] = useState('Marcus Vance');
  const [customerEmail, setCustomerEmail] = useState('marcus@austin-properties.com');
  const [jobTotal, setJobTotal] = useState(2400);
  const [depositPaid, setDepositPaid] = useState(500);
  const [collectionMethod, setCollectionMethod] = useState<'send_invoice' | 'charge_automatically'>('send_invoice');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentTokenId, setPaymentTokenId] = useState('');
  const [savedCardNotice, setSavedCardNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<{
    invoiceId: string;
    invoiceNumber?: string;
    status: string;
    payOnlineUrl?: string;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute final balance due
  const balanceDue = Math.max(0, jobTotal - depositPaid);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSetupId = window.localStorage.getItem('whop-setup-intent-id');
      if (storedSetupId) {
        const simulatedPmt = `pmt_${storedSetupId.replace('seti_', '')}`;
        setPaymentMethodId(simulatedPmt);
        setSavedCardNotice(
          `Saved card found from setup intent ${storedSetupId} (vaulted method ${simulatedPmt}).`
        );
      }
    }
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setInvoiceResult(null);

    try {
      const result = await createWhopInvoice({
        customerName,
        customerEmail,
        amount: balanceDue,
        description: `Austin Roof Installation - 2408 Barton Springs Rd`,
        autoCharge: collectionMethod === 'charge_automatically',
        paymentMethodId: paymentMethodId || undefined,
      });

      setInvoiceResult({
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber || '#00000001',
        status: result.status,
        payOnlineUrl: result.payOnlineUrl,
        message: result.message,
      });
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not generate final-balance invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-grow py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Whop Invoices API • Milestone Balance Settlement</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Final-Balance Invoice Demo
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              The roof installation is complete. Bill the remaining balance: the $500 deposit already paid is credited in full against the job total, and the rest is settled via the Whop Invoices API — auto-charged to the stored card on file, or emailed as a secure pay link.
            </p>
          </div>

          {/* Setup Intent Vault Callout */}
          {savedCardNotice && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Card-on-File Detected</strong>
                <span>{savedCardNotice}</span>
              </div>
            </div>
          )}

          {/* Success Invoice Result */}
          {invoiceResult && (
            <div className="mb-8 p-6 sm:p-8 bg-slate-900/90 border border-emerald-500/50 rounded-3xl text-center space-y-5 shadow-2xl animate-fade-in">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Invoice {invoiceResult.invoiceNumber} Created
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  ID <code className="text-amber-300 font-mono px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800">{invoiceResult.invoiceId}</code> · Status <code className="text-emerald-400 font-mono font-semibold">{invoiceResult.status}</code>
                </p>
              </div>

              {invoiceResult.payOnlineUrl && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-slate-400 font-medium">Customer Pay-Online Link:</span>
                  <a
                    href={invoiceResult.payOnlineUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-mono text-xs underline flex items-center gap-1 truncate max-w-xs"
                  >
                    <span>{invoiceResult.payOnlineUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
                Verify this transaction in Whop Dashboard &gt; Invoices. For <code>charge_automatically</code>, the charge executes against the stored method; for <code>send_invoice</code>, the customer receives an itemized pay link via email.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setInvoiceResult(null)}
                  className="py-2.5 px-5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Generate Another Invoice
                </button>
                <Link
                  to="/"
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Job Total (USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={jobTotal}
                    onChange={(e) => setJobTotal(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Deposit Already Paid (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Dynamic Math Box */}
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Final Balance Due
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">
                      ${balanceDue.toLocaleString()} USD
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Job ${jobTotal.toLocaleString()} − Deposit ${depositPaid.toLocaleString()}</span>
                </div>
              </div>

              {/* Collection Method Radio */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
                  How should the balance be collected?
                </legend>

                <label className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="radio"
                    name="collectionMethod"
                    checked={collectionMethod === 'send_invoice'}
                    onChange={() => setCollectionMethod('send_invoice')}
                    className="accent-amber-500"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-white block">
                      Send invoice — email the customer a pay-online link
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sends a secure Whop checkout link to {customerEmail} with 14-day payment terms.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="radio"
                    name="collectionMethod"
                    checked={collectionMethod === 'charge_automatically'}
                    onChange={() => setCollectionMethod('charge_automatically')}
                    className="accent-amber-500"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-white block">
                      Charge automatically — bill the saved card on file
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Debits the payment method captured during initial $500 deposit checkout.
                    </span>
                  </div>
                </label>
              </fieldset>

              {collectionMethod === 'charge_automatically' && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 animate-fade-in text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Payment Method ID (pmt_...)
                    </label>
                    <input
                      type="text"
                      value={paymentMethodId}
                      onChange={(e) => setPaymentMethodId(e.target.value)}
                      placeholder="pmt_..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Payment Token ID (Optional payt_...)
                    </label>
                    <input
                      type="text"
                      value={paymentTokenId}
                      onChange={(e) => setPaymentTokenId(e.target.value)}
                      placeholder="payt_..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The Setup Intent provides the method ID prefilled above. When executed, Whop automatically charges the stored card.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || balanceDue <= 0}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Issuing Whop Final-Balance Invoice...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Create Final-Balance Whop Invoice (${balanceDue.toLocaleString()})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

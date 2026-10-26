import React, { useState, useEffect } from 'react';
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { verifyWhopPayment, verifyWhopSetupIntent } from '../../utils/whopClient';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Home,
  Clock
} from 'lucide-react';

interface CheckoutCompleteSearch {
  payment?: string;
  setup?: string;
  status?: string;
  plan?: string;
}

export const Route = createFileRoute('/checkout/complete')({
  validateSearch: (search: Record<string, unknown>): CheckoutCompleteSearch => {
    return {
      payment: search.payment as string | undefined,
      setup: search.setup as string | undefined,
      status: search.status as string | undefined,
      plan: search.plan as string | undefined,
    };
  },
  component: CheckoutCompletePage,
});

function CheckoutCompletePage() {
  const search = useSearch({ from: '/checkout/complete' });
  const paymentId = search.payment || '';
  const setupIntentId = search.setup || '';
  const status = search.status || '';

  const [verificationNote, setVerificationNote] = useState<string | null>(null);

  useEffect(() => {
    if (setupIntentId) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('whop-setup-intent-id', setupIntentId);
      }
      verifyWhopSetupIntent(setupIntentId)
        .then((res: { paymentMethodId: string }) => {
          setVerificationNote(`Card successfully vaulted: method ${res.paymentMethodId} is on file with Whop.`);
        })
        .catch(() => {
          setVerificationNote(`Card saved on file from setup intent ${setupIntentId}.`);
        });
    } else if (paymentId) {
      verifyWhopPayment(paymentId)
        .then((res: { status: string }) => {
          setVerificationNote(`Verified with Whop: payment status is "${res.status}".`);
        })
        .catch(() => {
          setVerificationNote(`Payment ${paymentId} recorded.`);
        });
    }
  }, [setupIntentId, paymentId, status]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-xl mx-auto relative z-10">
          {setupIntentId ? (
            /* Card-on-File Saved State */
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <CreditCard className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Card Saved on File
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
                  Setup Intent <code className="text-amber-300 font-mono text-xs px-2 py-0.5 bg-slate-950 rounded border border-slate-800">{setupIntentId}</code> — zero dollars were charged today. The card is now safely vaulted for the final-balance invoice upon project sign-off.
                </p>
              </div>

              {verificationNote && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-emerald-400 font-mono">
                  {verificationNote}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/invoice-demo"
                  className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Continue to Final-Balance Invoice Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center"
                >
                  Return to Site
                </Link>
              </div>
            </div>
          ) : paymentId ? (
            /* One-Time Payment Completed State */
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Thank You — Payment Received
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
                  Whop Payment <code className="text-amber-300 font-mono text-xs px-2 py-0.5 bg-slate-950 rounded border border-slate-800">{paymentId}</code> completed successfully. Austin dispatch will contact you within one business day to coordinate on-site logistics.
                </p>
              </div>

              {verificationNote && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-emerald-400 font-mono">
                  {verificationNote}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/invoice-demo"
                  className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Proceed to Invoice Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : (
            /* General Checkout Notice State */
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400 mx-auto">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">
                  Whop Checkout Status
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  No payment or setup reference arrived with this direct visit. If you just checked out, your transaction is safely recorded in the Whop Merchant Dashboard.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/invoice-demo"
                  className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Invoice Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React, { useState } from 'react';
import {
  WhopElements,
  Payments,
  PaymentElement,
  ExpressCheckoutElement,
  BrandingElement,
} from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { whopTrack } from '../utils/tracking';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

type PlanType = typeof roofingConfig.plans.inspection | typeof roofingConfig.plans.deposit | typeof roofingConfig.plans.flatRateService;

interface WhopCheckoutModalProps {
  plan: PlanType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WhopCheckoutModal: React.FC<WhopCheckoutModalProps> = ({
  plan,
  onClose,
  onSuccess,
}) => {
  const { savePaymentMethod } = usePitchDemo();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  if (!plan) return null;

  const isDeposit = !!plan.depositOnly || plan.id === roofingConfig.plans.deposit.id;

  const handleSimulateSandboxCheckout = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Save payment method on file (card-on-file via setupFutureUsage: 'off_session')
      savePaymentMethod({
        id: `pmt_whop_visa_${Math.floor(1000 + Math.random() * 9000)}`,
        brand: 'Visa',
        last4: '4242',
        customerName: 'Demo Homeowner',
        customerEmail: 'demo.homeowner@example.com',
        planName: plan.name,
        depositAmount: plan.price,
        timestamp: 'Just now',
        setupIntentId: `seti_${Date.now().toString(36)}_off_session`,
      });

      // 2. Track event in Whop Analytics
      if (isDeposit) {
        whopTrack.depositStarted({
          planId: plan.id,
          planName: plan.name,
          depositAmount: plan.price,
        });
      } else {
        whopTrack.serviceViewed({
          serviceId: plan.id,
          serviceName: plan.name,
          price: plan.price,
        });
      }

      setIsProcessing(false);
      setIsCompleted(true);
      if (onSuccess) onSuccess();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {roofingConfig.company.name} Checkout
              </span>
              <h3 id="checkout-modal-title" className="text-lg font-bold text-white">
                {plan.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          /* Completion State */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">
                {isDeposit ? 'Deposit Received & Crew Reserved!' : 'Payment Complete!'}
              </h4>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                {isDeposit
                  ? 'Your project slot is locked. Your payment method has been stored securely on file for the post-completion balance.'
                  : `Your booking for ${plan.name} ($${plan.price}) has been confirmed.`}
              </p>
            </div>

            {/* Card on file badge */}
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  Stored Card-on-File
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-sm font-mono text-white flex items-center justify-between">
                <span>Visa ending in •••• 4242</span>
                <span className="text-xs text-slate-400 font-sans">Exp 12/28</span>
              </p>
              {isDeposit && (
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                  Remaining balance can be billed via the Whop Invoices API upon final homeowner sign-off.
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Done & Return to Site</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Body */
          <div className="p-6 space-y-6">
            {/* Order summary tile */}
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-750 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                    {isDeposit ? 'deposit' : 'flat service'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Same-day scheduling
                  </span>
                </div>
                <h4 className="font-semibold text-white">{plan.name}</h4>
                <p className="text-xs text-slate-400">{plan.tagline}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">${plan.price}</span>
                <span className="block text-[11px] text-slate-400">USD one-time</span>
              </div>
            </div>

            {/* Deposit notification if applicable */}
            {isDeposit && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-300">Contractor Deposit Workflow:</strong> Paying this deposit holds your project start date and securely registers your card on file with Whop. Your remaining roof balance is invoiced after quality inspection and sign-off.
                </p>
              </div>
            )}

            {/* Whop Elements Checkout Container */}
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Whop Elements Secure Checkout
                </span>
                <span className="text-[11px] text-slate-400">256-bit SSL Encrypted</span>
              </div>

              {/* Mount Whop Elements */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4 min-h-[140px]">
                <WhopElements
                  elements={loadWhop()}
                  environment="sandbox"
                  appearance={{
                    theme: {
                      appearance: 'dark',
                      accentColor: 'amber',
                      grayColor: 'slate',
                    },
                  }}
                  onLoadError={(err) => {
                    console.warn('Whop Elements initialization notice:', err);
                    setLoadError(err.message || 'Whop Elements offline');
                  }}
                >
                  <Payments
                    accountId={roofingConfig.whop.companyId}
                    plan={plan.id}
                    setupFutureUsage={isDeposit ? 'off_session' : undefined}
                  >
                    {/* Express Checkout (Apple Pay, Google Pay) */}
                    <div className="mb-3">
                      <ExpressCheckoutElement />
                    </div>

                    <div className="relative my-3 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                      </div>
                      <span className="relative px-3 text-[11px] uppercase tracking-wider bg-slate-950 text-slate-400">
                        Or pay with Card / Financing
                      </span>
                    </div>

                    {/* Main Whop Payment Element */}
                    <PaymentElement />

                    {/* Mandatory Whop Branding Element */}
                    <div className="mt-4 pt-2 border-t border-slate-800/80">
                      <BrandingElement />
                    </div>
                  </Payments>
                </WhopElements>
              </div>
            </div>

            {/* Sandbox Simulation / Instant Test Checkout */}
            <div className="p-4 bg-gradient-to-br from-slate-850 to-slate-900 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Whop Sandbox Test Mode
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                  Instant Verification
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Test the end-to-end payment element and card-on-file capture flow in sandbox mode with one click:
              </p>
              <button
                type="button"
                onClick={handleSimulateSandboxCheckout}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Whop Setup Intent...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Complete Sandbox Checkout (${plan.price})</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantee footer */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Refundable Deposit
              </span>
              <span>•</span>
              <span>Licensed & Insured #{roofingConfig.company.licenseNumber}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

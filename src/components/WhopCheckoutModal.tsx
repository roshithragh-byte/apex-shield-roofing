import React, { useState } from 'react';
import {
  WhopElements,
  Checkout,
  CheckoutElement,
  Payments,
  PaymentElement,
  ExpressCheckoutElement,
  BrandingElement,
  EmailElement,
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
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';

type PlanType = typeof roofingConfig.plans.inspection | typeof roofingConfig.plans.deposit | typeof roofingConfig.plans.flatRateService;

interface WhopCheckoutModalProps {
  plan: PlanType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Resilient Error Boundary for client-side payment element mounting
 */
class ElementsErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[Whop Elements ErrorBoundary caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-slate-950/60 rounded-xl border border-amber-500/30 text-center space-y-2">
            <p className="text-xs text-amber-300 font-semibold">
              Whop Elements Test Preview Active
            </p>
            <p className="text-[11px] text-slate-400">
              Interactive test checkout is ready below with simulated card-on-file vaulting.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export const WhopCheckoutModal: React.FC<WhopCheckoutModalProps> = ({
  plan,
  onClose,
  onSuccess,
}) => {
  const { savePaymentMethod } = usePitchDemo();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<'checkout_element' | 'payment_element'>('checkout_element');
  const [loadError, setLoadError] = useState<string | null>(null);

  if (!plan) return null;

  const isDeposit = !!plan.depositOnly || plan.id === roofingConfig.plans.deposit.id;

  const handleCheckoutComplete = (completionData?: any) => {
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
  };

  const handleSimulateSandboxCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      handleCheckoutComplete();
    }, 800);
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
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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
                <span className="text-emerald-400 font-semibold font-mono">Vaulted via Whop</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-white pt-1">
                <span>Visa ending in 4242</span>
                <span className="text-xs text-slate-400 font-normal">Exp 12/28</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 leading-relaxed">
                Vaulted with <code className="text-amber-300">setupFutureUsage: 'off_session'</code>. Authorized for balance settlement upon final roof inspection sign-off.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 bg-slate-850 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Close Window
              </button>
              <a
                href="#roofer-demo"
                onClick={onClose}
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>View Roofer Balance Demo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Active Checkout State */
          <div className="p-6 space-y-6">
            {/* Plan Price Summary */}
            <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div>
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

            {/* Elements Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setCheckoutMode('checkout_element')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  checkoutMode === 'checkout_element'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>CheckoutElement (Express & BNPL)</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutMode('payment_element')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  checkoutMode === 'payment_element'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>PaymentElement + Branding</span>
              </button>
            </div>

            {/* Whop Elements Checkout Container */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Whop Elements Secure Checkout (Whop Payments Only)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Plan: {plan.id}</span>
              </div>

              {/* Mount Whop Elements inside resilient ErrorBoundary */}
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-4 min-h-[160px]">
                <ElementsErrorBoundary>
                  <WhopElements
                    elements={loadWhop()}
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
                    {checkoutMode === 'checkout_element' ? (
                      /* Mode A: CheckoutElement Integration with ExpressCheckout & Branding */
                      <div className="space-y-4">
                        <Checkout
                          plan={plan.id}
                          metadata={{
                            order_id: `ord_${Date.now()}`,
                            service_name: plan.name,
                            deposit_mode: isDeposit ? 'true' : 'false',
                          }}
                          returnUrl={typeof window !== 'undefined' ? window.location.href : 'https://apexshield-roofing-pro.whop.site'}
                          onComplete={(completion) => {
                            console.log('[Whop Checkout Complete]', completion);
                            handleCheckoutComplete(completion);
                          }}
                        >
                          {/* Express Checkout (Apple Pay & Google Pay) */}
                          <div className="mb-3">
                            <ExpressCheckoutElement />
                          </div>

                          {/* Complete Checkout Element with Klarna, Afterpay, Splitit & Cards */}
                          <CheckoutElement />
                        </Checkout>

                        {/* Required Branding Element properly scoped in Payments context */}
                        <Payments
                          accountId={roofingConfig.whop.companyId}
                          plan={plan.id}
                        >
                          <div className="pt-2 border-t border-slate-800/80">
                            <BrandingElement />
                          </div>
                        </Payments>
                      </div>
                    ) : (
                      /* Mode B: Payments with PaymentElement & BrandingElement Integration */
                      <Payments
                        accountId={roofingConfig.whop.companyId}
                        plan={plan.id}
                        setupFutureUsage={isDeposit ? 'off_session' : undefined}
                      >
                        <div className="mb-3">
                          <EmailElement />
                        </div>

                        <PaymentElement />

                        <div className="mt-4 pt-2 border-t border-slate-800/80">
                          <BrandingElement />
                        </div>
                      </Payments>
                    )}
                  </WhopElements>
                </ElementsErrorBoundary>
              </div>
            </div>

            {/* Test Card & Sandbox Verification Banner */}
            <div className="p-3.5 bg-gradient-to-br from-slate-850 to-slate-900 border border-amber-500/30 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Whop Sandbox Test Verification
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 border border-amber-500/30 font-mono">
                  Card 4242 4242 4242 4242
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Enter test card details in Whop Elements above, or complete instant 1-click test checkout to verify card-on-file capture:
              </p>
              <button
                type="button"
                onClick={handleSimulateSandboxCheckout}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Whop Setup Intent & Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Complete Test Checkout (${plan.price})</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantee footer */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-800">
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

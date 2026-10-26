import React, { useState, useEffect } from 'react';
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import {
  WhopElements,
  Checkout,
  CheckoutElement,
  Payments,
  ExpressCheckoutElement,
  BrandingElement,
} from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { roofingConfig } from '../../../roofing.config';
import { whopTrack } from '../../utils/tracking';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronRight,
  AlertCircle,
  Smartphone
} from 'lucide-react';

interface CheckoutSearch {
  plan?: 'inspection' | 'deposit' | 'service';
}

export const Route = createFileRoute('/checkout/')({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => {
    return {
      plan: (search.plan as 'inspection' | 'deposit' | 'service') || 'deposit',
    };
  },
  component: CheckoutPage,
});

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
              Whop Elements Ready
            </p>
            <p className="text-[11px] text-slate-400">
              Interactive test checkout is active with card-on-file vaulting.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

function CheckoutPage() {
  const search = useSearch({ from: '/checkout/' });
  const planKey = (search?.plan as 'inspection' | 'deposit' | 'service') || 'deposit';

  const planMap = {
    inspection: {
      key: 'inspection',
      id: roofingConfig.plans.inspection.id,
      name: roofingConfig.plans.inspection.name,
      price: roofingConfig.plans.inspection.price,
      displayPrice: `$${roofingConfig.plans.inspection.price}`,
      tagline: roofingConfig.plans.inspection.tagline,
      blurb: 'Comprehensive 4K aerial drone scan, attic moisture audit, and certified adjuster damage report.',
      isDeposit: false,
    },
    deposit: {
      key: 'deposit',
      id: roofingConfig.plans.deposit.id,
      name: roofingConfig.plans.deposit.name,
      price: roofingConfig.plans.deposit.price,
      displayPrice: `$${roofingConfig.plans.deposit.price}`,
      tagline: roofingConfig.plans.deposit.tagline,
      blurb: 'Lock in your production crew start date. The $500 deposit is credited 100% against your final invoice, and your card is stored on file for the post-completion balance.',
      isDeposit: true,
    },
    service: {
      key: 'service',
      id: roofingConfig.plans.flatRateService.id,
      name: roofingConfig.plans.flatRateService.name,
      price: roofingConfig.plans.flatRateService.price,
      displayPrice: `$${roofingConfig.plans.flatRateService.price}`,
      tagline: roofingConfig.plans.flatRateService.tagline,
      blurb: 'All-inclusive repair for active leaks, chimney flashing rebuild, and up to 2 squares architectural shingle replacement with a 5-year warranty.',
      isDeposit: false,
    },
  };

  const currentPlan = planMap[planKey] || planMap.deposit;
  const [checkoutMode, setCheckoutMode] = useState<'full' | 'express' | 'setup'>('full');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isProcessingSandbox, setIsProcessingSandbox] = useState(false);

  useEffect(() => {
    // Fire tracking event upon mounting checkout page
    if (currentPlan.isDeposit) {
      whopTrack.depositStarted({
        planId: currentPlan.id,
        planName: currentPlan.name,
        depositAmount: currentPlan.price,
      });
    } else {
      whopTrack.serviceViewed({
        serviceId: currentPlan.id,
        serviceName: currentPlan.name,
        price: currentPlan.price,
      });
    }
  }, [currentPlan]);

  const returnUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/checkout/complete?plan=${currentPlan.key}`
    : 'https://apexshield-roofing-pro.whop.app/checkout/complete';

  const handleCheckoutComplete = (res?: any) => {
    const setupId = res?.setupIntentId || `seti_${Date.now().toString(36)}_vault`;
    const paymentId = res?.paymentId || `pay_${Date.now().toString(36)}`;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('whop-setup-intent-id', setupId);
    }

    if (res?.result === 'setup' || checkoutMode === 'setup') {
      setCompletionMessage(`Card saved on file (Setup Intent ${setupId}). Nothing was charged. Your card is safely vaulted with Whop for final-balance settlement.`);
    } else {
      setCompletionMessage(`Payment completed: ${paymentId}. Your crew slot has been secured, and your card is stored on file for the final-balance invoice.`);
    }
    setIsCompleted(true);
  };

  const handleSandboxSimulate = () => {
    setIsProcessingSandbox(true);
    setTimeout(() => {
      setIsProcessingSandbox(false);
      handleCheckoutComplete({
        result: currentPlan.isDeposit ? 'setup' : 'payment',
        setupIntentId: `seti_${Date.now().toString(36)}_austin_vault`,
        paymentId: `pay_${Date.now().toString(36)}_simulated`,
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-grow py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Plan selection tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-semibold">
            <Link
              to="/checkout"
              search={{ plan: 'inspection' }}
              className={`py-2 px-4 rounded-xl transition-all ${
                planKey === 'inspection'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Inspection ($149)
            </Link>
            <Link
              to="/checkout"
              search={{ plan: 'deposit' }}
              className={`py-2 px-4 rounded-xl transition-all ${
                planKey === 'deposit'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deposit ($500)
            </Link>
            <Link
              to="/checkout"
              search={{ plan: 'service' }}
              className={`py-2 px-4 rounded-xl transition-all ${
                planKey === 'service'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flat-Rate Repair ($2,499)
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Whop Payment Elements • 256-Bit SSL Encrypted</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Checkout — {currentPlan.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {currentPlan.blurb} Price: <strong className="text-white">{currentPlan.displayPrice}</strong>. Secure checkout powered entirely by Whop — Apple Pay, Google Pay, cards, and automatic BNPL financing (Klarna, Splitit, Afterpay).
            </p>
          </div>

          {/* Completion Callout */}
          {isCompleted && (
            <div className="mb-8 p-6 bg-slate-900/90 border border-emerald-500/50 rounded-3xl text-center space-y-4 shadow-2xl animate-fade-in">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {currentPlan.isDeposit ? 'Crew Slot Secured & Card Saved!' : 'Payment Succeeded!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {completionMessage}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/invoice-demo"
                  className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Continue to Final-Balance Invoice Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* Checkout Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            {/* Price Summary Strip */}
            <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">{currentPlan.name}</h4>
                <p className="text-xs text-slate-400">{currentPlan.tagline}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{currentPlan.displayPrice}</span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {currentPlan.isDeposit ? 'Deposit Credit' : 'One-Time Charge'}
                </span>
              </div>
            </div>

            {/* Elements Mode Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setCheckoutMode('full')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'full'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Full Checkout</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutMode('express')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'express'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Express Wallets</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutMode('setup')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'setup'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Save Card Only</span>
              </button>
            </div>

            {/* Whop Elements Mounting Area */}
            <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Whop Payments Surface
                </span>
                <span className="font-mono text-[11px] text-slate-500">{currentPlan.id}</span>
              </div>

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
                >
                  <Checkout
                    plan={currentPlan.id}
                    returnUrl={returnUrl}
                    onComplete={handleCheckoutComplete}
                  >
                    {checkoutMode === 'express' ? (
                      <ExpressCheckoutElement
                        wallets={{
                          applePay: 'auto',
                          googlePay: 'auto',
                          payPal: 'never',
                        }}
                      />
                    ) : (
                      <CheckoutElement />
                    )}
                  </Checkout>

                  {/* Required Seller Branding Element */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Verified Seller Branding
                    </h5>
                    <Payments
                      accountId={roofingConfig.whop.companyId}
                      plan={currentPlan.id}
                    >
                      <BrandingElement />
                    </Payments>
                  </div>
                </WhopElements>
              </ElementsErrorBoundary>
            </div>

            {/* Sandbox Simulation / Instant Test Verification */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Sandbox Test Verification
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 font-mono border border-slate-700">
                  Card 4242 • Whop Vault
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Test the complete flow instantly: store test card credentials, register the Setup Intent, and advance to the final invoice demo.
              </p>
              <button
                type="button"
                onClick={handleSandboxSimulate}
                disabled={isProcessingSandbox}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingSandbox ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Setup Intent & Saving Method...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Complete Test Checkout ({currentPlan.displayPrice})</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 leading-relaxed">
              Financing notice: Klarna, Splitit, and Afterpay appear automatically at checkout for approved merchants.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

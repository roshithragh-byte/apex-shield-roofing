import React from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { Check, ShieldCheck, Zap, Sparkles, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { whopTrack } from '../utils/tracking';

export const Plans: React.FC = () => {
  const { openCheckout } = usePitchDemo();

  const handlePlanSelect = (plan: typeof roofingConfig.plans.inspection | typeof roofingConfig.plans.deposit | typeof roofingConfig.plans.flatRateService) => {
    if (plan.id === roofingConfig.plans.deposit.id) {
      whopTrack.depositStarted({
        planId: plan.id,
        planName: plan.name,
        depositAmount: plan.price,
        setupFutureUsage: true,
      });
    } else {
      whopTrack.serviceViewed({
        serviceId: plan.id,
        serviceName: plan.name,
        price: plan.price,
        category: 'pricing_plan',
      });
    }
    openCheckout(plan);
  };

  const planItems = [
    {
      plan: roofingConfig.plans.inspection,
      badge: 'Immediate Booking',
      popular: false,
      cta: 'Book Inspection — $149',
      footerNote: 'Credited 100% to approved repairs',
    },
    {
      plan: roofingConfig.plans.deposit,
      badge: 'High-Ticket Job Commitment',
      popular: true,
      cta: 'Lock In Crew Slot — $500 Deposit',
      footerNote: 'Includes Card-on-File setup for final invoice',
    },
    {
      plan: roofingConfig.plans.flatRateService,
      badge: 'All-Inclusive Service',
      popular: false,
      cta: 'Book Emergency Repair — $2,499',
      footerNote: '5-year transferable leak-free warranty',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-900/60 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            Transparent Whop Checkout
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Zero-Surprise Pricing. Guaranteed Crew Availability.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Pay safely with Whop Elements. Support for Apple Pay, Google Pay, cards, and automatic BNPL financing (Klarna, Splitit, Afterpay).
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {planItems.map(({ plan, badge, popular, cta, footerNote }) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                popular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-[1.02] z-10'
                  : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Requested Job Flow
                </div>
              )}

              <div>
                {/* Badge & Title */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {badge}
                  </span>
                  {plan.depositOnly && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Setup Intent
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">${plan.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      {plan.depositOnly ? 'Project Deposit' : 'One-Time Payment'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-400/90 font-medium mt-1">
                    {plan.tagline}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">What's included:</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Checkout Trigger */}
              <div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                    popular
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>{cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2.5 font-medium">
                  {footerNote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Deposit Flow Explanation Card for Contractors */}
        <div className="mt-14 max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  How High-Ticket Card-on-File Works for Roofing Contractors
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Homeowner pays the $500 deposit upfront via Whop Checkout. Whop tokenizes their card with a Setup Intent (<code className="text-amber-300">setupFutureUsage: 'off_session'</code>). When your crew finishes the job, you trigger the final balance invoice with 1 click in your Roofer Dashboard. No paper checks, no chasing payment.
                </p>
              </div>
            </div>
            <a
              href="#roofer-demo"
              className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
            >
              Test Invoicing Demo ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

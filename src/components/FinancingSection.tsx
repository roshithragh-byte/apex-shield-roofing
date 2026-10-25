import React, { useState } from 'react';
import { roofingConfig } from '../../roofing.config';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, DollarSign, Percent, Zap } from 'lucide-react';

export const FinancingSection: React.FC = () => {
  const [estimatedCost, setEstimatedCost] = useState(12000);

  // Simple monthly estimate calculation for 60 months with promotional 0% or low APR
  const estimatedMonthly = Math.round(estimatedCost / 60);

  return (
    <section id="financing" className="py-24 bg-slate-900/40 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Explainer */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" /> 0% APR Available for 12 Months
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Roof Now, Pay Over Time. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                Automatic Point-of-Sale Financing.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Replacing a roof is one of the largest unexpected investments a homeowner faces. Instead of complex paper loan applications, our checkout is powered by <strong className="text-white">Whop Payments</strong>, automatically unlocking flexible installment plans at checkout.
            </p>

            {/* Supported Payment Logos / Pills */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Supported Point-of-Sale Providers:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {roofingConfig.financing.supportedProviders.map((provider) => (
                  <span
                    key={provider}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                    <span>{provider}</span>
                  </span>
                ))}
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs flex items-center gap-1.5">
                  <span>Apple Pay</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs flex items-center gap-1.5">
                  <span>Google Pay</span>
                </span>
              </div>
            </div>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Instant soft credit check with zero impact on score',
                'No prepayment penalties or hidden broker fees',
                'Fast 30-second digital approval at checkout',
                '100% covered under Apex Craftsmanship Warranty'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Monthly Calculator */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Payment Estimator
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  0% APR Promo Eligible
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                Estimate Your Monthly Investment
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Slide to match your estimated roof replacement or major structural restoration scope.
              </p>

              {/* Slider Display */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 mb-6 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Project Scope</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  ${estimatedCost.toLocaleString()}
                </div>
                <input
                  type="range"
                  min="2500"
                  max="35000"
                  step="500"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full mt-4 accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>$2,500</span>
                  <span>$18,000</span>
                  <span>$35,000</span>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 mb-6">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300">Estimated Monthly Payment</span>
                  <div className="text-2xl font-black text-amber-400">
                    ${estimatedMonthly}<span className="text-xs font-medium text-slate-400">/mo*</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  *Based on 60-month term on approved credit. Financing automatically surfaces via Whop Payment Elements during checkout.
                </p>
              </div>

              <a
                href="#pricing"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Select a Plan & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { Sparkles, CreditCard, Lock, ArrowRight, RotateCcw, Droplets } from 'lucide-react';
import { whopTrack } from '../utils/tracking';

/**
 * Animated SVG Checkmark matching the SVGator Liquid Glass template:
 * Outer circle draws clockwise (circumference ~71), followed by inner checkmark path (length ~19).
 */
export const AnimatedLiquidCheck: React.FC<{ active: boolean; delayMs: number }> = ({ active, delayMs }) => {
  return (
    <svg
      className="w-5 h-5 shrink-0 overflow-visible"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer animated circle */}
      <circle
        cx="13"
        cy="13"
        r="11.15"
        stroke="#f59e0b"
        strokeWidth="1.8"
        fill="rgba(245, 158, 11, 0.08)"
        style={{
          strokeDasharray: 71,
          strokeDashoffset: active ? 0 : 71,
          transition: `stroke-dashoffset 0.65s cubic-bezier(0.25, 1, 0.5, 1) ${delayMs}ms`,
        }}
      />
      {/* Inner animated checkmark tick */}
      <path
        d="M8 13.2l3.4 3.4 6.8-6.8"
        stroke="#fbbf24"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 19,
          strokeDashoffset: active ? 0 : 19,
          transition: `stroke-dashoffset 0.45s cubic-bezier(0.25, 1, 0.5, 1) ${delayMs + 220}ms`,
        }}
      />
    </svg>
  );
};

/**
 * Animated price counter synchronized with the liquid glass card spring entrance.
 */
export const AnimatedPrice: React.FC<{ target: number; active: boolean; delayMs: number; prefix?: string }> = ({
  target,
  active,
  delayMs,
  prefix = '$',
}) => {
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    if (!active) {
      setDisplayValue(0);
      return;
    }

    const timer = setTimeout(() => {
      let startTimestamp: number | null = null;
      const duration = 900;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(target);
        }
      };

      setDisplayValue(0);
      requestAnimationFrame(step);
    }, delayMs + 180);

    return () => clearTimeout(timer);
  }, [active, target, delayMs]);

  return (
    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight animate-price-glow">
      {prefix}{displayValue.toLocaleString()}
    </span>
  );
};

export const Plans: React.FC = () => {
  const { openCheckout } = usePitchDemo();
  const [animationKey, setAnimationKey] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Trigger animations on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleReplay = () => {
    setIsSectionVisible(false);
    setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
      setIsSectionVisible(true);
    }, 60);
  };

  const handlePlanSelect = (
    plan:
      | typeof roofingConfig.plans.inspection
      | typeof roofingConfig.plans.deposit
      | typeof roofingConfig.plans.flatRateService
  ) => {
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
      delayMs: 0,
      featured: false,
    },
    {
      plan: roofingConfig.plans.deposit,
      badge: 'High-Ticket Job Commitment',
      popular: true,
      cta: 'Lock In Crew Slot — $500 Deposit',
      footerNote: 'Includes Card-on-File setup for final invoice',
      delayMs: 350,
      featured: true,
    },
    {
      plan: roofingConfig.plans.flatRateService,
      badge: 'All-Inclusive Service',
      popular: false,
      cta: 'Book Emergency Repair — $2,499',
      footerNote: '5-year transferable leak-free warranty',
      delayMs: 700,
      featured: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 bg-slate-950 border-b border-slate-900 relative overflow-hidden"
    >
      {/* Liquid Glass Background - Fluid artwork with optical refraction blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none scale-105"
        style={{ backgroundImage: "url('/images/liquid-glass-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/85 to-slate-950 pointer-events-none" />

      {/* Floating Liquid Glow Blobs (matches SVGator organic liquid aesthetics) */}
      <div className="absolute top-1/4 left-1/12 w-[34rem] h-[34rem] bg-amber-500/12 rounded-full blur-3xl animate-liquid-blob-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-[38rem] h-[38rem] bg-orange-600/10 rounded-full blur-3xl animate-liquid-blob-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>Liquid Glass Pricing • Whop Elements</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Zero-Surprise Pricing. Guaranteed Crew Availability.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 leading-relaxed">
            Pay safely with Whop Payment Elements. Apple Pay, Google Pay, cards, and automatic BNPL financing (Klarna, Splitit, Afterpay) with card-on-file vaulting.
          </p>

          {/* Interactive Animation Control Pill */}
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-xl transition-all shadow-md active:scale-95 cursor-pointer"
              title="Replay Liquid Glass spring entrance and animated checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Replay Price Animation</span>
            </button>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Inspired by SVGator Liquid Glass
            </span>
          </div>
        </div>

        {/* 3-Plan Liquid Glass Pricing Cards Grid - Extra top padding so floating badge is never cut off */}
        <div
          key={animationKey}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-8 sm:pt-10"
        >
          {planItems.map(({ plan, badge, popular, cta, footerNote, delayMs, featured }) => (
            <div
              key={plan.id}
              className={`rounded-[32px] sm:rounded-[38px] p-7 sm:p-8 flex flex-col justify-between relative transition-all ${
                featured ? 'liquid-glass-card-featured' : 'liquid-glass-card'
              } ${isSectionVisible ? 'animate-liquid-spring' : 'opacity-0 scale-75'}`}
              style={{
                animationDelay: `${delayMs}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Inner wrapper clipping the sheen highlight to card radius without clipping the top badge */}
              <div className="absolute inset-0 rounded-[32px] sm:rounded-[38px] overflow-hidden pointer-events-none">
                <div className="liquid-sheen-highlight" />
              </div>

              {/* Popular Job Flow Floating Pill - Fully visible outside the card */}
              {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/35 flex items-center gap-1.5 z-30 whitespace-nowrap border border-amber-300/60">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Most Requested Job Flow</span>
                </div>
              )}

              <div>
                {/* Header: Badge & Setup Intent Indicator */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                    {badge}
                  </span>
                  {plan.depositOnly && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1 backdrop-blur-md whitespace-nowrap shrink-0">
                      <Lock className="w-3 h-3" /> Setup Intent
                    </span>
                  )}
                </div>

                {/* Symmetrically aligned title container */}
                <div className="min-h-[58px] sm:min-h-[66px] flex items-center mb-2.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {plan.name}
                  </h3>
                </div>

                {/* Symmetrically aligned description container */}
                <div className="min-h-[60px] sm:min-h-[70px] mb-6">
                  <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Animated Liquid Glass Price Container */}
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-xl relative overflow-hidden group shadow-inner min-h-[96px] flex flex-col justify-center">
                  {/* Subtle inner reflection highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  
                  <div className="flex items-baseline gap-2.5">
                    <AnimatedPrice
                      target={plan.price}
                      active={isSectionVisible}
                      delayMs={delayMs}
                    />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      {plan.depositOnly ? 'Project Deposit' : 'One-Time Payment'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400/95 font-semibold mt-1.5 flex items-center gap-1">
                    <span>•</span>
                    <span>{plan.tagline}</span>
                  </p>
                </div>

                {/* Animated Checkmark Feature List */}
                <div className="space-y-3 mb-8 min-h-[175px]">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    What's included:
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <AnimatedLiquidCheck
                          active={isSectionVisible}
                          delayMs={delayMs + 400 + idx * 90}
                        />
                        <span className="leading-tight pt-0.5">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Checkout Trigger CTA Button */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 cursor-pointer relative overflow-hidden ${
                    popular
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 border border-amber-300/40'
                      : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 backdrop-blur-xl hover:border-white/40'
                  }`}
                >
                  <span>{cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2.5 font-medium">
                  {footerNote}
                </p>
                <div className="text-center mt-2">
                  <a
                    href={`/checkout?plan=${
                      plan.id === roofingConfig.plans.inspection.id
                        ? 'inspection'
                        : plan.id === roofingConfig.plans.deposit.id
                        ? 'deposit'
                        : 'service'
                    }`}
                    className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <span>Or open dedicated checkout page</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Competitor Parity Deposit Note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Deposit flow: pay the $500 deposit → we do the job → the final balance is billed with a Whop invoice (auto-charged to your saved card, or emailed as a pay link).{' '}
          <a href="/invoice-demo" className="text-amber-400 hover:text-amber-300 underline font-bold">
            See the live Whop invoice demo →
          </a>
        </p>

        {/* Deposit Flow Explanation Card for Contractors */}
        <div className="mt-12 max-w-4xl mx-auto p-7 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1.5">
                  How High-Ticket Card-on-File Works for Roofing Contractors
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Homeowner pays the $500 deposit upfront via Whop Checkout. Whop tokenizes their card with a Setup Intent (<code className="text-amber-300 font-mono text-xs">setupFutureUsage: 'off_session'</code>). When your crew finishes the job, you trigger the final balance invoice with 1 click in your Roofer Dashboard. No paper checks, no chasing payment.
                </p>
              </div>
            </div>
            <a
              href="/invoice-demo"
              className="whitespace-nowrap px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <span>Test Invoicing Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { Wrench, Home, Camera, ArrowRight, RotateCcw, Droplets, CreditCard, Sparkles } from 'lucide-react';
import { whopTrack } from '../utils/tracking';
import { AnimatedLiquidCheck, AnimatedPrice } from './Plans';

export const Services: React.FC = () => {
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

  const services = [
    {
      id: 'srv_replacement',
      title: 'Full Roof Replacement',
      category: 'Residential & Commercial',
      badge: '25-Yr Golden Pledge Warranty',
      description: 'Complete tear-off, high-performance synthetic underlayment, ice/water barrier installation, and lifetime architectural shingles or standing-seam metal.',
      icon: Home,
      startingPrice: 8500,
      financingMonthly: 189,
      delayMs: 0,
      featured: false,
      topPill: null,
      highlights: [
        'GAF Timberline HDZ® Lifetime Shingles',
        'Standing seam 24-gauge metal options',
        'Full 6-point ventilation upgrade included',
        '100% lien waiver provided on completion',
      ],
      ctaText: 'Lock In Project Deposit ($500)',
      onCta: () => {
        whopTrack.serviceViewed({
          serviceId: roofingConfig.plans.deposit.id,
          serviceName: roofingConfig.plans.deposit.name,
          price: roofingConfig.plans.deposit.price,
          category: 'replacement',
        });
        openCheckout(roofingConfig.plans.deposit);
      },
    },
    {
      id: 'srv_repair',
      title: 'Emergency Repair & Leak Stop',
      category: 'Same-Week Dispatch',
      badge: '5-Year No-Leak Warranty',
      description: 'Rapid diagnostic and permanent structural repair for active storm damage, failing valley metal, chimney flashing, pipe boots, and missing shingles.',
      icon: Wrench,
      startingPrice: 750,
      financingMonthly: 89,
      delayMs: 350,
      featured: true,
      topPill: 'Rapid Emergency Dispatch',
      highlights: [
        'Same-day emergency dispatch available',
        'Custom sheet metal flashing fabricated on-site',
        'Attic moisture penetration inspection',
        'Transferable 5-year workmanship warranty',
      ],
      ctaText: 'Book Flat-Rate Leak Seal ($2,499)',
      onCta: () => {
        whopTrack.serviceViewed({
          serviceId: roofingConfig.plans.flatRateService.id,
          serviceName: roofingConfig.plans.flatRateService.name,
          price: roofingConfig.plans.flatRateService.price,
          category: 'repair',
        });
        openCheckout(roofingConfig.plans.flatRateService);
      },
    },
    {
      id: 'srv_inspection',
      title: '32-Point Drone & Hazard Audit',
      category: 'Diagnostic & Insurance',
      badge: '100% Credited to Repairs',
      description: 'Ultra-high-definition 4K aerial drone mapping and thermal camera attic scan. Includes certified documentation formatted for insurance adjuster approval.',
      icon: Camera,
      startingPrice: 149,
      financingMonthly: null,
      delayMs: 700,
      featured: false,
      topPill: null,
      highlights: [
        'Full high-res aerial photographic mosaic',
        'Hail impact diameter measurement',
        'Structural decking & ventilation review',
        'Fee 100% credited toward any future work',
      ],
      ctaText: 'Book Drone Inspection ($149)',
      onCta: () => {
        whopTrack.serviceViewed({
          serviceId: roofingConfig.plans.inspection.id,
          serviceName: roofingConfig.plans.inspection.name,
          price: roofingConfig.plans.inspection.price,
          category: 'inspection',
        });
        openCheckout(roofingConfig.plans.inspection);
      },
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 bg-slate-950 border-b border-slate-900 relative overflow-hidden"
    >
      {/* Liquid Glass Background - Fluid artwork with optical refraction blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none scale-105"
        style={{ backgroundImage: "url('/images/liquid-glass-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/85 to-slate-950 pointer-events-none" />

      {/* Floating Liquid Glow Blobs (matches SVGator organic liquid aesthetics) */}
      <div className="absolute top-1/4 right-1/12 w-[34rem] h-[34rem] bg-amber-500/12 rounded-full blur-3xl animate-liquid-blob-1 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/12 w-[38rem] h-[38rem] bg-orange-600/10 rounded-full blur-3xl animate-liquid-blob-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>High-Performance Systems • Liquid Glass</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Master-Level Craftsmanship. Backed by Seamless Whop Payments.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 leading-relaxed">
            We don't do high-pressure sales calls or vague estimates. Every service has clear pricing, verified scopes of work, and flexible financing.
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
              <span>Replay Service Animation</span>
            </button>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Symmetrically Aligned with Price Plans
            </span>
          </div>
        </div>

        {/* 3-Service Liquid Glass Cards Grid - Extra top padding so floating badges never clip */}
        <div
          key={animationKey}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-8 sm:pt-10"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`rounded-[32px] sm:rounded-[38px] p-7 sm:p-8 flex flex-col justify-between relative transition-all ${
                  service.featured ? 'liquid-glass-card-featured' : 'liquid-glass-card'
                } ${isSectionVisible ? 'animate-liquid-spring' : 'opacity-0 scale-75'}`}
                style={{
                  animationDelay: `${service.delayMs}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Inner wrapper clipping the sheen highlight to card radius */}
                <div className="absolute inset-0 rounded-[32px] sm:rounded-[38px] overflow-hidden pointer-events-none">
                  <div className="liquid-sheen-highlight" />
                </div>

                {/* Optional Top Floating Pill for Featured Service */}
                {service.topPill && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/35 flex items-center gap-1.5 z-30 whitespace-nowrap border border-amber-300/60">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{service.topPill}</span>
                  </div>
                )}

                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                      {service.category}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0">
                      {service.badge}
                    </span>
                  </div>

                  {/* Icon & Title Container - Symmetrically aligned */}
                  <div className="flex items-center gap-3.5 mb-3 min-h-[58px] sm:min-h-[66px]">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* Symmetrically aligned description container */}
                  <div className="min-h-[60px] sm:min-h-[70px] mb-6">
                    <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Animated Liquid Glass Pricing & Financing Container */}
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-xl relative overflow-hidden group shadow-inner min-h-[96px] flex flex-col justify-center">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Starting from
                      </span>
                      <AnimatedPrice
                        target={service.startingPrice}
                        active={isSectionVisible}
                        delayMs={service.delayMs}
                      />
                    </div>

                    {service.financingMonthly ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 pt-1.5 border-t border-white/10">
                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                        <span>As low as ${service.financingMonthly}/mo with Whop Financing</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400 font-semibold pt-1.5 border-t border-white/10">
                        ✓ 100% applied toward future repair or replacement
                      </div>
                    )}
                  </div>

                  {/* Animated Checkmark Highlights List */}
                  <div className="space-y-3 mb-8 min-h-[140px]">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Service Highlights:
                    </p>
                    <ul className="space-y-2.5">
                      {service.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                          <AnimatedLiquidCheck
                            active={isSectionVisible}
                            delayMs={service.delayMs + 400 + idx * 90}
                          />
                          <span className="leading-tight pt-0.5">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Service Action Button */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={service.onCta}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 cursor-pointer relative overflow-hidden ${
                      service.featured
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 border border-amber-300/40'
                        : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 backdrop-blur-xl hover:border-white/40'
                    }`}
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2.5 font-medium">
                    Backed by certified Whop digital agreement & receipt
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

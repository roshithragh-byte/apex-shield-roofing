import React from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { Wrench, Home, Camera, Check, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { whopTrack } from '../utils/tracking';

export const Services: React.FC = () => {
  const { openCheckout } = usePitchDemo();

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
      }
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
      }
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
      }
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            High-Performance Systems
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Master-Level Craftsmanship. Backed by Seamless Whop Payments.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We don't do high-pressure sales calls or vague estimates. Every service has clear pricing, verified scopes of work, and flexible financing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-7 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-amber-500/5 group"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      {service.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Pricing & Financing Callout */}
                  <div className="mb-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-slate-400 font-medium">Starting from</span>
                      <span className="text-xl font-extrabold text-white">
                        ${service.startingPrice.toLocaleString()}
                      </span>
                    </div>

                    {service.financingMonthly ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 pt-1 border-t border-slate-800/80">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>As low as ${service.financingMonthly}/mo with Whop Financing</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800/80">
                        ✓ 100% applied toward future repair or replacement
                      </div>
                    )}
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2.5 mb-8">
                    {service.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service Action Button */}
                <button
                  type="button"
                  onClick={service.onCta}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-slate-950 shadow-md"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

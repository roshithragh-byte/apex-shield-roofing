import React from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { ZipChecker } from './ZipChecker';
import { ShieldCheck, Star, Calendar, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { whopTrack } from '../utils/tracking';

export const Hero: React.FC = () => {
  const { openCheckout } = usePitchDemo();

  const handleInspectionClick = () => {
    whopTrack.serviceViewed({
      serviceId: roofingConfig.plans.inspection.id,
      serviceName: roofingConfig.plans.inspection.name,
      price: roofingConfig.plans.inspection.price,
      category: 'inspection',
    });
    openCheckout(roofingConfig.plans.inspection);
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-900">
      {/* Background Glows & Texture */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-6 shadow-sm">
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{roofingConfig.company.rating} Rating ({roofingConfig.company.reviewCount} Verified Reviews)</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">{roofingConfig.company.serviceArea.metroDescription}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Guaranteed 25-Year Roofs. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Zero Payment Friction.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Austin’s top-rated residential and commercial roofing contractor. Book 4K drone inspections online, lock in scheduled repair dates with Apple Pay, and access instant monthly financing via <span className="font-semibold text-white">Whop Payments</span>.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#estimate-funnel"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Request Free Estimate</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              type="button"
              onClick={handleInspectionClick}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700 hover:border-amber-500/50 transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Book Drone Inspection ($149)</span>
            </button>
          </div>

          {/* Zip Code Availability Checker Tool */}
          <ZipChecker />
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-16 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {roofingConfig.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="w-6 h-6 text-amber-500 mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">{badge.name}</h4>
              <p className="text-xs text-slate-400 leading-snug">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { Phone, Shield, Wrench, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { pitchMode, togglePitchMode } = usePitchDemo();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800 transition-all">
      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
        </span>
        <span className="tracking-wide uppercase font-extrabold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Active Hail & Leak Storm Alert — Greater Austin Crews On Standby
        </span>
        <span className="hidden md:inline font-medium text-slate-900">| Call Now for 60-Minute Tarping Dispatch</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {roofingConfig.company.name.split(' ')[0]}
              </span>
              <span className="font-bold text-xl text-amber-500">
                {roofingConfig.company.name.split(' ').slice(1, 3).join(' ')}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <span>{roofingConfig.company.licenseNumber}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">★ {roofingConfig.company.rating} ({roofingConfig.company.reviewCount} Reviews)</span>
            </p>
          </div>
        </a>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300">
          <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">Plans & Booking</a>
          <a href="#financing" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            Financing <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">0% APR</span>
          </a>
          <a href="#service-area" className="hover:text-amber-400 transition-colors">Service Area</a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
        </nav>

        {/* Action Controls & Mode Switch */}
        <div className="flex items-center gap-3">
          {/* Pitch Mode Toggle Pill */}
          <button
            onClick={togglePitchMode}
            title="Toggle between Homeowner perspective and Contractor Invoicing Demo"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              pitchMode === 'contractor'
                ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-md shadow-purple-900/30'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Mode:</span>
            <span className={pitchMode === 'contractor' ? 'text-purple-200 uppercase' : 'text-slate-400 uppercase'}>
              {pitchMode === 'contractor' ? 'Contractor Demo' : 'Homeowner'}
            </span>
          </button>

          {/* Click to Call */}
          <a
            href={roofingConfig.company.phone}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>{roofingConfig.company.formattedPhone}</span>
          </a>

          {/* Primary CTA */}
          <a
            href="#estimate-funnel"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Instant Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};

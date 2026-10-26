import React, { useState } from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import {
  Phone,
  Shield,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { pitchMode, togglePitchMode } = usePitchDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Plans & Pricing', href: '/#pricing' },
    { label: 'Financing', href: '/#financing' },
    { label: 'Invoice Demo', href: '/invoice-demo' },
    { label: 'Get Estimate', href: '/estimate' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all duration-200">
      {/* Slim Emergency Alert Strip */}
      {!alertDismissed && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 border-b border-amber-500/30 text-amber-200 text-[11px] font-medium py-1 px-4 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 truncate text-center flex-1">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold tracking-wide uppercase text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 text-amber-400" />
              Storm Alert:
            </span>
            <span className="truncate text-slate-300">
              Active hail & leak response crews on 60-min standby across Greater Austin.
            </span>
          </div>
          <button
            onClick={() => setAlertDismissed(true)}
            aria-label="Dismiss storm alert"
            className="text-amber-400/70 hover:text-amber-300 p-0.5 ml-2 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar Bar (Clean, De-congested 64px Height) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <a
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors leading-none">
                Apex Shield
              </span>
              <span className="text-amber-500 text-xs font-bold leading-none">Roofing</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">
              Austin, TX • Lic #{roofingConfig.company.licenseNumber.split(' ')[0]}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & Mode Switch */}
        <div className="flex items-center gap-2.5">
          {/* Pitch Mode Toggle Pill (Sleek Contractor Switch) */}
          <button
            onClick={togglePitchMode}
            title={
              pitchMode === 'contractor'
                ? 'Contractor Back-Office Mode Active. Click to switch to Homeowner View.'
                : 'Switch to Contractor Pitch Mode to demo leads, vault & invoices.'
            }
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              pitchMode === 'contractor'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-mono text-[11px]">
              {pitchMode === 'contractor' ? 'Roofer HUD: ON' : 'Pitch Demo'}
            </span>
          </button>

          {/* Click to Call */}
          <a
            href={roofingConfig.company.phone}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-xs">{roofingConfig.company.formattedPhone}</span>
          </a>

          {/* Primary CTA Button */}
          <a
            href="/estimate"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-fade-in backdrop-blur-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <a
              href={roofingConfig.company.phone}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-900 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call 24/7: {roofingConfig.company.formattedPhone}</span>
            </a>

            <button
              onClick={() => {
                togglePitchMode();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-slate-900/60 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-800/60"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {pitchMode === 'contractor' ? 'Active Mode: Contractor' : 'Switch to Contractor Pitch Mode'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

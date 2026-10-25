import React from 'react';
import { roofingConfig } from '../../roofing.config';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Top emergency callout */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                24/7 Emergency Storm Damage & Tarping Response
              </p>
              <p className="text-xs text-slate-400">
                Active leak in the Austin Metroplex? Our rapid-response crews dispatch within 60 minutes.
              </p>
            </div>
          </div>
          <a
            href={roofingConfig.company.phone}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Call {roofingConfig.company.formattedPhone}</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                <Shield className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-none">
                  {roofingConfig.company.name}
                </span>
                <span className="text-xs text-amber-400 font-medium">
                  {roofingConfig.company.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Premier roofing contractor serving Central Texas residential and commercial property owners. Fully licensed, bonded, and backed by a 50-year non-prorated manufacturer warranty and guaranteed card-on-file deposit security via Whop.
            </p>

            <div className="space-y-1 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{roofingConfig.serviceArea.metroDescription}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{roofingConfig.company.formattedPhone} (24/7 Hotline)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{roofingConfig.company.email}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Architectural Shingle Replacement
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Standing Seam Metal Roofing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Emergency Leak Tarping & Repair
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Infrared Drone Inspection ($149)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Hail & Storm Claim Assistance
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Commercial Flat / TPO Membrane
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Central Texas Service Area
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">{roofingConfig.serviceArea.primaryCity}, {roofingConfig.serviceArea.state} Metroplex</p>
              <div className="flex flex-wrap gap-1 text-[11px] text-amber-400 font-mono">
                {roofingConfig.serviceArea.coveredZipCodes.slice(0, 10).map((zip) => (
                  <span key={zip} className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                    {zip}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Emergency dispatch stationed across Travis and Williamson counties.
              </p>
            </div>
          </div>

          {/* Col 4: Whop Powered Financing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Whop Payments & BNPL
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All transactions, inspection deposits, and milestone invoices are powered securely by Whop Elements.
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Flexible Terms
              </span>
              <p className="text-[11px] text-slate-300">
                0% APR financing available through Klarna, Splitit, and Afterpay directly at Whop checkout.
              </p>
            </div>
            <p className="text-[10px] text-slate-400">
              License #{roofingConfig.company.licenseNumber} • Bonded & Insured $2,000,000 Aggregate
            </p>
          </div>
        </div>

        {/* Bottom copyright & Template Notice */}
        <div className="mt-12 pt-6 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {roofingConfig.company.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Whop Websites Template</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Config: roofing.config.ts</span>
            <span>•</span>
            <span>256-bit SSL Whop Elements</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

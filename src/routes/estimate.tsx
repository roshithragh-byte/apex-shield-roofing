import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { createWhopLead } from '../utils/whopClient';
import { whopTrack } from '../utils/tracking';
import { roofingConfig } from '../../roofing.config';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  FileText
} from 'lucide-react';

export const Route = createFileRoute('/estimate')({
  component: EstimatePage,
});

function EstimatePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Full Roof Replacement',
    address: '',
    zipCode: '78701',
    roofMaterial: 'Architectural Shingle',
    urgency: 'Standard (Within 1-2 Weeks)',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadResult, setLeadResult] = useState<{ leadId: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await createWhopLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        zipCode: formData.zipCode,
        roofMaterial: formData.roofMaterial,
        urgency: formData.urgency,
        notes: formData.notes,
      });

      // Fire custom Whop pixel event
      whopTrack.estimateRequested({
        name: formData.name,
        zipCode: formData.zipCode,
        roofMaterial: formData.roofMaterial,
        urgency: formData.urgency,
      });

      setLeadResult({
        leadId: result.leadId,
        message: result.message,
      });
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not submit your estimate request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Whop Leads API • Free On-Site Diagnostic</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Request Your Free Roof Estimate
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Austin, Texas homeowners: submit your property details below. Quote requests land directly in our Whop account CRM, and our master crew responds within 60 minutes.
            </p>
          </div>

          {leadResult ? (
            /* Success State */
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Estimate Request Received — Thank you, {formData.name.split(' ')[0]}!
                </h2>
                <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
                  Your project data was transmitted directly into our Whop account CRM under Lead ID:
                </p>
                <div className="inline-block py-2 px-4 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-sm font-bold shadow-inner">
                  {leadResult.leadId}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Target Service:</span>
                  <span className="font-semibold text-white">{formData.service}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Callback Phone:</span>
                  <span className="font-semibold text-white">{formData.phone || 'Provided via form'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pixel Verification:</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> whop.track("estimate_requested") fired
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/checkout"
                  search={{ plan: 'deposit' }}
                  className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Lock In Crew Slot ($500 Deposit)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/"
                  className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-sm transition-colors flex items-center justify-center"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            /* Estimate Form */
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. marcus@austin-properties.com"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(512) 555-0198"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Desired Roofing Service *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="Full Roof Replacement">Full Architectural Roof Replacement</option>
                      <option value="Standing Seam Metal Roof">Standing Seam Metal Roof System</option>
                      <option value="Emergency Leak Stop ($2,499)">Emergency Leak Stop ($2,499 Flat-Rate)</option>
                      <option value="32-Point Drone Inspection ($149)">32-Point Drone Inspection ($149)</option>
                      <option value="Hail & Wind Storm Damage Audit">Hail & Wind Storm Damage Audit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Austin Metro Property Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 2408 Barton Springs Rd"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="78701"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Project Notes / Symptoms (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Active drip in master bedroom? Hail impacts on gutters? Age of existing shingles?"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Lead to Whop CRM...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request My Free Estimate (Whop Leads API)</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 leading-relaxed">
                  Submitting securely dispatches a lead to the Apex Shield Whop account (Leads API). No credit card required for estimate requests.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

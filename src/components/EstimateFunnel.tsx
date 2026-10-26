import React, { useState } from 'react';
import { roofingConfig } from '../../roofing.config';
import { usePitchDemo } from '../context/PitchDemoContext';
import { whopTrack } from '../utils/tracking';
import { createWhopLead } from '../utils/whopClient';
import {
  FileText,
  Shield,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Calendar,
  AlertTriangle,
  Clock,
  Send
} from 'lucide-react';

export const EstimateFunnel: React.FC = () => {
  const { addLead } = usePitchDemo();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);

  // Form Fields
  const [roofMaterial, setRoofMaterial] = useState('Architectural Asphalt Shingles');
  const [urgency, setUrgency] = useState('Active Water Leak / Emergency');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    zipCode: '',
    notes: '',
  });

  const materials = [
    { id: 'asphalt', name: 'Architectural Asphalt Shingles', desc: 'Most popular residential choice with 30-50 year lifespans.' },
    { id: 'metal', name: 'Standing Seam Metal', desc: 'Maximum wind, fire & hail resilience with 50+ year durability.' },
    { id: 'tile', name: 'Spanish / Concrete Tile & Slate', desc: 'Premium architectural aesthetic for custom high-end homes.' },
    { id: 'flat', name: 'Flat / Commercial (TPO / EPDM)', desc: 'Engineered single-ply membrane systems for flat and low-slope roofs.' },
  ];

  const issues = [
    { id: 'leak', name: 'Active Water Leak / Emergency', desc: 'Water entering the home; needs immediate priority dispatch.' },
    { id: 'storm', name: 'Recent Storm / Hail Damage', desc: 'Visible shingle impact or neighbor claims; needs insurance audit.' },
    { id: 'replacement', name: 'Aging Roof (15+ Years) Replacement', desc: 'Curling shingles, granule loss, or planning home sale.' },
    { id: 'inspection', name: 'Comprehensive Inspection Only', desc: 'Buying/selling home or annual preventative roof audit.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setLoading(true);

    // 1. Submit lead to Whop Leads API
    const leadResult = await createWhopLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      zipCode: formData.zipCode || '78701',
      roofMaterial,
      urgency,
      notes: formData.notes,
    });

    // 2. Add lead to shared PitchDemoContext
    const registeredLead = addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      zipCode: formData.zipCode || '78701',
      roofMaterial,
      urgency,
      notes: formData.notes,
    });

    // 3. Fire custom whop.track event
    whopTrack.estimateRequested({
      roofMaterial,
      urgency,
      zipCode: formData.zipCode || '78701',
      name: formData.name,
    });

    setCreatedLeadId(leadResult.leadId || registeredLead.id);
    setLoading(false);
    setStep(4);
  };

  return (
    <section id="estimate-funnel" className="py-24 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            Whop Leads API Integration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Request an Accurate Roofing Estimate
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Take 60 seconds to tell us about your property. Your request syncs directly to our dispatcher on Whop.
          </p>

          {/* Step Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                        : step > s
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${step === s ? 'text-white' : 'text-slate-500'}`}>
                    {s === 1 ? 'Roof Type' : s === 2 ? 'Damage / Issue' : 'Contact & Address'}
                  </span>
                  {s < 3 && <div className="w-8 h-[2px] bg-slate-800 hidden sm:block" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Funnel Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* STEP 1: Roof Material Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2">
                Step 1: Select your property's roofing material
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {materials.map((mat) => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setRoofMaterial(mat.name)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      roofMaterial === mat.name
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{mat.name}</span>
                      {roofMaterial === mat.name && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{mat.desc}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Next: Detail Issues</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Issue & Urgency Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2">
                Step 2: What is the primary issue or service required?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {issues.map((iss) => (
                  <button
                    key={iss.id}
                    type="button"
                    onClick={() => setUrgency(iss.name)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      urgency === iss.name
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{iss.name}</span>
                      {urgency === iss.name && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{iss.desc}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Next: Contact Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Contact Info Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-1">
                Step 3: Where should we send the estimate report?
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Submitting this form dispatches directly to the roofer account via the <strong className="text-amber-400">Whop Leads API</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Homeowner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John & Sarah Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number (for dispatch SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(512) 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Property Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 Barton Springs Rd"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="78704"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Damage Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe leaks, missing shingles, or storm date..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Whop Lead...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request to Whop API</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="text-center py-6 animate-fadeIn space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-extrabold text-white">
                Estimate Request Successfully Recorded!
              </h3>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Whop Lead ID:</span>
                  <span className="font-mono text-amber-400 font-bold">{createdLeadId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Property:</span>
                  <span className="text-white font-medium">{formData.address}, {formData.zipCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Material & Urgency:</span>
                  <span className="text-slate-200">{roofMaterial} • {urgency}</span>
                </div>
                <div className="flex justify-between pt-1 text-emerald-400 font-semibold">
                  <span>Tracking Event:</span>
                  <span>whop.track('estimate_requested') ✓</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                An Apex Shield project estimator has received your file. For immediate dispatch assistance, call dispatch directly at <strong className="text-white">(512) 555-ROOF</strong>.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: '', phone: '', email: '', address: '', zipCode: '', notes: '' });
                    setStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Submit Another Estimate
                </button>
                <a
                  href="#pricing"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  View Booking Plans
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

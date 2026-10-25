import React, { useState } from 'react';
import { roofingConfig } from '../../roofing.config';
import { MapPin, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

export const ZipChecker: React.FC = () => {
  const [zipInput, setZipInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'covered' | 'uncovered'>('idle');
  const [testedZip, setTestedZip] = useState('');

  const checkZip = (zip: string) => {
    const cleanZip = zip.trim();
    if (!cleanZip || cleanZip.length !== 5) return;

    setTestedZip(cleanZip);
    const isCovered = roofingConfig.serviceArea.coveredZipCodes.includes(cleanZip);
    setStatus(isCovered ? 'covered' : 'uncovered');
  };

  const handleQuickZip = (zip: string) => {
    setZipInput(zip);
    checkZip(zip);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Check Local Crew Availability By Zip Code
        </h4>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkZip(zipInput);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={5}
            placeholder="Enter your 5-digit zip (e.g. 78746)"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors font-medium"
          />
        </div>
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
        >
          Check
        </button>
      </form>

      {/* Quick Test Buttons for Pitching */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
        <span>Try sample zips:</span>
        {['78746', '78701', '78613', '78759'].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => handleQuickZip(sample)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Feedback State */}
      {status === 'covered' && (
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-white text-sm">
              Confirmed: Priority Service Active in {testedZip}
            </p>
            <p className="text-emerald-300/90">
              We have 2 certified installation crews and a drone estimator dispatched in your area today.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-emerald-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Next Drone Slot: Tomorrow 9:00 AM</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> 60-Min Emergency Tarping Ready</span>
            </div>
          </div>
        </div>
      )}

      {status === 'uncovered' && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-white text-sm">
              Zip Code {testedZip} is Outside Our Standard Core Zone
            </p>
            <p className="text-amber-300/90">
              We frequently service commercial and larger residential projects across Central Texas by appointment. Call dispatch directly at <strong className="text-white">(512) 555-ROOF</strong> for travel scheduling.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

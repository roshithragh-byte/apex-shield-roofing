import React, { useState, useEffect } from 'react';
import { usePitchDemo } from '../context/PitchDemoContext';
import {
  Activity,
  Terminal,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  CheckCircle,
  Code,
  Radio
} from 'lucide-react';

interface EventLog {
  id: string;
  eventName: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const EventInspector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<EventLog[]>([
    {
      id: 'evt_init_1',
      eventName: 'page_viewed',
      payload: { path: '/', template: 'roofing_us_template_v1' },
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    const handleCustomTrack = (e: Event) => {
      const customEvent = e as CustomEvent<{
        eventName: string;
        payload: Record<string, unknown>;
        timestamp: string;
      }>;

      if (customEvent.detail) {
        setEvents((prev) => [
          {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            eventName: customEvent.detail.eventName,
            payload: customEvent.detail.payload,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 19),
        ]);
      }
    };

    window.addEventListener('whop_custom_track', handleCustomTrack);
    return () => window.removeEventListener('whop_custom_track', handleCustomTrack);
  }, []);

  const clearLogs = () => {
    setEvents([]);
  };

  return (
    <div className="fixed bottom-14 sm:bottom-16 right-4 z-40">
      {/* Floating Pill Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700/80 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono transition-all hover:scale-105 hover:border-amber-500/50"
          title="Open whop.track Live Event Inspector"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-white">whop.track HUD</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-sans font-bold">
            {events.length}
          </span>
        </button>
      )}

      {/* Expanded Inspector Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 max-h-[460px] bg-slate-900/95 border border-slate-750 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in text-xs">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold text-white text-[11px] tracking-wide">
                whop.track Inspector
              </span>
              <span className="text-[10px] text-slate-400">({events.length})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearLogs}
                title="Clear logs"
                className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize inspector"
                className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-header notice */}
          <div className="px-3 py-1.5 bg-slate-850/60 border-b border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Verifying custom analytics events</span>
            <span className="font-mono text-emerald-400">whop.track</span>
          </div>

          {/* Events List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/40">
            {events.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No events recorded yet. Trigger a form or plan view to capture.
              </div>
            ) : (
              events.map((evt) => {
                const isExpanded = expandedEventId === evt.id;
                const isRequiredEvent = [
                  'estimate_requested',
                  'service_viewed',
                  'deposit_started',
                ].includes(evt.eventName);

                return (
                  <div key={evt.id} className="pt-1.5 first:pt-0">
                    <button
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                      className="w-full text-left p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isRequiredEvent ? 'bg-amber-400' : 'bg-slate-400'
                          }`}
                        ></span>
                        <span
                          className={`font-mono text-[11px] truncate ${
                            isRequiredEvent
                              ? 'text-amber-300 font-bold'
                              : 'text-slate-300'
                          }`}
                        >
                          {evt.eventName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px] text-slate-400 font-mono">
                        <span>{evt.timestamp}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </div>
                    </button>

                    {/* Collapsible JSON payload */}
                    {isExpanded && (
                      <div className="mt-1 p-2 bg-black/60 rounded border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-all">
                          {JSON.stringify(evt.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Custom events active
            </span>
            <span className="text-slate-400 font-mono">whop.site / whop.app</span>
          </div>
        </div>
      )}
    </div>
  );
};

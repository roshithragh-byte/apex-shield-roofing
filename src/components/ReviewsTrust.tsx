import React from 'react';
import { roofingConfig } from '../../roofing.config';
import { Star, ShieldCheck, MapPin, Quote, ThumbsUp, Award, CheckCircle2 } from 'lucide-react';

export const ReviewsTrust: React.FC = () => {
  const reviews = [
    {
      author: 'Marcus & Elena Vance',
      neighborhood: 'Westlake Hills, TX',
      project: 'Full Standing Seam Metal Roof Replacement',
      rating: 5,
      date: '2 weeks ago',
      quote: 'We had 4 roofers bid on our home. Three handed us scrawled carbon copies and demanded cashiers checks. Apex sent a 4K drone report, we paid the $500 deposit with Apple Pay on our phone, and the remaining balance was automatically charged when the final inspection cleared. Best contractor experience we’ve ever had.',
    },
    {
      author: 'Robert Sterling',
      neighborhood: 'Barton Hills, Austin',
      project: 'Emergency Leak & Flashing Restoration',
      rating: 5,
      date: 'Last month',
      quote: 'Active water leak dripping through our master bath ceiling during the storm. Apex booked us for the $149 inspection within 2 hours, tarped immediately, and completed the full chimney flashing rebuild the next day. Zero payment hassle.',
    },
    {
      author: 'Jennifer Hollister',
      neighborhood: 'Steiner Ranch, TX',
      project: 'Hail Claim Architectural Shingle Replacement',
      rating: 5,
      date: '3 weeks ago',
      quote: 'The financing options via Whop made a huge difference for our family. Being able to break our deductible into 0% monthly payments without having to sit through a sleazy finance manager pitch was incredible. Crew was clean, on-time, and polite.',
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Verified Customer Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Trusted by Hundreds of Central Texas Property Owners
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Rated {roofingConfig.company.rating} out of 5 stars based on {roofingConfig.company.reviewCount} verified homeowner reviews.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">{rev.date}</span>
                </div>

                <Quote className="w-8 h-8 text-slate-700/60 mb-3" />

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <p className="font-bold text-white text-sm">{rev.author}</p>
                <p className="text-xs text-amber-400/90 font-medium">{rev.neighborhood}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{rev.project}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Service Area Grid */}
        <div id="service-area" className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-white">
                  Austin Metro & Central Texas Service Coverage
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Guaranteed emergency response within 60 minutes for primary service zip codes.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Dispatch Active Today
              </span>
              <span className="text-slate-400">License: {roofingConfig.company.licenseNumber}</span>
            </div>
          </div>

          {/* Zip Code Badges */}
          <div className="flex flex-wrap gap-2">
            {roofingConfig.serviceArea.coveredZipCodes.map((zip) => (
              <span
                key={zip}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono font-medium hover:border-amber-500/50 transition-colors"
              >
                {zip} • {roofingConfig.serviceArea.primaryCity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

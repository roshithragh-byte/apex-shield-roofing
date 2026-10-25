import React from 'react';
import { usePitchDemo } from './context/PitchDemoContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ZipChecker } from './components/ZipChecker';
import { Services } from './components/Services';
import { FinancingSection } from './components/FinancingSection';
import { Plans } from './components/Plans';
import { EstimateFunnel } from './components/EstimateFunnel';
import { ReviewsTrust } from './components/ReviewsTrust';
import { Footer } from './components/Footer';
import { WhopCheckoutModal } from './components/WhopCheckoutModal';
import { RooferPitchBar } from './components/RooferPitchBar';
import { EventInspector } from './components/EventInspector';

export const AppContent: React.FC = () => {
  const { isCheckoutOpen, selectedPlan, closeCheckout } = usePitchDemo();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* Sticky Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Zip Code Quick Check */}
        <section className="relative z-20 -mt-8 max-w-4xl mx-auto px-4 sm:px-6">
          <ZipChecker />
        </section>

        {/* Core Services Section */}
        <Services />

        {/* Financing Callout Section */}
        <FinancingSection />

        {/* Real Whop Plans Section ($149 Inspection, $500 Deposit, $2,499 Flat-Rate) */}
        <Plans />

        {/* Request an Estimate Funnel wired to Whop Leads API */}
        <EstimateFunnel />

        {/* Reviews, Ratings, and Trust Badges */}
        <ReviewsTrust />
      </main>

      {/* Footer */}
      <Footer />

      {/* Whop Elements Modal Checkout */}
      {isCheckoutOpen && selectedPlan && (
        <WhopCheckoutModal
          plan={selectedPlan}
          onClose={closeCheckout}
        />
      )}

      {/* Live whop.track Pixel Event Inspector HUD */}
      <EventInspector />

      {/* Roofer Pitch Simulation Cockpit HUD */}
      <RooferPitchBar />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;

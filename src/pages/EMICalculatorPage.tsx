import React from 'react';
import EMICalculator from '../components/EMICalculator/EMICalculator';
import AdSlot from '../components/AdSlot/AdSlot';

const EMICalculatorPage: React.FC = () => {
  return (
    <>
      {/* Top Banner Ad */}
      <div className="w-full flex justify-center py-2 bg-white/50">
        <AdSlot slotId="top-banner" format="horizontal" label="Top Banner Ad" />
      </div>

      {/* 3-Column Layout: Left Ad | Calculator | Right Ad */}
      <div className="flex justify-center gap-4 px-2">
        {/* Left Sidebar Ads */}
        <aside
          className="hidden 2xl:flex flex-col gap-4 sticky top-4 self-start pt-4"
          aria-label="Advertisements"
        >
          <AdSlot slotId="left-skyscraper-1" format="vertical" label="Left Ad 1" />
          <AdSlot slotId="left-rectangle" format="rectangle" label="Left Ad 2" className="mt-4" />
        </aside>

        {/* Main Calculator Content */}
        <main className="flex-1 max-w-7xl min-w-0">
          <EMICalculator />
        </main>

        {/* Right Sidebar Ads */}
        <aside
          className="hidden 2xl:flex flex-col gap-4 sticky top-4 self-start pt-4"
          aria-label="Advertisements"
        >
          <AdSlot slotId="right-skyscraper-1" format="vertical" label="Right Ad 1" />
          <AdSlot slotId="right-rectangle" format="rectangle" label="Right Ad 2" className="mt-4" />
        </aside>
      </div>
    </>
  );
};

export default EMICalculatorPage;

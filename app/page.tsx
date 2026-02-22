'use client';

import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import HowItWorks from '@/components/HowItWorks';
import SecuritySection from '@/components/SecuritySection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <StatsSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <SecuritySection />
    </main>
  );
}

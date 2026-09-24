import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatIDoSection } from "@/components/WhatIDoSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { MobileWhatsAppCTA } from "@/components/MobileWhatsAppCTA";
import { track } from "@/analytics";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    track("page_view");
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        דלגי לתוכן
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ProblemSection />
        <WhatIDoSection />
        <BeforeAfterSection />
        <HowItWorks />
        <About />
        <FinalCTA />
      </main>
      <Footer />
      <MobileWhatsAppCTA />
    </>
  );
}

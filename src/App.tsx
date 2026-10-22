import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { Statement } from "@/components/Statement";
import { WhatIDoSection } from "@/components/WhatIDoSection";
import { About } from "@/components/About";
import { Outcomes } from "@/components/Outcomes";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/Faq";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { MobileWhatsAppCTA } from "@/components/MobileWhatsAppCTA";
import { ScrollProgress } from "@/components/ScrollProgress";
import { track } from "@/analytics";
import { startScrollFallback } from "@/scrollEffects";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    track("page_view");
    return startScrollFallback();
  }, []);

  return (
    <>
      <ScrollProgress />
      <a className="skip-link" href="#main">
        דילוג לתוכן
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ProblemSection />
        <BeforeAfterSection />
        <Statement />
        <About />
        <Outcomes />
        <WhatIDoSection />
        <HowItWorks />
        <FaqSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileWhatsAppCTA />
    </>
  );
}

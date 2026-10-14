import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PrinciplesStrip } from "@/components/PrinciplesStrip";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatIDoSection } from "@/components/WhatIDoSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { CaseStudies } from "@/components/CaseStudies";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { FaqSection } from "@/components/Faq";
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
        דילוג לתוכן
      </a>
      <Header />
      <main id="main">
        <Hero />
        <PrinciplesStrip />
        <ProblemSection />
        <WhatIDoSection />
        <BeforeAfterSection />
        <CaseStudies />
        <HowItWorks />
        <About />
        <FaqSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileWhatsAppCTA />
    </>
  );
}

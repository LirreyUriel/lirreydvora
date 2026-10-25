import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { About } from "@/components/About";
import { Outcomes } from "@/components/Outcomes";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/Faq";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { MobileWhatsAppCTA } from "@/components/MobileWhatsAppCTA";
import { ScrollProgress } from "@/components/ScrollProgress";
import { trackViewOnce } from "@/analytics";
import { startScrollFallback } from "@/scrollEffects";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    trackViewOnce("page_view");
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
        <Outcomes />
        <HowItWorks />
        <BeforeAfterSection />
        <About />
        <FaqSection />
        <FinalCTA />
      </main>
      <Footer />
      <ConsentBanner />
      <MobileWhatsAppCTA />
    </>
  );
}

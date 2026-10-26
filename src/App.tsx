import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { PresenceBand } from "@/components/PresenceBand";
import { About } from "@/components/About";
import { Outcomes } from "@/components/Outcomes";
import { StorySection } from "@/components/StorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { ProjectsTeaser } from "@/components/ProjectsTeaser";
import { FaqSection } from "@/components/Faq";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { MobileWhatsAppCTA } from "@/components/MobileWhatsAppCTA";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { resolveRoute, routeMeta } from "@/routes";
import { trackViewOnce } from "@/analytics";
import { startScrollFallback } from "@/scrollEffects";
import { useEffect } from "react";

export default function App({ path }: { path: string }) {
  const route = resolveRoute(path);

  useEffect(() => {
    trackViewOnce("page_view");
    return startScrollFallback();
  }, []);

  // ב-build הכותרת כבר נכתבת לכל דף; כאן זה בשביל סביבת הפיתוח.
  useEffect(() => {
    const meta = routeMeta(resolveRoute(path));
    if (meta) document.title = meta.title;
  }, [path]);

  return (
    <>
      <ScrollProgress />
      <a className="skip-link" href="#main">
        דילוג לתוכן
      </a>
      <Header solid={route.kind !== "home"} active={route.kind === "home" ? undefined : "articles"} />
      <main id="main">
        {route.kind === "home" ? (
          <>
            <Hero />
            <Outcomes />
            <StorySection />
            <HowItWorks />
            <ProjectsTeaser />
            <BeforeAfterSection />
            <PresenceBand />
            <About />
            <FaqSection />
            <FinalCTA />
          </>
        ) : route.kind === "articles" ? (
          <ArticlesPage />
        ) : (
          <ArticlePage article={route.article} />
        )}
      </main>
      <Footer />
      <ConsentBanner />
      <MobileWhatsAppCTA />
    </>
  );
}

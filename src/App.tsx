import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { PresenceBand } from "@/components/PresenceBand";
import { About } from "@/components/About";
import { LeadForm } from "@/components/LeadForm";
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
import { trackPageView } from "@/analytics";
import { startScrollFallback } from "@/scrollEffects";
import { useEffect } from "react";

export default function App({ path }: { path: string }) {
  const route = resolveRoute(path);

  useEffect(() => {
    trackPageView(
      route.kind === "article"
        ? { page_type: "article", article_slug: route.article.slug, article_title: route.article.title }
        : { page_type: route.kind === "articles" ? "projects" : "home" },
    );
    return startScrollFallback();
  }, []);

  // כתובת עם עוגן (lirrey.com/#contact) נפתחת על הסקשן. הדפדפן קופץ לבד רק אם הסקשן כבר קיים בטעינה,
  // ותמונות שנטענות מעליו מזיזות אותו, אז קופצים שוב אחרי הרינדור ואחרי שהעמוד נטען.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    // instant: ה-scroll-behavior: smooth של העמוד היה מגלגל את כל הדף מההתחלה.
    const jump = () => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    requestAnimationFrame(jump);
    if (document.readyState === "complete") return;
    window.addEventListener("load", jump, { once: true });
    return () => window.removeEventListener("load", jump);
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
      <Header solid={route.kind !== "home"} active={route.kind === "articles" || route.kind === "article" ? "articles" : undefined} />
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
            <LeadForm />
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

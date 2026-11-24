import { CtaButton } from "@/components/CtaButton";
import { RichText } from "@/components/Ltr";
import { about, aboutPage, cta, howItWorks, outcomes } from "@/content/site";
import { articlePath, articles, articlesPage } from "@/content/articles";

// עמוד אודות נפרד, כדי שלגוגל ולמנועי AI יהיה עמוד אחד שמסביר מי עומדת מאחורי האתר.
export function AboutPage() {
  return (
    <article className="post about-page" aria-labelledby="about-page-title">
      <div className="post__inner">
        <header className="post__header about-page__header">
          <img
            className="about-page__photo"
            src={about.image}
            width={1024}
            height={1024}
            alt={about.imageAlt}
            fetchPriority="high"
          />
          <div>
            <h1 id="about-page-title">{aboutPage.title}</h1>
            <p className="about-page__subtitle">{aboutPage.subtitle}</p>
          </div>
        </header>

        <div className="post__body">
          <section>
            <h2>{aboutPage.storyTitle}</h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </section>

          <section>
            <h2>{aboutPage.expertiseTitle}</h2>
            <ul className="about-page__list">
              {outcomes.pairs.map((pair) => (
                <li key={pair.more}>{pair.more}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{aboutPage.processTitle}</h2>
            <ol className="about-page__list">
              {howItWorks.steps.map((step) => (
                <li key={step.number}>
                  <strong>{step.title}:</strong> {step.text}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <nav className="post__related" aria-labelledby="about-projects-title">
          <h2 id="about-projects-title">{aboutPage.projectsTitle}</h2>
          <ul>
            {articles.slice(0, 4).map((item) => (
              <li key={item.slug}>
                <a href={articlePath(item)}>
                  <RichText text={item.title} />
                </a>
              </li>
            ))}
            <li>
              <a href={articlesPage.path}>{aboutPage.allProjects}</a>
            </li>
          </ul>
        </nav>

        <aside className="post__cta">
          <CtaButton source="about_page">
            <RichText text={cta.talk} />
          </CtaButton>
        </aside>
      </div>
    </article>
  );
}

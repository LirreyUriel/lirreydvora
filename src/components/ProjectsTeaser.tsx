import { GlassBlogCard } from "@/components/ui/glass-blog-card";
import { RichText } from "@/components/Ltr";
import { articlePath, articles, articlesPage, author, projectsTeaser, readTime } from "@/content/articles";

// הזמנה לקרוא על פרויקטים, מעל השאלון: הפרויקטים האחרונים וקישור לכולם.
export function ProjectsTeaser() {
  return (
    <section className="section projects-teaser" id={projectsTeaser.id} aria-labelledby="projects-title">
      <div className="container">
        <p className="eyebrow">{projectsTeaser.eyebrow}</p>
        <h2 id="projects-title">
          <RichText text={projectsTeaser.title} />
        </h2>
        <p className="section__intro">{projectsTeaser.intro}</p>

        <div className="blog__grid projects-teaser__grid">
          {articles.slice(0, projectsTeaser.count).map((article) => (
            <GlassBlogCard
              key={article.slug}
              href={articlePath(article)}
              title={article.title}
              excerpt={article.excerpt}
              image={article.cover.small}
              imageSrcSet={`${article.cover.small} 800w, ${article.cover.src} 1920w`}
              imageAlt={article.cover.alt}
              author={author}
              readTime={readTime(article)}
              tags={article.tags}
              actionLabel={articlesPage.readMore}
            />
          ))}
        </div>

        <div className="section-cta">
          <a href={articlesPage.path} className="btn btn--outline">
            <span className="btn__label">{projectsTeaser.all}</span>
            <span className="btn__arrow" aria-hidden="true">
              ←
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

import { GlassBlogCard } from "@/components/ui/glass-blog-card";
import { articlePath, articles, articlesPage, author, readTime } from "@/content/articles";

export function ArticlesPage() {
  return (
    <section className="blog" aria-labelledby="blog-title">
      <div className="container">
        <header className="blog__intro">
          <h1 id="blog-title">{articlesPage.title}</h1>
          <p>{articlesPage.intro}</p>
        </header>

        <div className="blog__grid">
          {articles.map((article) => (
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
      </div>
    </section>
  );
}

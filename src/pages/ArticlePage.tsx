import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RichText } from "@/components/Ltr";
import { cta } from "@/content/site";
import { articlesPage, author, formatArticleDate, readTime, type Article } from "@/content/articles";

export function ArticlePage({ article }: { article: Article }) {
  return (
    <article className="post" aria-labelledby="post-title">
      <div className="post__inner">
        <a href={articlesPage.path} className="post__back">
          <span aria-hidden="true">→</span> {articlesPage.back}
        </a>

        <header className="post__header">
          <ul className="post__tags" aria-label="תגיות">
            {article.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <h1 id="post-title">{article.title}</h1>
          <div className="post__meta">
            <img src={author.avatar} alt="" width={40} height={40} className="post__avatar" />
            <span className="post__author">{author.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{readTime(article)}</span>
          </div>
        </header>

        {article.video ? (
          <figure className="post__video">
            <video
              src={article.video.src}
              poster={article.video.poster}
              controls
              playsInline
              preload="metadata"
              width={1920}
              height={1080}
              aria-label={article.video.label}
            />
            <figcaption>{article.video.label}</figcaption>
          </figure>
        ) : (
          <figure className="post__cover">
            <img
              src={article.cover.src}
              srcSet={`${article.cover.small} 800w, ${article.cover.src} 1920w`}
              sizes="(max-width: 800px) 100vw, 760px"
              alt={article.cover.alt}
              width={1920}
              height={1008}
            />
          </figure>
        )}

        <div className="post__body">
          {article.sections.map((section, index) => (
            <section key={section.heading ?? index}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph, i) =>
                typeof paragraph === "string" ? (
                  <p key={i}>
                    <RichText text={paragraph} />
                  </p>
                ) : "figure" in paragraph ? (
                  <figure key={i} className="post__figure">
                    <img
                      src={paragraph.figure.src}
                      alt={paragraph.figure.alt}
                      width={paragraph.figure.width}
                      height={paragraph.figure.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ) : (
                  <p key={i} className="post__point">
                    <strong>{paragraph.lead}</strong> <RichText text={paragraph.text} />
                  </p>
                ),
              )}
            </section>
          ))}
        </div>

        <aside className="post__cta">
          <p>{article.closing}</p>
          <WhatsAppButton source="article" variant="primary">
            <RichText text={cta.whatsapp} />
          </WhatsAppButton>
        </aside>
      </div>
    </article>
  );
}

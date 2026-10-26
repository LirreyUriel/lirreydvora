import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RichText } from "@/components/Ltr";
import { whatsappMessageUrl } from "@/config";
import { trackArticleRead } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import {
  articleCta,
  articlePath,
  articlesPage,
  author,
  readTime,
  relatedArticles,
  type Article,
} from "@/content/articles";

export function ArticlePage({ article }: { article: Article }) {
  // מי שהגיע לשאלות הנפוצות קרא את המאמר עד הסוף.
  const { ref: endRef } = useInView<HTMLElement>(() => trackArticleRead(), 0.2);

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
            <span>{readTime(article)}</span>
          </div>
        </header>

        <aside className="post__summary" aria-labelledby="post-summary-title">
          <h2 id="post-summary-title">{articlesPage.summaryTitle}</h2>
          <ul>
            {article.summary.map((point) => (
              <li key={point}>
                <RichText text={point} />
              </li>
            ))}
          </ul>
        </aside>

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
        ) : article.cover.animated ? (
          <figure className="post__cover">
            <img
              src={article.cover.animated.src}
              alt={article.cover.animated.alt}
              width={article.cover.animated.width}
              height={article.cover.animated.height}
            />
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

        <section className="post__faq" aria-labelledby="post-faq-title" ref={endRef}>
          <h2 id="post-faq-title">{articlesPage.faqTitle}</h2>
          {article.faq.map((item) => (
            <div key={item.q} className="post__faq-item">
              <h3>
                <RichText text={item.q} />
              </h3>
              <p>
                <RichText text={item.a} />
              </p>
            </div>
          ))}
        </section>

        <aside className="post__cta">
          <WhatsAppButton
            source="article"
            variant="primary"
            href={whatsappMessageUrl(articleCta.message(article.title))}
          >
            {articleCta.label}
          </WhatsAppButton>
          <p className="post__signature">
            <RichText text={articleCta.signature} />
          </p>
        </aside>

        <nav className="post__related" aria-labelledby="post-related-title">
          <h2 id="post-related-title">{articlesPage.relatedTitle}</h2>
          <ul>
            {relatedArticles(article).map((item) => (
              <li key={item.slug}>
                <a href={articlePath(item)}>
                  <RichText text={item.title} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}

type Props = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  imageSrcSet?: string;
  imageAlt?: string;
  author: { name: string; avatar: string };
  date: string;
  dateTime?: string;
  readTime: string;
  tags?: string[];
  actionLabel?: string;
  className?: string;
};

// כרטיס מאמר בסגנון זכוכית. עיבוד של glass-blog-card מ-21st.dev ל-CSS של האתר (בלי Tailwind ו-framer-motion).
export function GlassBlogCard({
  href,
  title,
  excerpt,
  image,
  imageSrcSet,
  imageAlt = "",
  author,
  date,
  dateTime,
  readTime,
  tags = [],
  actionLabel = "לקריאת המאמר",
  className = "",
}: Props) {
  return (
    <article className={`glass-card ${className}`.trim()}>
      <a href={href} className="glass-card__link">
        <div className="glass-card__media">
          <img
            src={image}
            srcSet={imageSrcSet}
            sizes="(max-width: 767px) 100vw, 400px"
            alt={imageAlt}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            className="glass-card__image"
          />
          <div className="glass-card__shade" aria-hidden="true" />

          {tags.length ? (
            <ul className="glass-card__tags" aria-label="תגיות">
              {tags.map((tag) => (
                <li key={tag} className="glass-card__tag">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="glass-card__overlay" aria-hidden="true">
            <span className="glass-card__action">
              <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
                <path
                  d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {actionLabel}
            </span>
          </div>
        </div>

        <div className="glass-card__body">
          <div className="glass-card__text">
            <h2 className="glass-card__title">{title}</h2>
            <p className="glass-card__excerpt">{excerpt}</p>
          </div>

          <div className="glass-card__meta">
            <div className="glass-card__author">
              <img
                src={author.avatar}
                alt=""
                width={32}
                height={32}
                loading="lazy"
                className="glass-card__avatar"
              />
              <div className="glass-card__byline">
                <span className="glass-card__name">{author.name}</span>
                <time dateTime={dateTime}>{date}</time>
              </div>
            </div>

            <span className="glass-card__time">
              <svg viewBox="0 0 24 24" width="12" height="12" focusable="false" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {readTime}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

export default GlassBlogCard;

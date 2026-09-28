import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, hero } from "@/content/site";
import { RichText } from "@/components/Ltr";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        <svg className="hero__tone" aria-hidden="true">
          <filter id="hero-tone" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.58" intercept="0.36" />
              <feFuncG type="linear" slope="0.58" intercept="0.36" />
              <feFuncB type="linear" slope="0.58" intercept="0.36" />
            </feComponentTransfer>
          </filter>
        </svg>
        <img
          className="hero__bg"
          src="/images/hero.webp"
          srcSet="/images/hero-800.webp 800w, /images/hero-1600.webp 1600w, /images/hero.webp 2800w"
          sizes="100vw"
          width={2800}
          height={1867}
          alt=""
          fetchPriority="high"
        />
        <div className="hero__veil" />
      </div>

      <div className="hero__content">
        <p className="eyebrow">
          <RichText text={hero.label} />
        </p>
        <h1 className="hero__title">{hero.title}</h1>
        {hero.paragraphs.map((paragraph) => (
          <p key={paragraph} className="lede">
            {paragraph}
          </p>
        ))}
        <WhatsAppButton source="hero" className="hero__cta">
          <RichText text={cta.whatsapp} />
        </WhatsAppButton>
        <p className="hero__types">{hero.businesses}</p>
      </div>
    </section>
  );
}

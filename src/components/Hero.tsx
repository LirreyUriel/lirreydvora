import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, hero } from "@/content/site";
import { RichText } from "@/components/Ltr";

export function Hero() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow hero__eyebrow">
        <RichText text={hero.label} />
      </p>
      <h1 className="hero__title">{hero.title}</h1>
      <div className="hero__copy">
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

      <Reveal className="hero__visual">
        <figure className="hero__frame">
          <img
            src="/images/hero.webp"
            srcSet="/images/hero-800.webp 800w, /images/hero.webp 1600w"
            sizes="(max-width: 1023px) 92vw, 540px"
            width={1600}
            height={1200}
            alt={hero.imageAlt}
            fetchPriority="high"
          />
        </figure>
      </Reveal>
    </section>
  );
}

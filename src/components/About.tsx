import { Reveal } from "@/components/Reveal";
import { about, aboutPage, cta } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { CtaButton } from "@/components/CtaButton";
import { RichText } from "@/components/Ltr";
import { WordReveal } from "@/components/WordReveal";

export function About() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("about_view"));

  return (
    <section ref={ref} className="section section--cream" id={about.id} aria-labelledby="about-title">
      <div className="container about-layout">
        <div className="about-photo">
          <img
            className="photo-reveal"
            src={about.image}
            width={1024}
            height={1024}
            alt={about.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="about-copy">
          <WordReveal id="about-title" text={about.title} />
          <Reveal>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
            <p>
              <a className="about-more" href={aboutPage.path}>
                {about.more} <span aria-hidden="true">←</span>
              </a>
            </p>
          </Reveal>

          <CtaButton source="about">
            <RichText text={cta.talk} />
          </CtaButton>
        </div>
      </div>
    </section>
  );
}

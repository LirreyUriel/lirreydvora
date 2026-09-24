import { Reveal } from "@/components/Reveal";
import { about, cta } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RichText } from "@/components/Ltr";

export function About() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("about_view"));

  return (
    <section ref={ref} className="section section--beige" id={about.id} aria-labelledby="about-title">
      <div className="container about-layout">
        <Reveal className="about-photo">
          <img
            src={about.image}
            srcSet="/images/about.webp 730w"
            sizes="(max-width: 480px) calc(100vw - 96px), 292px"
            width={730}
            height={998}
            alt={about.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <div className="about-copy">
          <Reveal>
            <h2 id="about-title">{about.title}</h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </Reveal>

          <WhatsAppButton source="about">
            <RichText text={cta.whatsapp} />
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}

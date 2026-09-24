import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { beforeAfter, cta } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { RichText } from "@/components/Ltr";

export function BeforeAfterCard({
  example,
}: {
  example: (typeof beforeAfter.examples)[number];
}) {
  return (
    <article className="ba-card">
      <div className="ba-col ba-col--before">
        <h3 className="ba-title">
          <RichText text={example.beforeLabel} />
        </h3>
        <p className="ba-text">{example.beforeText}</p>
      </div>

      <div className="ba-col ba-col--after">
        <h3 className="ba-title ba-title--after">
          <RichText text={example.afterLabel} />
        </h3>
        <p className="ba-text">{example.afterText}</p>
      </div>
    </article>
  );
}

export function BeforeAfterSection() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("before_after_view"));

  return (
    <section
      ref={ref}
      className="section section--beige"
      id={beforeAfter.id}
      aria-labelledby="before-after-title"
    >
      <div className="container">
        <Reveal>
          <h2 id="before-after-title">{beforeAfter.title}</h2>
        </Reveal>

        <div className="ba-list">
          {beforeAfter.examples.map((example, index) => (
            <Reveal key={example.id} delay={index * 80}>
              <BeforeAfterCard example={example} />
            </Reveal>
          ))}
        </div>

        <div className="section-cta">
          <WhatsAppButton source="before_after">
            <RichText text={cta.whatsapp} />
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";
import { cta, howItWorks } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RichText } from "@/components/Ltr";

export function ProcessStep({
  step,
  index,
}: {
  step: (typeof howItWorks.steps)[number];
  index: number;
}) {
  return (
    <li className="process-step">
      <div className="process-step__marker">
        <span>{step.number}</span>
      </div>
      <div className="process-step__body" style={{ transitionDelay: `${index * 80}ms` }}>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    </li>
  );
}

export function HowItWorks() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("how_it_works_view"));

  return (
    <section
      ref={ref}
      className="section section--cream"
      id={howItWorks.id}
      aria-labelledby="how-it-works-title"
    >
      <div className="container">
        <Reveal>
          <h2 id="how-it-works-title">{howItWorks.title}</h2>
        </Reveal>

        <ol className="process-timeline">
          {howItWorks.steps.map((step, index) => (
            <ProcessStep key={step.number} step={step} index={index} />
          ))}
        </ol>

        <Reveal>
          <div className="section-cta">
            <WhatsAppButton source="how_it_works">
              <RichText text={cta.whatsapp} />
            </WhatsAppButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

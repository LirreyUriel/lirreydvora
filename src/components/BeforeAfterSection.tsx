import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, shift } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { RichText } from "@/components/Ltr";
import { WordReveal } from "@/components/WordReveal";

export function BeforeAfterSection() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("before_after_view"));

  return (
    <section
      ref={ref}
      className="section section--beige"
      id={shift.id}
      aria-labelledby="shift-title"
    >
      <div className="container">
        <WordReveal id="shift-title" text={shift.title} />
        <Reveal>
          <p className="section__intro">{shift.text}</p>
        </Reveal>

        <div className="section-cta">
          <WhatsAppButton source="before_after">
            <RichText text={cta.whatsapp} />
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}

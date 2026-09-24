import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, finalCta } from "@/content/site";
import { RichText } from "@/components/Ltr";
import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section className="final-cta" id={finalCta.id} aria-labelledby="final-cta-title">
      <div className="container">
        <Reveal>
          <h2 id="final-cta-title">{finalCta.title}</h2>
          <p className="final-cta__text">{finalCta.text}</p>
          <WhatsAppButton source="final_cta" variant="on-dark">
            <RichText text={cta.whatsapp} />
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, finalCta } from "@/content/site";
import { RichText } from "@/components/Ltr";

export function FinalCTA() {
  return (
    <section className="final-cta" id={finalCta.id} aria-labelledby="final-cta-title">
      <div className="container">
        <h2 id="final-cta-title">{finalCta.title}</h2>
        <p className="final-cta__text">{finalCta.text}</p>
        <WhatsAppButton source="final_cta" variant="on-dark">
          <RichText text={cta.whatsapp} />
        </WhatsAppButton>
      </div>
    </section>
  );
}

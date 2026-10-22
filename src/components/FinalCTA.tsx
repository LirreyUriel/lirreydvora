import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, finalCta } from "@/content/site";
import { RichText } from "@/components/Ltr";

export function FinalCTA() {
  return (
    <section className="final-cta" id={finalCta.id} aria-label="לשיחת ייעוץ">
      <div className="container">
        <WhatsAppButton source="final_cta" variant="on-dark">
          <RichText text={cta.whatsapp} />
        </WhatsAppButton>
      </div>
    </section>
  );
}

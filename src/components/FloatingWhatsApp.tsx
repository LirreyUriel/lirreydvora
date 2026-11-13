import { whatsappMessageUrl } from "@/config";
import { trackWhatsApp } from "@/analytics";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { floatingWhatsApp } from "@/content/site";

// הכפתור הצף הוא הדרך היחידה באתר לשלוח הודעה. הוא מוצג בכל עמוד ובכל רוחב מסך.
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappMessageUrl(floatingWhatsApp.message)}
      className="floating-wa"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={floatingWhatsApp.label}
      title={floatingWhatsApp.label}
      onClick={() => trackWhatsApp("floating")}
    >
      <WhatsAppIcon />
    </a>
  );
}

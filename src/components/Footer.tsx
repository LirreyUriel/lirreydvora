import { Logo } from "@/components/Logo";
import { floatingWhatsApp, footer, privacy } from "@/content/site";
import { PHONE_DISPLAY, whatsappMessageUrl } from "@/config";
import { trackWhatsApp } from "@/analytics";
import { RichText } from "@/components/Ltr";
import { openConsentSettings } from "@/components/ConsentBanner";

export function Footer() {
  return (
    <footer className="site-footer" id={footer.id}>
      <div className="container site-footer__brand">
        <Logo inverted compact />
        <p>
          <RichText text={footer.tagline} />
        </p>
        <p className="site-footer__phone">
          <span>{footer.phoneLabel}:</span>
          <a
            href={whatsappMessageUrl(floatingWhatsApp.message)}
            dir="ltr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${floatingWhatsApp.label}: ${PHONE_DISPLAY}`}
            onClick={() => trackWhatsApp("footer")}
          >
            {PHONE_DISPLAY}
          </a>
        </p>
        <details className="site-footer__privacy">
          <summary>{privacy.summary}</summary>
          <p>{privacy.note}</p>
          <button type="button" className="site-footer__consent" onClick={openConsentSettings}>
            {privacy.settings}
          </button>
        </details>
      </div>
    </footer>
  );
}

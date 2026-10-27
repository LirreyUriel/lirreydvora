import { Logo } from "@/components/Logo";
import { footer, privacy } from "@/content/site";
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

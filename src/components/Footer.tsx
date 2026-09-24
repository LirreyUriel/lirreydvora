import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, footer, nav } from "@/content/site";
import { Ltr, RichText } from "@/components/Ltr";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo inverted />
          <p>
            <RichText text={footer.tagline} />
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="ניווט תחתון">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <WhatsAppButton source="footer" variant="on-dark">
          <RichText text={cta.whatsapp} />
        </WhatsAppButton>
      </div>
      <p className="site-footer__copy">
        <Ltr>{footer.copyright}</Ltr>
      </p>
    </footer>
  );
}

import { Logo } from "@/components/Logo";
import { footer } from "@/content/site";
import { RichText } from "@/components/Ltr";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__brand">
        <Logo inverted compact />
        <p>
          <RichText text={footer.tagline} />
        </p>
      </div>
    </footer>
  );
}

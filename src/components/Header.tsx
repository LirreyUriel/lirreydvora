import { Logo } from "@/components/Logo";
import { SiteNav } from "@/components/SiteNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta } from "@/content/site";
import { RichText } from "@/components/Ltr";
import { useScrolled } from "@/hooks/useScrolled";

export function Header() {
  const scrolled = useScrolled(16);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Logo compact />
        <SiteNav />
        <WhatsAppButton source="header" variant="header">
          <RichText text={cta.whatsapp} />
        </WhatsAppButton>
      </div>
    </header>
  );
}

import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta, nav } from "@/content/site";
import { useScrolled } from "@/hooks/useScrolled";

export function Header() {
  const scrolled = useScrolled(16);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Logo compact />
        <nav className="site-nav" aria-label="ניווט ראשי">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <WhatsAppButton source="header" variant="header">
          {cta.talk}
        </WhatsAppButton>
      </div>
    </header>
  );
}

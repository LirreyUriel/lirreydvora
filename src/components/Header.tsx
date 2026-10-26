import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cta } from "@/content/site";
import { articlesPage } from "@/content/articles";
import { RichText } from "@/components/Ltr";
import { useScrolled } from "@/hooks/useScrolled";

type Props = {
  // בדפים בלי תמונת hero הבר מוצג תמיד על רקע בהיר.
  solid?: boolean;
  active?: "articles";
};

export function Header({ solid = false, active }: Props) {
  const scrolled = useScrolled(16) || solid;

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Logo compact mobileLine />
        <nav className="site-nav" aria-label="ניווט ראשי">
          <a
            href={articlesPage.path}
            className="site-nav__link"
            aria-current={active === "articles" ? "page" : undefined}
          >
            {articlesPage.title}
          </a>
        </nav>
        <WhatsAppButton source="header" variant={scrolled ? "header" : "on-dark"}>
          <RichText text={cta.whatsapp} />
        </WhatsAppButton>
      </div>
    </header>
  );
}

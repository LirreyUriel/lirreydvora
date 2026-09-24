import { stickyCta } from "@/content/site";
import { whatsappUrl } from "@/config";
import { trackWhatsApp } from "@/analytics";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useEffect, useState } from "react";

export function MobileWhatsAppCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("final-cta");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.35 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`sticky-wa ${hidden ? "is-hidden" : ""}`}>
      <a
        href={whatsappUrl}
        className="sticky-wa__btn"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsApp("sticky_mobile")}
      >
        <WhatsAppIcon />
        <span className="sticky-wa__label" dir="ltr">
          {stickyCta.label}
        </span>
        <span className="sticky-wa__action">{stickyCta.action}</span>
        <span className="btn__arrow" aria-hidden="true">
          ←
        </span>
      </a>
    </div>
  );
}

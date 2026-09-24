import { whatsappUrl } from "@/config";
import { trackWhatsApp, type WhatsAppSource } from "@/analytics";
import type { ReactNode } from "react";

type Props = {
  source: WhatsAppSource;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "on-dark" | "ghost" | "header";
};

export function WhatsAppButton({
  source,
  children,
  className = "",
  variant = "primary",
}: Props) {
  return (
    <a
      href={whatsappUrl}
      className={`btn btn--${variant} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
    >
      <span className="btn__label">{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        ←
      </span>
    </a>
  );
}

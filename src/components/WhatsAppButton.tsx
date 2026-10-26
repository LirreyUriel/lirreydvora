import { whatsappUrl } from "@/config";
import { trackWhatsApp, type WhatsAppSource } from "@/analytics";
import type { ReactNode } from "react";
import { ButtonRipples, useButtonRipple } from "@/components/ButtonRipple";

type Props = {
  source: WhatsAppSource;
  children: ReactNode;
  className?: string;
  // קישור עם הודעה מוכנה. בלי זה הכפתור פותח שיחה ריקה.
  href?: string;
  variant?: "primary" | "on-dark" | "ghost" | "header";
};

export function WhatsAppButton({
  source,
  children,
  className = "",
  href = whatsappUrl,
  variant = "primary",
}: Props) {
  const { ripples, onPointerDown, removeRipple } = useButtonRipple();

  return (
    <a
      href={href}
      className={`btn btn--${variant} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      onPointerDown={onPointerDown}
      onClick={() => trackWhatsApp(source)}
    >
      <ButtonRipples ripples={ripples} onDone={removeRipple} />
      <span className="btn__label">{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        ←
      </span>
    </a>
  );
}

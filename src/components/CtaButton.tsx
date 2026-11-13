import { contactFormUrl } from "@/config";
import { trackCta, type CtaSource } from "@/analytics";
import type { ReactNode } from "react";
import { ButtonRipples, useButtonRipple } from "@/components/ButtonRipple";

type Props = {
  source: CtaSource;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "on-dark" | "ghost" | "header";
};

// כל כפתורי הפעולה באתר מובילים לטופס הפנייה שבעמוד הראשי.
export function CtaButton({ source, children, className = "", variant = "primary" }: Props) {
  const { ripples, onPointerDown, removeRipple } = useButtonRipple();

  return (
    <a
      href={contactFormUrl}
      className={`btn btn--${variant} ${className}`}
      onPointerDown={onPointerDown}
      onClick={() => trackCta(source)}
    >
      <ButtonRipples ripples={ripples} onDone={removeRipple} />
      <span className="btn__label">{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        ←
      </span>
    </a>
  );
}

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Ltr({ children, className }: Props) {
  return (
    <span dir="ltr" className={className}>
      {children}
    </span>
  );
}

const LTR_TERMS = [
  "Google Sheets",
  "WhatsApp",
  "Follow-up",
  "Chatbot",
  "Airtable",
  "Make",
  "CRM",
  "Wellness",
];

const LTR_PATTERN = new RegExp(`(${LTR_TERMS.join("|")})`, "g");

export function RichText({ text }: { text: string }) {
  const parts = text.split(LTR_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        LTR_TERMS.includes(part) ? <Ltr key={`${part}-${index}`}>{part}</Ltr> : part,
      )}
    </>
  );
}

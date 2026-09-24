import { Ltr, RichText } from "@/components/Ltr";
import { crmLeads } from "@/content/site";

export function MessyToolsVisual() {
  return (
    <div className="visual-stack" aria-hidden="true">
      <div className="note-card">רשימת לידים — לבדוק מחר</div>
      <div className="chip-row">
        <span className="tool-chip">
          <Ltr>WhatsApp</Ltr>
        </span>
        <span className="tool-chip">
          <Ltr>Google Sheets</Ltr>
        </span>
        <span className="tool-chip">פתקים</span>
      </div>
      <div className="sheet-mock">
        <span>שם</span>
        <span>שילמה?</span>
        <span>עדיין לא</span>
        <span>נועה</span>
        <span>??</span>
        <span>לחזור אליה</span>
      </div>
    </div>
  );
}

export function CrmVisual() {
  return (
    <div className="crm-visual" aria-hidden="true">
      <div className="crm-visual__bar">
        <span>לידים השבוע</span>
        <strong>12 פתוחים</strong>
      </div>
      <ul className="crm-list">
        {crmLeads.map((lead) => (
          <li key={lead.name} className="crm-row">
            <span className="crm-row__name">{lead.name}</span>
            <span className="crm-row__offer">{lead.offer}</span>
            <span className={`status status--${lead.tone}`}>{lead.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JourneyVisual({
  steps,
  tone,
}: {
  steps: readonly string[];
  tone: "before" | "after";
}) {
  return (
    <ol className={`journey-flow journey-flow--${tone}`}>
      {steps.map((step) => (
        <li key={step}>
          <RichText text={step} />
        </li>
      ))}
    </ol>
  );
}

export function QuestionsVisual({ quotes }: { quotes: readonly string[] }) {
  return (
    <div className="quote-stack" aria-hidden="true">
      {quotes.map((quote) => (
        <p key={quote} className="quote-card">
          “{quote}”
        </p>
      ))}
    </div>
  );
}

export function CalmSystemVisual({ text }: { text: string }) {
  return (
    <div className="calm-card">
      <span className="calm-card__label">המערכת</span>
      <p>{text}</p>
    </div>
  );
}

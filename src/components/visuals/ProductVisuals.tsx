import { RichText } from "@/components/Ltr";
import { whatsappChat } from "@/content/site";

export function WhatsAppChatVisual() {
  return (
    <div className="phone-frame" role="img" aria-label="שיחת WhatsApp לדוגמה">
      <div className="phone-frame__notch" />
      <div className="wa-head">
        <span className="wa-avatar" aria-hidden="true">
          נ
        </span>
        <span>
          <strong>{whatsappChat.name}</strong>
          <small>{whatsappChat.status}</small>
        </span>
      </div>
      <div className="wa-thread">
        {whatsappChat.messages.map((message) => (
          <p
            key={message.text}
            className={`wa-bubble wa-bubble--${message.from}`}
          >
            {message.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function CustomerJourneyFlow({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="soft-flow">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="soft-flow__num">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <RichText text={step} />
          </span>
        </li>
      ))}
    </ol>
  );
}

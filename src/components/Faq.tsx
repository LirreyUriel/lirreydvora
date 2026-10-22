import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { faq } from "@/content/site";

type FaqItem = (typeof faq.items)[number];

function answerText(item: FaqItem) {
  const parts: string[] = [...item.paragraphs];
  if ("list" in item) parts.push(...item.list);
  if ("closing" in item) parts.push(item.closing);
  return parts.join("\n");
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answerText(item),
    },
  })),
};

function FaqItemView({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const questionId = `faq-q-${index + 1}`;
  const panelId = `faq-a-${index + 1}`;
  const list = "list" in item ? item.list : undefined;
  const closing = "closing" in item ? item.closing : undefined;

  return (
    <div className={`faq__item${open ? " is-open" : ""}`}>
      <h3>
        <button
          id={questionId}
          className="faq__question"
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{item.question}</span>
          <span className="faq__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path
                d="M12 5v14M5 12h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        className="faq__panel"
        role="region"
        aria-labelledby={questionId}
        inert={!open}
      >
        <div className="faq__panel-inner">
          <div className="faq__answer">
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {list ? (
              <ul className="faq__points">
                {list.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {closing ? <p>{closing}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="section" id={faq.id} aria-labelledby="faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container">
        <div className="faq">
          <WordReveal id="faq-title" text={faq.title} />
          <Reveal>
            <div className="faq__list">
              {faq.items.map((item, index) => (
                <FaqItemView key={item.question} item={item} index={index} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

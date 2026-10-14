import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { faq } from "@/content/site";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const questionId = `faq-q-${index + 1}`;
  const panelId = `faq-a-${index + 1}`;

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
          <span>{question}</span>
          <span className="faq__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path
                d="M6 9.5 12 15.5 18 9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
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
          <p className="faq__answer">{answer}</p>
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
          <Reveal>
            <h2 id="faq-title">{faq.title}</h2>
            <div className="faq__list">
              {faq.items.map((item, index) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  index={index}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

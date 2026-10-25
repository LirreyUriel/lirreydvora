import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { LiquidGlassAccordion } from "@/components/ui/liquid-glass-accordion";
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

function FaqAnswer({ item }: { item: FaqItem }) {
  const list = "list" in item ? item.list : undefined;
  const closing = "closing" in item ? item.closing : undefined;

  return (
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
  );
}

const accordionItems = faq.items.map((item, index) => ({
  id: `q${index + 1}`,
  title: item.question,
  content: <FaqAnswer item={item} />,
}));

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
            <div className="faq__glass-stage">
              <LiquidGlassAccordion items={accordionItems} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

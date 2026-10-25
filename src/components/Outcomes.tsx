import { useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { outcomes } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

function MoreLine({ text, highlight }: { text: string; highlight: string }) {
  const rest = text.startsWith(highlight) ? text.slice(highlight.length) : ` ${text}`;
  return (
    <p>
      <strong>{highlight}</strong>
      {rest}
    </p>
  );
}

export function Outcomes() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("examples_view"));
  // הקו שמוחק את "פחות" והחשיפה של "יותר" מתחילים רק אחרי לחיצה על הכפתור.
  const [revealed, setRevealed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const reveal = () => {
    setRevealed(true);
    // הכפתור נעלם, אז הפוקוס עובר לרשימה עצמה.
    requestAnimationFrame(() => listRef.current?.focus());
  };

  return (
    <section ref={ref} className="section section--beige" id={outcomes.id} aria-labelledby="examples-title">
      <div className="container">
        <WordReveal id="examples-title" text={outcomes.title} />

        {/* הכפתור לפני הכרטיסים, כדי שלא יגללו על פני כרטיסים מטושטשים בלי להבין למה. */}
        {revealed ? null : (
          <div className="section-cta shift-cta">
            <button type="button" className="btn btn--primary" onClick={reveal}>
              <span className="btn__label">{outcomes.reveal}</span>
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </button>
          </div>
        )}

        <div
          ref={listRef}
          className={`shift-list${revealed ? " is-revealed" : ""}`}
          tabIndex={-1}
        >
          {outcomes.pairs.map((pair, index) => (
            <Reveal key={pair.less} delay={index * 60}>
              <article className="shift-row" style={{ "--shift-delay": `${index * 70}ms` } as CSSProperties}>
                <div className="shift-side shift-side--less">
                  <p>
                    <span className="shift-strike">{pair.less}</span>
                  </p>
                </div>
                <div className="shift-side shift-side--more" aria-hidden={!revealed}>
                  <MoreLine text={pair.more} highlight={pair.highlight} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="shift-closing">{outcomes.closing}</p>
        </Reveal>
        {revealed ? <p className="shift-after">{outcomes.afterReveal}</p> : null}

      </div>
    </section>
  );
}

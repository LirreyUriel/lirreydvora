import { useEffect, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { outcomes } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

type Pair = (typeof outcomes.pairs)[number];

function MoreLine({ text, highlight }: { text: string; highlight: string }) {
  const rest = text.startsWith(highlight) ? text.slice(highlight.length) : ` ${text}`;
  return (
    <p>
      <strong>{highlight}</strong>
      {rest}
    </p>
  );
}

// כל שורה מתנגנת לבד כשהיא נכנסת למסך: הקו מוחק את ה"לפני", ואז ה"אחרי" מתבהר.
// ההשהיה נותנת זמן לקרוא את ה"לפני" לפני שהוא נמחק.
function ShiftRow({ pair, index }: { pair: Pair; index: number }) {
  // isInView חוזר ל-false ביציאה מהמסך. כאן האנימציה מתנגנת פעם אחת ונשארת.
  const { ref, isInView } = useInView<HTMLElement>(undefined, 0.5);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (isInView) setRevealed(true);
  }, [isInView]);

  return (
    <article
      ref={ref}
      className={`shift-row${revealed ? " is-revealed" : ""}`}
      style={{ "--shift-delay": `${500 + index * 120}ms` } as CSSProperties}
    >
      <div className="shift-side shift-side--less">
        <p>
          <span className="shift-strike">{pair.less}</span>
        </p>
      </div>
      <div className="shift-side shift-side--more">
        <span className="shift-label">{outcomes.moreLabel}</span>
        <MoreLine text={pair.more} highlight={pair.highlight} />
      </div>
    </article>
  );
}

export function Outcomes() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("examples_view"));

  return (
    <section ref={ref} className="section section--beige" id={outcomes.id} aria-labelledby="examples-title">
      <div className="container">
        <WordReveal id="examples-title" text={outcomes.title} />

        <div className="shift-list">
          {/* שם העמודה מוצג פעם אחת כששתי העמודות זו לצד זו. במובייל הוא מופיע בתוך כל כרטיס. */}
          <div className="shift-head" aria-hidden="true">
            <span />
            <span>{outcomes.moreLabel}</span>
          </div>
          {outcomes.pairs.map((pair, index) => (
            <Reveal key={pair.less} delay={index * 60}>
              <ShiftRow pair={pair} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="shift-after">{outcomes.after}</p>
        </Reveal>
      </div>
    </section>
  );
}

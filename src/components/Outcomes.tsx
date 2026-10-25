import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { outcomes } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

function MoreLine({ text }: { text: string }) {
  const [first, ...rest] = text.split(" ");
  return (
    <p>
      <strong>{first}</strong>
      {rest.length > 0 ? ` ${rest.join(" ")}` : null}
    </p>
  );
}

export function Outcomes() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("examples_view"));

  return (
    <section ref={ref} className="section section--beige" id={outcomes.id} aria-labelledby="examples-title">
      <div className="container">
        <WordReveal id="examples-title" text={outcomes.title} />

        <div className="shift-list">
          {outcomes.pairs.map((pair, index) => (
            <Reveal key={pair.less} delay={index * 60}>
              <article className="shift-row" style={{ "--shift-delay": `${index * 60}ms` } as CSSProperties}>
                <div className="shift-side shift-side--less">
                  <span>פחות</span>
                  <p>
                    <span className="shift-strike">{pair.less}</span>
                  </p>
                </div>
                <div className="shift-side shift-side--more">
                  <span>יותר</span>
                  <MoreLine text={pair.more} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

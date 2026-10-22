import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { outcomes } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

export function Outcomes() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("examples_view"));

  return (
    <section ref={ref} className="section section--beige" id={outcomes.id} aria-labelledby="examples-title">
      <div className="container">
        <WordReveal id="examples-title" text={outcomes.title} />

        <div className="benefit-grid">
          {outcomes.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <article className="benefit-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

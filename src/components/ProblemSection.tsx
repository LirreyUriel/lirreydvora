import { Reveal } from "@/components/Reveal";
import { problem } from "@/content/site";

export function ProblemSection() {
  return (
    <section className="section section--cream" id={problem.id} aria-labelledby="problem-title">
      <div className="container">
        <Reveal>
          <h2 id="problem-title">{problem.title}</h2>
          <p className="section__intro">{problem.text}</p>
        </Reveal>

        <div className="problem-grid">
          {problem.cards.map((card, index) => (
            <Reveal key={card} delay={index * 60}>
              <article className="editorial-card">
                <span className="editorial-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{card}</h3>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

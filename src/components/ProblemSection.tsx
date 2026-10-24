import { Reveal } from "@/components/Reveal";
import { problem, statement } from "@/content/site";

export function ProblemSection() {
  return (
    <>
      <section className="section section--cream" id={problem.id} aria-labelledby="problem-title">
        <div className="container problem-layout">
          <img
            className="problem-layout__gif"
            src="/images/busy-day.gif"
            alt="יום עמוס ביומן, כשהכל עדיין עובר דרכך"
            loading="lazy"
            decoding="async"
          />
          <div className="problem-layout__copy">
            <h2 id="problem-title" className="quote-type">
              {problem.question}
            </h2>
            <Reveal>
              <p className="section__intro">{problem.text}</p>
            </Reveal>
            <Reveal>
              <h2 className="section__close quote-type">
                {problem.closing.replace("\n", " ")}
              </h2>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="opening-band">
        <div className="container opening-band__layout">
          <blockquote className="opening-band__quote">
            <p className="quote-type">{statement.text}</p>
          </blockquote>
          <img
            className="opening-band__photo"
            src="/images/presence.jpg"
            width={1024}
            height={682}
            alt="שיחת ייעוץ בסטודיו, כשהמשימות כבר מסודרות על המסך"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>
    </>
  );
}

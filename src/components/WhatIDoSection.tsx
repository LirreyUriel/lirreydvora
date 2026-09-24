import { Reveal } from "@/components/Reveal";
import { whatIDo } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

export function WhatIDoSection() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("how_i_help_view"));

  return (
    <section
      ref={ref}
      className="section"
      id={whatIDo.id}
      aria-labelledby="what-i-do-title"
    >
      <div className="container">
        <Reveal>
          <h2 id="what-i-do-title">{whatIDo.title}</h2>
          {whatIDo.paragraphs.map((paragraph) => (
            <p key={paragraph} className="section__intro">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <div className="benefit-grid">
          {whatIDo.benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 70}>
              <article className="benefit-card">
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

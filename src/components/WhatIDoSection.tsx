import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { approach } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

export function WhatIDoSection() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("how_i_help_view"));

  return (
    <section ref={ref} className="section" id={approach.id} aria-labelledby="how-title">
      <div className="container">
        <WordReveal id="how-title" text={approach.title} />
        <Reveal>
          {approach.paragraphs.map((paragraph) => (
            <p key={paragraph} className="section__intro section__intro--full">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

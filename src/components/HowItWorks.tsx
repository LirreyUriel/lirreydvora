import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { cta, howItWorks } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RichText } from "@/components/Ltr";
import { WordReveal } from "@/components/WordReveal";

// Each step starts counting once the connector line from the previous step reaches it.
const STEP_GAP = 650;
const COUNT_TICK = 120;

function useCountTo(target: string, started: boolean, delay: number, reduced: boolean) {
  const end = Number(target);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) {
      setValue(end);
      return;
    }
    if (!started) return;

    let current = 0;
    let timer = window.setTimeout(function tick() {
      current += 1;
      setValue(current);
      if (current < end) timer = window.setTimeout(tick, COUNT_TICK);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [started, delay, end, reduced]);

  return String(value).padStart(target.length, "0");
}

export function ProcessStep({
  step,
  index,
  started,
  reduced,
}: {
  step: (typeof howItWorks.steps)[number];
  index: number;
  started: boolean;
  reduced: boolean;
}) {
  const shown = useCountTo(step.number, started, index * STEP_GAP, reduced);

  return (
    <li className="process-step" style={{ "--i": index } as CSSProperties}>
      <div className="process-step__marker">
        <span>{shown}</span>
      </div>
      <div className="process-step__body" style={{ transitionDelay: `${index * 80}ms` }}>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    </li>
  );
}

export function HowItWorks() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("how_it_works_view"));
  const listRef = useRef<HTMLOListElement>(null);
  const [started, setStarted] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = listRef.current;
    if (!node || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  return (
    <section
      ref={ref}
      className="section section--cream"
      id={howItWorks.id}
      aria-labelledby="how-it-works-title"
    >
      <div className="container">
        <WordReveal id="how-it-works-title" text={howItWorks.title} />

        <ol
          ref={listRef}
          className={`process-timeline process-timeline--four${started || reduced ? " is-drawn" : ""}`}
        >
          {howItWorks.steps.map((step, index) => (
            <ProcessStep key={step.number} step={step} index={index} started={started} reduced={reduced} />
          ))}
        </ol>

        <Reveal>
          <div className="section-cta">
            <WhatsAppButton source="how_it_works">
              <RichText text={cta.whatsapp} />
            </WhatsAppButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

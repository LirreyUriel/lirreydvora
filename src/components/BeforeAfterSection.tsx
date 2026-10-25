import { Reveal } from "@/components/Reveal";
import { Quiz } from "@/components/Quiz";
import { shift } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";
import { WordReveal } from "@/components/WordReveal";

export function BeforeAfterSection() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("before_after_view"));

  return (
    <section
      ref={ref}
      className="section section--beige"
      id={shift.id}
      aria-labelledby="shift-title"
    >
      <div className="container">
        <WordReveal id="shift-title" text={shift.title} />
        <Reveal>
          <p className="section__intro">{shift.text}</p>
        </Reveal>

        <Quiz />
      </div>
    </section>
  );
}

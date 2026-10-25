import { Quiz } from "@/components/Quiz";
import { shift } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

// השאלון עומד כאן לבד: מסך הפתיחה שלו הוא הכותרת של הסקשן.
export function BeforeAfterSection() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("before_after_view"));

  return (
    <section ref={ref} className="section section--beige" id={shift.id} aria-label={shift.title}>
      <div className="container">
        <Quiz />
      </div>
    </section>
  );
}

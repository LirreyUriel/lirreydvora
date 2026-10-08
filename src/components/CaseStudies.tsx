import { Reveal } from "@/components/Reveal";
import { caseStudies } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

function CaseStudyImage({
  item,
}: {
  item: (typeof caseStudies.items)[number];
}) {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce(item.viewEvent), 0.35);

  return (
    <figure ref={ref} className="cs-card">
      <img
        src={item.image}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

export function CaseStudies() {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce("case_studies_view"));

  return (
    <section
      ref={ref}
      className="section"
      id={caseStudies.id}
      aria-labelledby="case-studies-title"
    >
      <div className="container">
        <Reveal>
          <h2 id="case-studies-title">{caseStudies.title}</h2>
        </Reveal>

        <div className="cs-list">
          {caseStudies.items.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <CaseStudyImage item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

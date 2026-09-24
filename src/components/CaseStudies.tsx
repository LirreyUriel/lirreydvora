import { Reveal } from "@/components/Reveal";
import { Ltr, RichText } from "@/components/Ltr";
import {
  CustomerJourneyFlow,
  WhatsAppChatVisual,
} from "@/components/visuals/ProductVisuals";
import { CrmVisual } from "@/components/visuals/EditorialVisuals";
import { projects } from "@/content/site";
import { trackViewOnce } from "@/analytics";
import { useInView } from "@/hooks/useInView";

function CaseStudyVisual({
  visual,
  flow,
}: {
  visual: (typeof projects.items)[number]["visual"];
  flow?: readonly string[];
}) {
  if (visual === "crm") return <CrmVisual />;
  if (visual === "whatsapp") return <WhatsAppChatVisual />;
  return <CustomerJourneyFlow steps={flow ?? []} />;
}

export function CaseStudyCard({
  project,
  flip,
}: {
  project: (typeof projects.items)[number];
  flip?: boolean;
}) {
  const { ref } = useInView<HTMLElement>(() => trackViewOnce(project.viewEvent), 0.4);

  return (
    <article
      ref={ref}
      className={`case-study ${flip ? "case-study--flip" : ""}`}
    >
      <div className="case-study__intro">
        <p className="eyebrow">
          {projects.demoLabel} · {project.number}
        </p>
        <h3>{project.title}</h3>
        <p className="case-study__kicker">הבעיה</p>
        <p>{project.problem}</p>
      </div>

      <div className="case-study__visual">
        <CaseStudyVisual visual={project.visual} flow={"flow" in project ? project.flow : undefined} />
      </div>

      <div className="case-study__details">
        {"built" in project && project.built ? (
          <div className="case-study__block">
            <p className="case-study__kicker">{project.builtTitle}</p>
            <ul className="pill-list">
              {project.built.map((item) => (
                <li key={item}>
                  {item === "CRM" || item === "Follow-up" ? <Ltr>{item}</Ltr> : item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {"impact" in project && project.impact ? (
          <div className="case-study__block">
            <p className="case-study__kicker">{project.impactTitle}</p>
            <ul className="plain-list">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {"flow" in project && project.visual === "whatsapp" ? (
          <div className="case-study__block">
            <p className="case-study__kicker">איך זה עובד</p>
            <ol className="plain-list">
              {project.flow.map((step) => (
                <li key={step}>
                  <RichText text={step} />
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {"message" in project && project.message ? (
          <p className="case-study__message">{project.message}</p>
        ) : null}
      </div>
    </article>
  );
}

export function CaseStudies() {
  return (
    <section className="section" id={projects.id} aria-labelledby="projects-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">פרויקטים</p>
          <h2 id="projects-title">איך זה נראה כשהתהליך כבר לא תלוי בזיכרון שלך.</h2>
        </Reveal>

        <div className="case-list">
          {projects.items.map((project, index) => (
            <Reveal key={project.id} delay={index * 40}>
              <CaseStudyCard project={project} flip={index % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

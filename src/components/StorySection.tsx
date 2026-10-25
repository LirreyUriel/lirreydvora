import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { story } from "@/content/site";

// לפני ואחרי של רגע אחד ביום: לקוחה קובעת פגישה.
export function StorySection() {
  return (
    <section className="section story" id={story.id} aria-labelledby="story-title">
      <div className="container">
        <p className="story__eyebrow">{story.eyebrow}</p>
        <h2 id="story-title" className="story__title">
          {story.title}
        </h2>

        <div className="story__grid">
          <Reveal className="story__reveal">
            <article className="story-card story-card--before">
              <span className="story-card__label">{story.before.label}</span>
              <p className="story-card__event">
                <CalendarIcon />
                {story.before.event}
              </p>
              <p className="story-card__intro">{story.before.tasksTitle}</p>
              <ol className="story-tasks">
                {story.before.tasks.map((task, index) => (
                  <li key={task}>
                    <span className="story-tasks__number" aria-hidden="true">
                      {index + 1}
                    </span>
                    {task}
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>

          <span className="story__arrow" aria-hidden="true">
            ←
          </span>

          <Reveal className="story__reveal" delay={200}>
            <article className="story-card story-card--after">
              <span className="story-card__label">{story.after.label}</span>
              <p className="story-card__event">
                <CalendarIcon />
                {story.after.event}
              </p>
              <p className="story-card__intro">{story.after.intro}</p>
              <ul className="story-done">
                {story.after.done.map((item, index) => (
                  <li key={item} style={{ "--i": index } as CSSProperties}>
                    <span className="story-done__check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="14" height="14" focusable="false">
                        <path
                          d="m5 12 5 5 9-10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="story-card__closing">{story.after.closing}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

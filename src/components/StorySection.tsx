import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { story } from "@/content/site";
import { track } from "@/analytics";

// לפני ואחרי של רגע אחד ביום, בלשונית לכל סוג אוטומציה.
export function StorySection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = story.tabs[active];

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
    track("automation_tab_click", { tab: story.tabs[index].id, position: index + 1 });
  };

  // חיצים עוברים בין הלשוניות. בעברית החץ שמאלה הוא "הבא".
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = story.tabs.length;
    const moves: Record<string, number> = {
      ArrowLeft: (active + 1) % count,
      ArrowRight: (active - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="section story" id={story.id} aria-labelledby="story-title">
      <div className="container">
        <p className="story__eyebrow">{story.eyebrow}</p>
        <h2 id="story-title" className="story__title">
          {story.title}
        </h2>

        <div className="story-tabs" role="tablist" aria-label={story.tabsLabel} onKeyDown={onKeyDown}>
          {story.tabs.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`story-tab-${item.id}`}
              className="story-tabs__tab"
              aria-selected={index === active}
              aria-controls="story-panel"
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* key מרכיב את הכרטיסים מחדש בכל לשונית, כדי שהסימונים ב"אחרי" ייכנסו שוב אחד אחד. */}
        <div
          key={tab.id}
          className="story__grid"
          role="tabpanel"
          id="story-panel"
          aria-labelledby={`story-tab-${tab.id}`}
        >
          <Reveal className="story__reveal">
            <article className="story-card story-card--before">
              <span className="story-card__label">{story.beforeLabel}</span>
              <p className="story-card__event">
                <CalendarIcon />
                {tab.before.event}
              </p>
              <p className="story-card__intro">{story.tasksTitle}</p>
              <ol className="story-tasks">
                {tab.before.tasks.map((task, index) => (
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
              <span className="story-card__label">{story.afterLabel}</span>
              <p className="story-card__event">
                <CalendarIcon />
                {tab.after.event}
              </p>
              <p className="story-card__intro">{story.intro}</p>
              <ul className="story-done">
                {tab.after.done.map((item, index) => (
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
              <p className="story-card__closing">{tab.after.closing}</p>
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

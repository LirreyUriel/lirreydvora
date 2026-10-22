import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { WordReveal } from "@/components/WordReveal";
import { problem } from "@/content/site";

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const cardIcons = [
  <LineIcon key="leads">
    <circle cx="8" cy="7.5" r="2.35" />
    <path d="M3.8 18.4v-.35c0-2.15 1.9-3.75 4.2-3.75s4.2 1.6 4.2 3.75v.35" />
    <path d="M15 8.15h5.15" />
    <path d="M17.7 5.7 20.4 8.15 17.7 10.6" />
  </LineIcon>,
  <LineIcon key="messages">
    <path d="M4.1 5.15h7.7a1.45 1.45 0 0 1 1.45 1.45v2.55a1.45 1.45 0 0 1-1.45 1.45H8.55L6.7 12.45V10.6H4.1A1.45 1.45 0 0 1 2.65 9.15V6.6A1.45 1.45 0 0 1 4.1 5.15z" />
    <path d="M10.15 10.55h7.85a1.45 1.45 0 0 1 1.45 1.45v3a1.45 1.45 0 0 1-1.45 1.45H15.4l-1.9 1.9v-1.9h-3.35a1.45 1.45 0 0 1-1.45-1.45v-3a1.45 1.45 0 0 1 1.45-1.45z" />
  </LineIcon>,
  <LineIcon key="clipboard">
    <rect x="6.35" y="5.15" width="11.3" height="14.7" rx="1.8" />
    <path d="M9.15 5.15h5.7v1.7a.85.85 0 0 1-.85.85h-4a.85.85 0 0 1-.85-.85v-1.7z" />
    <path d="M9.1 11.35h5.8" />
    <path d="M9.1 14.55h4.15" />
  </LineIcon>,
  <LineIcon key="reminders">
    <path d="M12 4.6v1.05" />
    <path d="M6.15 16.35c.7-1.15 1.2-2.5 1.2-4.3V10.1a4.65 4.65 0 0 1 9.3 0v1.95c0 1.8.5 3.15 1.2 4.3" />
    <path d="M5.35 16.35h13.3" />
    <path d="M10.05 16.5a1.95 1.95 0 0 0 3.9 0" />
  </LineIcon>,
  <LineIcon key="time">
    <circle cx="12" cy="12" r="7.15" />
    <path d="M12 8.15V12l2.7 1.7" />
  </LineIcon>,
];

export function ProblemSection() {
  return (
    <>
    <section className="opening-band">
      <div className="container">
        <p className="statement__text opening-band__text">{problem.title}</p>
      </div>
    </section>
    <section className="section section--cream" id={problem.id} aria-labelledby="problem-title">
      <div className="container">
        <WordReveal id="problem-title" text={problem.question} />
        <Reveal>
          <p className="section__intro">{problem.text}</p>
        </Reveal>

        <div className="problem-grid">
          {problem.cards.map((card, index) => (
            <Reveal key={card} delay={index * 60}>
              <article className="editorial-card">
                <span className="editorial-card__icon" aria-hidden="true">
                  {cardIcons[index]}
                </span>
                <h3>{card}</h3>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="section__close">{problem.closing}</p>
        </Reveal>
      </div>
    </section>
    </>
  );
}

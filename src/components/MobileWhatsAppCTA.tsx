import { shift, stickyCta } from "@/content/site";
import { whatsappUrl } from "@/config";
import { trackWhatsApp } from "@/analytics";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useEffect, useState } from "react";

export const QUIZ_ACTIVE_EVENT = "lirrey:quiz-active";

export function MobileWhatsAppCTA() {
  const [heroInView, setHeroInView] = useState(true);
  const [finalInView, setFinalInView] = useState(false);
  const [quizInView, setQuizInView] = useState(false);
  const [quizActive, setQuizActive] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const watch = (id: string, threshold: number, onChange: (visible: boolean) => void) => {
      const target = document.getElementById(id);
      if (!target) return;
      const observer = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { threshold });
      observer.observe(target);
      observers.push(observer);
    };

    // הכפתור הצף מופיע רק אחרי שעוברים את ההירו, שכבר יש בו כפתור משלו.
    watch("top", 0.35, setHeroInView);
    watch("final-cta", 0.35, setFinalInView);
    watch(shift.id, 0.1, setQuizInView);

    const onQuiz = (event: Event) => setQuizActive((event as CustomEvent<boolean>).detail);
    window.addEventListener(QUIZ_ACTIVE_EVENT, onQuiz);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener(QUIZ_ACTIVE_EVENT, onQuiz);
    };
  }, []);

  // באמצע השאלון הכפתור לא מסתיר את התשובות ולא מתחרה בהן.
  const hidden = heroInView || finalInView || (quizActive && quizInView);

  useEffect(() => {
    document.documentElement.classList.toggle("sticky-off", hidden);
  }, [hidden]);

  return (
    <div className={`sticky-wa ${hidden ? "is-hidden" : ""}`}>
      <a
        href={whatsappUrl}
        className="sticky-wa__btn"
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hidden ? -1 : undefined}
        onClick={() => trackWhatsApp("sticky_mobile")}
      >
        <WhatsAppIcon />
        <span className="sticky-wa__action">{stickyCta.action}</span>
        <span className="btn__arrow" aria-hidden="true">
          ←
        </span>
      </a>
    </div>
  );
}

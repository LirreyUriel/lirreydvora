import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { QUIZ_WEBHOOK_URL, whatsappUrl } from "@/config";
import { activeQuestions, quiz, type QuizKey, type QuizOption, type QuizQuestion } from "@/content/quiz";
import { QuizIcon } from "@/components/QuizIcon";
import type { Automation } from "@/content/automations";
import { selectAutomations } from "@/quiz/selectAutomations";

type Answers = Record<QuizKey, string[]>;

const emptyAnswers: Answers = {
  business_type: [],
  pains: [],
  hours: [],
  impact: [],
  channels: [],
  response: [],
  close_rate: [],
  booking_methods: [],
  return_rate: [],
};

// רק תשובות לשאלות שהוצגו נחשבות, גם אם סומנו קודם ואז הכאב שהוביל אליהן בוטל.
function shownAnswers(answers: Answers): Answers {
  const shown = new Set(activeQuestions(answers.pains).map((question) => question.key));
  return Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [key, shown.has(key as QuizKey) ? value : []]),
  ) as Answers;
}

function sendAnswers(payload: Record<string, unknown>) {
  if (!QUIZ_WEBHOOK_URL) return;
  // שליחה ברקע: כישלון לא עוצר את הצגת התוצאה.
  fetch(QUIZ_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}

export function Quiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [otherText, setOtherText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<"" | "required" | "name" | "phone">("");
  const [result, setResult] = useState<Automation[] | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const questions = activeQuestions(answers.pains);
  const detailsStep = questions.length;

  useEffect(() => {
    // לא מזיזים את הפוקוס בטעינת הדף, רק אחרי מעבר בין מסכים.
    if (moved.current) headingRef.current?.focus();
  }, [started, step, result]);

  const goTo = (next: number) => {
    moved.current = true;
    setError("");
    setStep(next);
  };

  const toggle = (question: QuizQuestion, value: string) => {
    setError("");
    setAnswers((current) => {
      const selected = current[question.key];
      if (!question.multiple) return { ...current, [question.key]: [value] };
      if (selected.includes(value)) {
        return { ...current, [question.key]: selected.filter((item) => item !== value) };
      }
      if (question.max && selected.length >= question.max) return current;
      return { ...current, [question.key]: [...selected, value] };
    });
  };

  const onQuestionSubmit = (event: FormEvent) => {
    event.preventDefault();
    const question = questions[step];
    if (question.required && answers[question.key].length === 0) {
      setError("required");
      return;
    }
    goTo(step + 1);
  };

  const onDetailsSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError("name");
    if (!phone.trim()) return setError("phone");

    const shown = shownAnswers(answers);
    const selected = selectAutomations({
      pains: shown.pains,
      response: shown.response,
      channels: shown.channels,
      booking_methods: shown.booking_methods,
    });

    if (!honeypot) {
      sendAnswers({
        business_type: shown.business_type,
        business_type_other: shown.business_type.includes("other") ? otherText.trim() : "",
        pains: shown.pains,
        hours: shown.hours[0] ?? "",
        impact: shown.impact,
        channels: shown.channels,
        response: shown.response,
        close_rate: shown.close_rate[0] ?? "",
        booking_methods: shown.booking_methods,
        return_rate: shown.return_rate[0] ?? "",
        name: name.trim(),
        phone: phone.trim(),
        result_ids: selected.map((automation) => automation.id),
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
      });
    }

    moved.current = true;
    setError("");
    setResult(selected);
  };

  if (result) {
    return (
      <div className="quiz">
        <QuizResult automations={result} answers={shownAnswers(answers)} headingRef={headingRef} />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="quiz quiz--intro">
        <QuizIllustration />
        <h3 className="quiz__intro-title">{quiz.title}</h3>
        <p className="quiz__intro-text">{quiz.subtitle}</p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            moved.current = true;
            setStarted(true);
          }}
        >
          <span className="btn__label">{quiz.start}</span>
          <span className="btn__arrow" aria-hidden="true">
            ←
          </span>
        </button>
      </div>
    );
  }

  // המסך הנוכחי מתוך כל השאלות ומסך הפרטים.
  const progress = ((step + 1) / (questions.length + 1)) * 100;

  return (
    <div className="quiz">
      <div
        className="quiz__bar"
        role="progressbar"
        aria-label="התקדמות בשאלון"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      {step < detailsStep ? (
        <QuestionStep
          key={questions[step].key}
          question={questions[step]}
          selected={answers[questions[step].key]}
          otherText={otherText}
          onOtherText={setOtherText}
          onToggle={toggle}
          error={error === "required"}
          headingRef={headingRef}
          onSubmit={onQuestionSubmit}
          onBack={step > 0 ? () => goTo(step - 1) : undefined}
        />
      ) : (
        <form className="quiz__form" onSubmit={onDetailsSubmit} noValidate>
          <h3 className="quiz__question" ref={headingRef} tabIndex={-1}>
            {quiz.details.title}
          </h3>
          <p className="quiz__privacy">{quiz.details.privacy}</p>

          <div className="quiz__field">
            <label htmlFor="quiz-name">{quiz.details.name}</label>
            <input
              id="quiz-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={error === "name"}
              aria-describedby={error === "name" ? "quiz-name-error" : undefined}
            />
            {error === "name" ? (
              <p className="quiz__error" id="quiz-name-error" role="alert">
                {quiz.details.nameError}
              </p>
            ) : null}
          </div>

          <div className="quiz__field">
            <label htmlFor="quiz-phone">{quiz.details.phone}</label>
            <input
              id="quiz-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              aria-invalid={error === "phone"}
              aria-describedby={error === "phone" ? "quiz-phone-error" : undefined}
            />
            {error === "phone" ? (
              <p className="quiz__error" id="quiz-phone-error" role="alert">
                {quiz.details.phoneError}
              </p>
            ) : null}
          </div>

          <div className="quiz__trap" aria-hidden="true">
            <label htmlFor="quiz-company">Company</label>
            <input
              id="quiz-company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <div className="quiz__nav">
            <button type="button" className="quiz__back" onClick={() => goTo(detailsStep - 1)}>
              {quiz.back}
            </button>
            <button type="submit" className="btn btn--primary">
              <span className="btn__label">{quiz.details.submit}</span>
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

type QuestionStepProps = {
  question: QuizQuestion;
  selected: string[];
  otherText: string;
  onOtherText: (value: string) => void;
  onToggle: (question: QuizQuestion, value: string) => void;
  error: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onSubmit: (event: FormEvent) => void;
  onBack?: () => void;
};

function QuestionStep({
  question,
  selected,
  otherText,
  onOtherText,
  onToggle,
  error,
  headingRef,
  onSubmit,
  onBack,
}: QuestionStepProps) {
  const full = !!question.max && selected.length >= question.max;
  const errorId = `quiz-${question.key}-error`;
  const hintId = `quiz-${question.key}-hint`;
  const cards = question.options.some((option: QuizOption) => option.detail);

  return (
    <form className="quiz__form" onSubmit={onSubmit} noValidate>
      <fieldset
        className="quiz__fieldset"
        aria-describedby={[question.max ? hintId : "", error ? errorId : ""].join(" ").trim() || undefined}
      >
        <legend>
          <h3 className="quiz__question" ref={headingRef} tabIndex={-1}>
            {question.legend}
          </h3>
        </legend>
        {question.max ? (
          <p className="quiz__hint" id={hintId}>
            {quiz.maxNote(question.max)}
          </p>
        ) : null}

        <div className={`quiz__options${cards ? " quiz__options--cards" : ""}`}>
          {question.options.map((option: QuizOption) => {
            const checked = selected.includes(option.value);
            const id = `quiz-${question.key}-${option.value}`;
            if (option.detail) {
              return (
                <label key={option.value} htmlFor={id} className="quiz__card">
                  <input
                    id={id}
                    className="quiz__card-input"
                    type={question.multiple ? "checkbox" : "radio"}
                    name={question.key}
                    value={option.value}
                    checked={checked}
                    disabled={!checked && full}
                    onChange={() => onToggle(question, option.value)}
                  />
                  <span className="quiz__card-icon">
                    <QuizIcon name={option.value} />
                  </span>
                  <span className="quiz__card-text">
                    <strong>{option.label}</strong>
                    <span>{option.detail}</span>
                  </span>
                  <span className="quiz__card-check" aria-hidden="true" />
                </label>
              );
            }
            return (
              <label key={option.value} htmlFor={id} className="quiz__option">
                <input
                  id={id}
                  type={question.multiple ? "checkbox" : "radio"}
                  name={question.key}
                  value={option.value}
                  checked={checked}
                  disabled={!checked && full}
                  onChange={() => onToggle(question, option.value)}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>

        {question.key === "business_type" && selected.includes("other") ? (
          <input
            className="quiz__other"
            type="text"
            aria-label={quiz.otherPlaceholder}
            placeholder={quiz.otherPlaceholder}
            value={otherText}
            onChange={(event) => onOtherText(event.target.value)}
          />
        ) : null}

        {error ? (
          <p className="quiz__error" id={errorId} role="alert">
            {quiz.requiredError}
          </p>
        ) : null}
      </fieldset>

      <div className="quiz__nav">
        {onBack ? (
          <button type="button" className="quiz__back" onClick={onBack}>
            {quiz.back}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn--primary">
          <span className="btn__label">{quiz.next}</span>
          <span className="btn__arrow" aria-hidden="true">
            ←
          </span>
        </button>
      </div>
    </form>
  );
}

type QuizResultProps = {
  automations: Automation[];
  answers: Answers;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
};

function QuizResult({ automations, answers, headingRef }: QuizResultProps) {
  const phrases = Object.keys(quiz.painPhrases)
    .filter((pain) => answers.pains.includes(pain))
    .map((pain) => quiz.painPhrases[pain]);
  const pains = quiz.result.joinPains(phrases);
  const found = automations.length > 0;
  const message = found
    ? `${quiz.result.message} ${quiz.result.messagePains(pains, phrases.length)}`
    : quiz.result.message;
  const href = `${whatsappUrl}?text=${encodeURIComponent(message)}`;

  const hours = quiz.hoursText[answers.hours[0]] ?? "";
  const extra = answers.response.includes("forgotten")
    ? quiz.result.forgotten
    : answers.response.includes("next_day")
      ? quiz.result.nextDay
      : "";

  return (
    <div className="quiz-result">
      <QuizIllustration />
      <h3 className="quiz-result__eyebrow" ref={headingRef} tabIndex={-1}>
        {found ? quiz.result.eyebrow : quiz.result.emptyTitle}
      </h3>

      {found ? (
        <>
          <div className="quiz-result__pain">
            <p>{quiz.result.title(pains, phrases.length, hours)}</p>
            {extra ? <p className="quiz-result__extra">{extra}</p> : null}
          </div>

          <p className="quiz-result__heading">{quiz.result.intro}</p>
          <ol className="quiz-result__list">
            {automations.map((automation, index) => (
              <li
                key={automation.id}
                className="quiz-result__card"
                style={{ "--card-delay": `${index * 120}ms` } as CSSProperties}
              >
                <span className="quiz-result__icon">
                  <QuizIcon name={automation.id} size={26} />
                  <span className="quiz-result__number" aria-hidden="true">
                    {index + 1}
                  </span>
                </span>
                <div className="quiz-result__body">
                  <h4>{automation.name}</h4>
                  <p>{automation.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <div className="quiz__cta">
        <a className="btn btn--primary" href={href} target="_blank" rel="noopener noreferrer">
          <span className="btn__label">{quiz.result.cta}</span>
          <span className="btn__arrow" aria-hidden="true">
            ←
          </span>
        </a>
      </div>
    </div>
  );
}

// איור שקט לפתיחה ולתוצאה: כרטיס משימות שכולן סומנו, וניצוצות.
function QuizIllustration() {
  return (
    <svg className="quiz-art" viewBox="0 0 220 140" aria-hidden="true" focusable="false">
      <ellipse className="quiz-art__blob" cx="110" cy="78" rx="98" ry="56" />
      <rect className="quiz-art__card" x="64" y="20" width="92" height="104" rx="16" />
      {[46, 72, 98].map((y, index) => (
        <g key={y} className="quiz-art__row" style={{ "--row": index } as CSSProperties}>
          <circle className="quiz-art__dot" cx="84" cy={y} r="8" />
          <path className="quiz-art__tick" d={`m80 ${y} 3 3 5-6`} />
          <rect className="quiz-art__line" x="98" y={y - 4} width={index === 1 ? 34 : 44} height="8" rx="4" />
        </g>
      ))}
      <path className="quiz-art__spark" d="M180 26l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
      <path className="quiz-art__spark quiz-art__spark--small" d="M40 52l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      <circle className="quiz-art__spark" cx="172" cy="108" r="3" />
    </svg>
  );
}

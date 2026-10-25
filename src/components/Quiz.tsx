import { useEffect, useRef, useState, type FormEvent } from "react";
import { QUIZ_WEBHOOK_URL, whatsappUrl } from "@/config";
import { activeQuestions, quiz, type QuizKey, type QuizQuestion } from "@/content/quiz";
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
  }, [step, result]);

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
      response: shown.response[0],
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
        response: shown.response[0] ?? "",
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

  // המסך הנוכחי מתוך כל השאלות ומסך הפרטים.
  const progress = ((step + 1) / (questions.length + 1)) * 100;

  return (
    <div className="quiz">
      <h3 className="quiz__title">{quiz.title}</h3>

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

        <div className="quiz__options">
          {question.options.map((option) => {
            const checked = selected.includes(option.value);
            const id = `quiz-${question.key}-${option.value}`;
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
  const lead = automations[0];
  const phrases = Object.keys(quiz.painPhrases)
    .filter((pain) => answers.pains.includes(pain))
    .map((pain) => quiz.painPhrases[pain]);
  const pains = quiz.result.joinPains(phrases);
  const message = lead
    ? `${quiz.result.message} ${quiz.result.messagePains(pains, phrases.length)}`
    : quiz.result.message;
  const href = `${whatsappUrl}?text=${encodeURIComponent(message)}`;

  const hours = quiz.hoursText[answers.hours[0]] ?? "";
  const response = answers.response[0];
  const extra =
    response === "forgotten" ? quiz.result.forgotten : response === "next_day" ? quiz.result.nextDay : "";

  return (
    <div className="quiz__result">
      <h3 className="quiz__result-title" ref={headingRef} tabIndex={-1}>
        {lead ? quiz.result.title(pains, phrases.length, hours) : quiz.result.emptyTitle}
      </h3>

      {lead ? (
        <>
          {extra ? <p className="quiz__summary">{extra}</p> : null}
          <p className="quiz__intro">{quiz.result.intro}</p>
          <ol className="quiz__automations">
            {automations.map((automation, index) => (
              <li key={automation.id} className="quiz__automation">
                <span className="quiz__number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
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

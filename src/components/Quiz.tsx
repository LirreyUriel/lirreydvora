import { useEffect, useRef, useState, type FormEvent } from "react";
import { QUIZ_WEBHOOK_URL, whatsappUrl } from "@/config";
import { quiz, type QuizQuestion } from "@/content/quiz";
import type { Automation } from "@/content/automations";
import { selectAutomations } from "@/quiz/selectAutomations";

type Answers = Record<QuizQuestion["key"], string[]>;

const questions: QuizQuestion[] = quiz.questions;
const DETAILS_STEP = questions.length;
const RESULT_STEP = questions.length + 1;

const emptyAnswers: Answers = {
  business_type: [],
  pains: [],
  hours: [],
  response: [],
  channels: [],
  booking_methods: [],
};

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
  const [contact, setContact] = useState("");
  const [freeText, setFreeText] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<"" | "required" | "name" | "contact">("");
  const [result, setResult] = useState<Automation[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    // לא מזיזים את הפוקוס בטעינת הדף, רק אחרי מעבר בין מסכים.
    if (moved.current) headingRef.current?.focus();
  }, [step]);

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
    if (!contact.trim()) return setError("contact");

    const selected = selectAutomations({
      pains: answers.pains,
      response: answers.response[0],
      channels: answers.channels,
      booking_methods: answers.booking_methods,
    });
    setResult(selected);

    if (!honeypot) {
      sendAnswers({
        business_type: answers.business_type,
        business_type_other: answers.business_type.includes("other") ? otherText.trim() : "",
        pains: answers.pains,
        hours: answers.hours[0] ?? "",
        response: answers.response[0] ?? "",
        channels: answers.channels,
        booking_methods: answers.booking_methods,
        name: name.trim(),
        contact: contact.trim(),
        free_text: freeText.trim(),
        result_ids: selected.map((automation) => automation.id),
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
      });
    }

    goTo(RESULT_STEP);
  };

  const total = questions.length;
  const progress = step < total ? quiz.progress(step + 1, total) : "";

  return (
    <div className="quiz">
      <div className="quiz__head">
        <h3 className="quiz__title">{quiz.title}</h3>
        <p className="quiz__subtitle">{quiz.subtitle}</p>
      </div>

      {step < total ? (
        <div className="quiz__progress">
          <div className="quiz__bar" aria-hidden="true">
            <span style={{ width: `${((step + 1) / total) * 100}%` }} />
          </div>
        </div>
      ) : null}
      <p className="quiz__progress-text" aria-live="polite">
        {progress}
      </p>

      {step < total ? (
        <QuestionStep
          key={step}
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
      ) : null}

      {step === DETAILS_STEP ? (
        <form className="quiz__form" onSubmit={onDetailsSubmit} noValidate>
          <h3 className="quiz__question" ref={headingRef} tabIndex={-1}>
            {quiz.details.title}
          </h3>

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
            <label htmlFor="quiz-contact">{quiz.details.contact}</label>
            <input
              id="quiz-contact"
              type="text"
              dir="auto"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              aria-invalid={error === "contact"}
              aria-describedby={error === "contact" ? "quiz-contact-error" : undefined}
            />
            {error === "contact" ? (
              <p className="quiz__error" id="quiz-contact-error" role="alert">
                {quiz.details.contactError}
              </p>
            ) : null}
          </div>

          <div className="quiz__field">
            <label htmlFor="quiz-free">
              {quiz.details.freeText} <span className="quiz__optional">{quiz.details.optional}</span>
            </label>
            <textarea
              id="quiz-free"
              rows={3}
              value={freeText}
              onChange={(event) => setFreeText(event.target.value)}
            />
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

          <p className="quiz__privacy">{quiz.details.privacy}</p>

          <div className="quiz__nav">
            <button type="button" className="quiz__back" onClick={() => goTo(DETAILS_STEP - 1)}>
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
      ) : null}

      {step === RESULT_STEP ? <QuizResult automations={result} answers={answers} headingRef={headingRef} /> : null}
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
  const stage = automations[0]?.stage;
  const message = stage ? `${quiz.result.message} ${quiz.result.messageStage(stage)}` : quiz.result.message;
  const href = `${whatsappUrl}?text=${encodeURIComponent(message)}`;

  const hours = quiz.hoursText[answers.hours[0]];
  const response = answers.response[0];
  const extra =
    response === "forgotten" ? quiz.result.forgotten : response === "next_day" ? quiz.result.nextDay : "";

  return (
    <div className="quiz__result">
      <h3 className="quiz__question" ref={headingRef} tabIndex={-1}>
        {stage ? quiz.result.title(stage) : quiz.result.emptyTitle}
      </h3>

      {stage ? (
        <>
          {hours ? (
            <p className="quiz__summary">{extra ? `${quiz.result.hours(hours)} ${extra}` : `${quiz.result.hours(hours)}.`}</p>
          ) : null}
          <ol className="quiz__automations">
            {automations.map((automation, index) => (
              <li key={automation.id} className="quiz__automation">
                <h4>{quiz.result.automation(index + 1, automation.name)}</h4>
                <p>{automation.description}</p>
                <dl>
                  <dt>{quiz.result.howItWorks}</dt>
                  <dd>{automation.howItWorks}</dd>
                  <dt>{quiz.result.measure}</dt>
                  <dd>{automation.measure}</dd>
                </dl>
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

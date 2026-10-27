import { useEffect, useRef, useState, type FormEvent } from "react";
import { LEAD_FORM_WEBHOOK_URL, whatsappUrl } from "@/config";
import { leadForm } from "@/content/site";
import { trackLeadForm, trackWhatsApp } from "@/analytics";
import { useInView } from "@/hooks/useInView";

type Field = "name" | "phone" | "business" | "notes";
type FieldError = "" | "name" | "phone" | "phoneInvalid" | "business";
type Status = "idle" | "sending" | "sent" | "failed";

const REQUIRED: Field[] = ["name", "phone", "business"];

// מספר ישראלי (נייח או נייד) הוא 9-10 ספרות, ועם קידומת בינלאומית עד 12.
function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "").length;
}

function firstError(values: Record<Field, string>): FieldError {
  if (!values.name.trim()) return "name";
  if (!values.phone.trim()) return "phone";
  const digits = phoneDigits(values.phone);
  if (digits < 9 || digits > 12) return "phoneInvalid";
  if (!values.business.trim()) return "business";
  return "";
}

// ה-webhook של Airtable חוסם JSON מהדפדפן (CORS), אבל מקבל טופס רגיל בלי בדיקה מקדימה.
// no-cors לא מאפשר לקרוא את התשובה, אז "נשלח" אומר שהבקשה יצאה. כישלון רשת עדיין נתפס.
async function sendLead(payload: Record<string, string>) {
  await fetch(LEAD_FORM_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams(payload),
    keepalive: true,
  });
}

export function LeadForm() {
  const { ref } = useInView<HTMLElement>(() => trackLeadForm("lead_form_view"));
  const [values, setValues] = useState<Record<Field, string>>({ name: "", phone: "", business: "", notes: "" });
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<FieldError>("");
  const [status, setStatus] = useState<Status>("idle");
  const successRef = useRef<HTMLHeadingElement>(null);

  // מה קרה בטופס עד עכשיו, בשביל לוג הנטישה. ref ולא state, כי לא צריך לרנדר מחדש.
  const startedAt = useRef<number | null>(null);
  const lastField = useRef<Field | "">("");
  const completed = useRef(new Set<Field>());
  const attempts = useRef(0);
  const done = useRef(false);

  const fieldError = (field: Field) =>
    error === field || (field === "phone" && error === "phoneInvalid") ? error : "";

  // נטישה: מי שהתחיל למלא ויצא מהעמוד בלי לשלוח. נרשם פעם אחת, עם השדה האחרון שנגע בו.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== "hidden" || startedAt.current === null || done.current) return;
      done.current = true;
      trackLeadForm("lead_form_abandon", {
        last_field: lastField.current,
        fields_completed: completed.current.size,
        submit_attempts: attempts.current,
        seconds_in_form: Math.round((Date.now() - startedAt.current) / 1000),
      });
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const onFocus = (field: Field) => {
    lastField.current = field;
    if (startedAt.current === null) {
      startedAt.current = Date.now();
      trackLeadForm("lead_form_start", { field });
    }
  };

  const onBlur = (field: Field) => {
    if (!values[field].trim() || completed.current.has(field)) return;
    completed.current.add(field);
    trackLeadForm("lead_form_field_complete", {
      field,
      required: REQUIRED.includes(field) ? 1 : 0,
      fields_completed: completed.current.size,
    });
  };

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (fieldError(field)) setError("");
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    attempts.current += 1;

    const problem = firstError(values);
    if (problem) {
      setError(problem);
      trackLeadForm("lead_form_error", {
        field: problem === "phoneInvalid" ? "phone" : problem,
        reason: problem === "phoneInvalid" ? "invalid" : "missing",
        attempt: attempts.current,
      });
      document.getElementById(`lead-${problem === "phoneInvalid" ? "phone" : problem}`)?.focus();
      return;
    }

    const seconds = startedAt.current === null ? 0 : Math.round((Date.now() - startedAt.current) / 1000);
    // השליחה נרשמת תמיד, כי מילוי אוטומטי של הדפדפן יכול למלא גם את שדה המלכודת.
    // trap_filled מסמן שליחה כזו, כדי שאפשר יהיה לסנן אותה ב-GA.
    trackLeadForm("lead_form_submit", {
      has_notes: values.notes.trim() ? 1 : 0,
      seconds_to_submit: seconds,
      attempt: attempts.current,
      trap_filled: honeypot ? 1 : 0,
    });
    done.current = true;

    if (honeypot) {
      setStatus("sent");
      return;
    }

    setError("");
    setStatus("sending");
    try {
      await sendLead({
        name: values.name.trim(),
        phone: values.phone.trim(),
        business: values.business.trim(),
        notes: values.notes.trim(),
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
      });
      trackLeadForm("lead_form_sent", { seconds_to_submit: seconds });
      setStatus("sent");
    } catch (failure) {
      trackLeadForm("lead_form_send_failed", {
        reason: failure instanceof Error ? failure.name : "unknown",
        online: navigator.onLine ? 1 : 0,
      });
      done.current = false;
      setStatus("failed");
    }
  };

  return (
    <section ref={ref} className="section section--beige" id={leadForm.id} aria-labelledby="lead-form-title">
      <div className="container">
        <div className="lead-form">
          {status === "sent" ? (
            <div className="lead-form__success" role="status">
              <h2 className="lead-form__title" ref={successRef} tabIndex={-1}>
                {leadForm.successTitle}
              </h2>
              <p>{leadForm.successText}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h2 id="lead-form-title" className="lead-form__title">
                {leadForm.title}
              </h2>

              <div className="lead-form__grid">
                <TextField
                  field="name"
                  label={leadForm.name}
                  autoComplete="name"
                  value={values.name}
                  error={fieldError("name") && leadForm.errors.name}
                  onChange={update}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <TextField
                  field="phone"
                  label={leadForm.phone}
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  error={
                    fieldError("phone") &&
                    (error === "phoneInvalid" ? leadForm.errors.phoneInvalid : leadForm.errors.phone)
                  }
                  onChange={update}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <TextField
                  field="business"
                  label={leadForm.business}
                  value={values.business}
                  error={fieldError("business") && leadForm.errors.business}
                  onChange={update}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  wide
                />
                <div className="quiz__field lead-form__wide">
                  <label htmlFor="lead-notes">{leadForm.notes}</label>
                  <textarea
                    id="lead-notes"
                    rows={3}
                    value={values.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    onFocus={() => onFocus("notes")}
                    onBlur={() => onBlur("notes")}
                  />
                </div>
              </div>

              <div className="quiz__trap" aria-hidden="true">
                <label htmlFor="lead-company">Company</label>
                <input
                  id="lead-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              {status === "failed" ? (
                <div className="lead-form__failed" role="alert">
                  <p>
                    {leadForm.failText}{" "}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("lead_form")}>
                      {leadForm.failLink}
                    </a>
                  </p>
                </div>
              ) : null}

              <button type="submit" className="btn btn--primary lead-form__submit" disabled={status === "sending"}>
                <span className="btn__label">{status === "sending" ? leadForm.sending : leadForm.submit}</span>
                <span className="btn__arrow" aria-hidden="true">
                  ←
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

type TextFieldProps = {
  field: Field;
  label: string;
  value: string;
  error: string | false;
  onChange: (field: Field, value: string) => void;
  onFocus: (field: Field) => void;
  onBlur: (field: Field) => void;
  type?: "text" | "tel";
  autoComplete?: string;
  wide?: boolean;
};

function TextField({
  field,
  label,
  value,
  error,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  autoComplete,
  wide,
}: TextFieldProps) {
  const id = `lead-${field}`;
  return (
    <div className={`quiz__field${wide ? " lead-form__wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        inputMode={type === "tel" ? "tel" : undefined}
        dir={type === "tel" ? "ltr" : undefined}
        autoComplete={autoComplete}
        required
        aria-required="true"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        onFocus={() => onFocus(field)}
        onBlur={() => onBlur(field)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p className="quiz__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

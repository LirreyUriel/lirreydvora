import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { pickFile, uploadCover, uploadImage } from "./images";
import {
  blank,
  hints,
  isMediaField,
  labels,
  matches,
  optionalFor,
  shapesFor,
  technicalKeys,
  type Json,
  type JsonObject,
} from "./schema";

type Path = (string | number)[];

export type EditorTools = {
  // פותח את ספריית התמונות ומחזיר את הנתיב שנבחר.
  pickImage: () => Promise<string | null>;
  notify: (text: string, kind?: "ok" | "error") => void;
  refreshImages: () => void;
};

export const ToolsContext = createContext<EditorTools>({
  pickImage: async () => null,
  notify: () => {},
  refreshImages: () => {},
});

const label = (key: string | number) => (typeof key === "number" ? `#${key + 1}` : (labels[key] ?? key));

const isFigure = (value: Json): value is JsonObject =>
  !!value && typeof value === "object" && !Array.isArray(value) && "src" in value && "width" in value && "height" in value;

// תקציר קצר של פריט, לכותרת של כרטיס מקופל.
export function preview(value: Json): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (!value) return "";
  if (Array.isArray(value)) return value.map(preview).find(Boolean) ?? "";
  for (const key of ["title", "label", "question", "q", "legend", "name", "heading", "lead", "text", "event", "less", "alt"]) {
    const v = value[key];
    if (typeof v === "string" && v) return v;
  }
  if (value.figure && typeof value.figure === "object" && !Array.isArray(value.figure)) return `🖼 ${value.figure.alt || value.figure.src || "תמונה"}`;
  return Object.values(value).map(preview).find(Boolean) ?? "";
}

function AutoTextarea({ value, onChange, dir }: { value: string; onChange: (v: string) => void; dir?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return <textarea ref={ref} rows={1} dir={dir} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function FieldShell({
  name,
  hint,
  children,
  actions,
  technical,
}: {
  name: string | number;
  hint?: string;
  children: ReactNode;
  actions?: ReactNode;
  technical?: boolean;
}) {
  return (
    <div className={`field${technical ? " field--technical" : ""}`}>
      {typeof name === "string" ? (
        <div className="field__label">
          <span>{label(name)}</span>
          {actions}
        </div>
      ) : null}
      {children}
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  );
}

function TextField({ name, value, onChange }: { name: string | number; value: string; onChange: (v: Json) => void }) {
  const key = String(name);
  const technical = technicalKeys.has(key);
  const long = value.length > 60 || ["text", "description", "excerpt", "a", "bio", "note", "detail"].includes(key);
  const dir = technical || /^(\/|https?:|[a-z0-9_-]+$)/i.test(value) ? "ltr" : undefined;
  let hint = hints[key];
  if (key === "seoTitle" || key === "description") hint = `${hint} עכשיו: ${value.length} תווים.`;
  return (
    <FieldShell name={name} hint={hint} technical={technical}>
      {long ? (
        <AutoTextarea value={value} onChange={onChange} dir={dir} />
      ) : (
        <input type="text" dir={dir} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </FieldShell>
  );
}

function MediaField({ name, value, onChange, onDims }: { name: string | number; value: string; onChange: (v: Json) => void; onDims?: (src: string, w: number, h: number) => void }) {
  const tools = useContext(ToolsContext);
  const [busy, setBusy] = useState(false);
  const isVideo = /\.(mp4|webm)$/i.test(value);

  async function upload() {
    const file = await pickFile();
    if (!file) return;
    setBusy(true);
    try {
      const dir = value.startsWith("/images/") ? value.slice(8).split("/").slice(0, -1).join("/") || "uploads" : "uploads";
      const res = await uploadImage(file, dir);
      if (onDims) onDims(res.path, res.width, res.height);
      else onChange(res.path);
      tools.refreshImages();
      tools.notify("התמונה הועלתה");
    } catch (error) {
      tools.notify((error as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function choose() {
    const path = await tools.pickImage();
    if (!path) return;
    if (!onDims) return onChange(path);
    const img = new Image();
    img.onload = () => onDims(path, img.naturalWidth, img.naturalHeight);
    img.onerror = () => onChange(path);
    img.src = path;
  }

  return (
    <FieldShell name={name}>
      <div className="media">
        <div className="media__thumb">
          {value && !value.endsWith("/") ? (
            isVideo ? <video src={value} muted /> : <img src={value} alt="" onError={(e) => (e.currentTarget.style.opacity = "0.15")} />
          ) : (
            <span>אין תמונה</span>
          )}
        </div>
        <div className="media__side">
          <input type="text" dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} />
          {!isVideo ? (
            <div className="media__buttons">
              <button type="button" className="btn btn--small" onClick={upload} disabled={busy}>
                {busy ? "מעלה…" : "העלאת תמונה"}
              </button>
              <button type="button" className="btn btn--small btn--ghost" onClick={choose}>
                בחירה מהספרייה
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </FieldShell>
  );
}

function CoverTools({ value, onChange, slug }: { value: JsonObject; onChange: (v: Json) => void; slug: string }) {
  const tools = useContext(ToolsContext);
  const [busy, setBusy] = useState(false);
  async function upload() {
    const file = await pickFile();
    if (!file) return;
    setBusy(true);
    try {
      const res = await uploadCover(file, slug || file.name);
      onChange({ ...value, ...res });
      tools.refreshImages();
      tools.notify("הכריכה הועלתה בשלושה גדלים");
    } catch (error) {
      tools.notify((error as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="cover-tools">
      <button type="button" className="btn" onClick={upload} disabled={busy}>
        {busy ? "מכינה את הכריכה…" : "העלאת כריכה חדשה"}
      </button>
      <p className="field__hint">
        תמונה אחת מספיקה: היא נחתכת מהמרכז ליחס 1200×630 ונשמרת אוטומטית בשלושת הגדלים (גדולה, 800px ותמונת שיתוף).
      </p>
    </div>
  );
}

function ObjectField({ name, value, path, onChange, root }: { name: string | number; value: JsonObject; path: Path; onChange: (v: Json) => void; root?: JsonObject }) {
  const optional = optionalFor(path);
  const missing = Object.keys(optional).filter((key) => !(key in value));
  const isCover = matches(path, "articles.articles.*.cover");
  const figure = isFigure(value);

  const body = (
    <>
      {isCover ? <CoverTools value={value} onChange={onChange} slug={String(root?.slug ?? "")} /> : null}
      {Object.entries(value).map(([key, child]) => (
        <Field
          key={key}
          name={key}
          value={child}
          path={[...path, key]}
          root={root}
          onChange={(v) => onChange({ ...value, [key]: v })}
          onDims={
            figure && key === "src"
              ? (src, w, h) => onChange({ ...value, src, width: w, height: h })
              : undefined
          }
          onRemove={
            key in optional
              ? () => {
                  const next = { ...value };
                  delete next[key];
                  onChange(next);
                }
              : undefined
          }
        />
      ))}
      {missing.length ? (
        <div className="optional">
          {missing.map((key) => (
            <button key={key} type="button" className="btn btn--small btn--ghost" onClick={() => onChange({ ...value, [key]: optional[key] })}>
              + {label(key)}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );

  if (typeof name === "number" || path.length <= 2) return <div className="object">{body}</div>;
  return (
    <fieldset className="object object--nested">
      <legend>{label(name)}</legend>
      {body}
    </fieldset>
  );
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ArrayField({ name, value, path, onChange, root }: { name: string | number; value: Json[]; path: Path; onChange: (v: Json) => void; root?: JsonObject }) {
  const shapes = shapesFor(path);
  const simple = value.every((item) => typeof item === "string" && item.length < 120) && !shapes;
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const template: Json = value.length ? blank(value[value.length - 1]) : "";

  const add = (item: Json) => {
    onChange([...value, item]);
    setOpen((o) => ({ ...o, [value.length]: true }));
  };

  const controls = (i: number) => (
    <span className="item__controls">
      <button type="button" title="למעלה" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))}>↑</button>
      <button type="button" title="למטה" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))}>↓</button>
      <button type="button" title="שכפול" onClick={() => onChange([...value.slice(0, i + 1), structuredClone(value[i]), ...value.slice(i + 1)])}>⧉</button>
      <button
        type="button"
        title="מחיקת הפריט"
        className="item__delete"
        onClick={() => {
          if (typeof value[i] === "string" && !value[i]) return onChange(value.filter((_, j) => j !== i));
          if (confirm("למחוק את הפריט?")) onChange(value.filter((_, j) => j !== i));
        }}
      >
        מחיקה
      </button>
    </span>
  );

  const addButtons = shapes ? (
    shapes.map((shape) => (
      <button key={shape.label} type="button" className="btn btn--small btn--ghost" onClick={() => add(structuredClone(shape.value))}>
        + {shape.label}
      </button>
    ))
  ) : (
    <button type="button" className="btn btn--small btn--ghost" onClick={() => add(template)}>
      + הוספה
    </button>
  );

  return (
    <FieldShell name={typeof name === "string" && path.length > 2 ? name : 0} hint={typeof name === "string" ? hints[name] : undefined}>
      {simple ? (
        <div className="list">
          {value.map((item, i) => (
            <div className="list__row" key={i}>
              <input type="text" value={item as string} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} />
              {controls(i)}
            </div>
          ))}
        </div>
      ) : (
        <div className="items">
          {value.map((item, i) => {
            const isOpen = open[i] ?? value.length <= 1;
            return (
              <div className={`item${isOpen ? " item--open" : ""}`} key={i}>
                <div className="item__head">
                  <button type="button" className="item__toggle" onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}>
                    <span className="item__chevron">{isOpen ? "▾" : "◂"}</span>
                    <span className="item__num">{i + 1}</span>
                    <span className="item__title">{preview(item) || "(ריק)"}</span>
                  </button>
                  {controls(i)}
                </div>
                {isOpen ? (
                  <div className="item__body">
                    <Field name={i} value={item} path={[...path, i]} root={root} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      <div className="add-row">{addButtons}</div>
    </FieldShell>
  );
}

export function Field({
  name,
  value,
  path,
  onChange,
  onRemove,
  onDims,
  root,
}: {
  name: string | number;
  value: Json;
  path: Path;
  onChange: (v: Json) => void;
  onRemove?: () => void;
  onDims?: (src: string, w: number, h: number) => void;
  root?: JsonObject;
}) {
  let inner: ReactNode;
  if (isMediaField(name, value)) inner = <MediaField name={name} value={value as string} onChange={onChange} onDims={onDims} />;
  else if (typeof value === "string") inner = <TextField name={name} value={value} onChange={onChange} />;
  else if (typeof value === "number")
    inner = (
      <FieldShell name={name} hint={hints[String(name)]} technical={technicalKeys.has(String(name))}>
        <input type="number" dir="ltr" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </FieldShell>
    );
  else if (typeof value === "boolean")
    inner = (
      <label className="check">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label(name)}</span>
      </label>
    );
  else if (Array.isArray(value)) inner = <ArrayField name={name} value={value} path={path} onChange={onChange} root={root} />;
  else if (value && typeof value === "object") inner = <ObjectField name={name} value={value} path={path} onChange={onChange} root={root} />;
  else inner = null;

  if (!onRemove) return inner;
  return (
    <div className="removable">
      {inner}
      <button type="button" className="removable__btn" title="הסרת השדה" onClick={onRemove}>
        הסרה
      </button>
    </div>
  );
}

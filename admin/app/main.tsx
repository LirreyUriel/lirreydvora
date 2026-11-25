import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/rubik/wght.css";
import "./admin.css";
import { api, type Content, type ImageFile, type Status } from "./api";
import { Field, ToolsContext, type EditorTools } from "./fields";
import { pickFile, slugify, uploadImage } from "./images";
import { allSections, groups, newArticle, type FileName, type Json, type JsonObject } from "./schema";

type View = { kind: "section"; id: string } | { kind: "article"; index: number } | { kind: "images" } | { kind: "publish" };
type Toast = { id: number; text: string; kind: "ok" | "error" };

const FILES: FileName[] = ["site", "articles", "automations", "quiz"];

function getAt(obj: Json, path: (string | number)[]): Json {
  return path.reduce<Json>((node, key) => (node as Record<string, Json>)[key as string], obj);
}

function setAt(obj: Json, path: (string | number)[], value: Json): Json {
  if (!path.length) return value;
  const [key, ...rest] = path;
  if (Array.isArray(obj)) return obj.map((item, i) => (i === key ? setAt(item, rest, value) : item));
  const record = obj as JsonObject;
  return { ...record, [key]: setAt(record[key as string], rest, value) };
}

type Article = JsonObject & { slug: string; title: string; date: string; cover: JsonObject };

function validate(content: Content): string | null {
  const articles = content.articles.articles as Article[];
  const seen = new Set<string>();
  for (const article of articles) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(article.slug)) return `הכתובת (slug) "${article.slug}" לא תקינה. רק אותיות לטיניות קטנות, ספרות ומקפים.`;
    if (seen.has(article.slug)) return `יש שני פרויקטים עם אותה כתובת: ${article.slug}`;
    seen.add(article.slug);
    if (!article.title.trim()) return `לפרויקט ${article.slug} אין כותרת`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date)) return `תאריך לא תקין בפרויקט ${article.slug}: ${article.date}`;
    if (!String(article.cover.og).endsWith(".jpg")) return `תמונת השיתוף של ${article.slug} חייבת להיות JPG`;
  }
  return null;
}

function ImageGrid({ images, onPick, filter }: { images: ImageFile[]; onPick: (path: string) => void; filter: string }) {
  const shown = images.filter((img) => img.path.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="grid">
      {shown.map((img) => (
        <button key={img.path} type="button" className="grid__item" onClick={() => onPick(img.path)} title={img.path}>
          <img src={img.path} alt="" loading="lazy" />
          <span dir="ltr">{img.path.replace("/images/", "")}</span>
          <small>{Math.round(img.size / 1024)}KB</small>
        </button>
      ))}
      {!shown.length ? <p className="muted">לא נמצאו תמונות</p> : null}
    </div>
  );
}

function App() {
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [view, setView] = useState<View>({ kind: "section", id: "hero" });
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [preview, setPreview] = useState<"off" | "desktop" | "mobile">("desktop");
  const [picker, setPicker] = useState<{ resolve: (path: string | null) => void } | null>(null);
  const [filter, setFilter] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [newProject, setNewProject] = useState<{ title: string; slug: string } | null>(null);
  const [publishMessage, setPublishMessage] = useState("");
  const [publishLog, setPublishLog] = useState<{ ok: boolean; text: string } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);

  const notify = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, text, kind }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === "error" ? 7000 : 3000);
  }, []);

  const refreshImages = useCallback(() => {
    api.images().then(setImages, () => {});
  }, []);
  const refreshStatus = useCallback(() => {
    api.status().then(setStatus, () => {});
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await api.content();
      setContent(data);
      setSaved(Object.fromEntries(FILES.map((f) => [f, JSON.stringify(data[f])])));
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
    refreshImages();
    refreshStatus();
  }, [load, refreshImages, refreshStatus]);

  const dirtyFiles = useMemo(
    () => (content ? FILES.filter((f) => JSON.stringify(content[f]) !== saved[f]) : []),
    [content, saved],
  );
  const dirty = dirtyFiles.length > 0;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = useCallback(async () => {
    if (!content || !dirty || saving) return true;
    const problem = validate(content);
    if (problem) {
      notify(problem, "error");
      return false;
    }
    setSaving(true);
    try {
      for (const file of dirtyFiles) {
        await api.save(file, content[file]);
        setSaved((s) => ({ ...s, [file]: JSON.stringify(content[file]) }));
      }
      notify("נשמר. התצוגה המקדימה מתעדכנת.");
      refreshStatus();
      return true;
    } catch (error) {
      notify(`השמירה נכשלה: ${(error as Error).message}`, "error");
      return false;
    } finally {
      setSaving(false);
    }
  }, [content, dirty, dirtyFiles, saving, notify, refreshStatus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const tools: EditorTools = useMemo(
    () => ({
      pickImage: () =>
        new Promise((resolve) => {
          refreshImages();
          setFilter("");
          setPicker({ resolve });
        }),
      notify,
      refreshImages,
    }),
    [notify, refreshImages],
  );

  const update = (file: FileName, path: (string | number)[], value: Json) =>
    setContent((c) => (c ? { ...c, [file]: setAt(c[file], path, value) as JsonObject } : c));

  if (loadError)
    return (
      <div className="center">
        <h1>לא הצלחתי לטעון את התוכן</h1>
        <p>{loadError}</p>
        <p className="muted">ממשק הניהול עובד רק כשהאתר רץ במחשב הזה עם npm run dev.</p>
      </div>
    );
  if (!content) return <div className="center">טוען…</div>;

  const articles = content.articles.articles as Article[];
  const section = view.kind === "section" ? allSections.find((s) => s.id === view.id) : undefined;
  const article = view.kind === "article" ? articles[view.index] : undefined;
  const previewPath = section?.preview ?? (article ? `/articles/${article.slug}/` : "/");
  const pending = (status?.changes.length ?? 0) + (status?.unpushed ?? 0);

  const go = (next: View) => {
    setView(next);
    setNavOpen(false);
    document.querySelector(".editor")?.scrollTo({ top: 0 });
  };

  const moveArticle = (from: number, to: number) => {
    const next = [...articles];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update("articles", ["articles"], next);
    setView({ kind: "article", index: to });
  };

  const createProject = () => {
    if (!newProject) return;
    const slug = slugify(newProject.slug || newProject.title);
    if (!newProject.title.trim()) return notify("צריך כותרת", "error");
    if (articles.some((a) => a.slug === slug)) return notify("כבר יש פרויקט עם הכתובת הזו", "error");
    update("articles", ["articles"], [newArticle(slug, newProject.title.trim()), ...articles]);
    setNewProject(null);
    go({ kind: "article", index: 0 });
    notify("נוצר פרויקט חדש בראש הרשימה. אל תשכחי לשמור.");
  };

  const publish = async () => {
    if (dirty && !(await save())) return;
    setPublishing(true);
    setPublishLog(null);
    try {
      const res = await api.publish(publishMessage.trim() || "עדכון תוכן מממשק הניהול");
      setPublishLog({ ok: true, text: res.log.filter(Boolean).join("\n\n") });
      setPublishMessage("");
      notify("פורסם! Vercel יבנה את האתר בדקות הקרובות.");
    } catch (error) {
      const err = error as Error & { body?: { log?: string[] } };
      setPublishLog({ ok: false, text: [err.message, ...(err.body?.log ?? [])].filter(Boolean).join("\n\n") });
    } finally {
      setPublishing(false);
      refreshStatus();
    }
  };

  return (
    <ToolsContext.Provider value={tools}>
      <div className={`shell preview-${preview}`}>
        <header className="topbar">
          <button type="button" className="topbar__menu" onClick={() => setNavOpen((o) => !o)} aria-label="תפריט">
            ☰
          </button>
          <div className="topbar__brand">
            <img src="/favicon.svg" alt="" />
            <span>ניהול האתר</span>
          </div>
          <div className="topbar__state">
            {saving ? "שומרת…" : dirty ? <span className="dot dot--warn">יש שינויים שלא נשמרו</span> : <span className="dot">הכל שמור</span>}
          </div>
          <div className="topbar__actions">
            <div className="seg" role="group" aria-label="תצוגה מקדימה">
              <button type="button" className={preview === "desktop" ? "on" : ""} onClick={() => setPreview("desktop")}>מחשב</button>
              <button type="button" className={preview === "mobile" ? "on" : ""} onClick={() => setPreview("mobile")}>נייד</button>
              <button type="button" className={preview === "off" ? "on" : ""} onClick={() => setPreview("off")}>בלי</button>
            </div>
            {dirty ? (
              <button type="button" className="btn btn--ghost" onClick={() => confirm("לבטל את כל השינויים שלא נשמרו?") && load()}>
                ביטול שינויים
              </button>
            ) : null}
            <button type="button" className="btn" onClick={save} disabled={!dirty || saving} title="Ctrl+S">
              שמירה
            </button>
            <button type="button" className="btn btn--gold" onClick={() => go({ kind: "publish" })}>
              פרסום לאתר{pending ? <span className="badge">{pending}</span> : null}
            </button>
          </div>
        </header>

        <nav className={`nav${navOpen ? " nav--open" : ""}`}>
          <div className="nav__group">
            <div className="nav__title">פרויקטים</div>
            <button type="button" className="nav__add" onClick={() => setNewProject({ title: "", slug: "" })}>
              + פרויקט חדש
            </button>
            {articles.map((a, i) => (
              <button
                key={`${a.slug}-${i}`}
                type="button"
                className={`nav__item nav__item--project${view.kind === "article" && view.index === i ? " active" : ""}`}
                onClick={() => go({ kind: "article", index: i })}
              >
                {a.cover?.small ? <img src={String(a.cover.small)} alt="" /> : <span className="nav__noimg" />}
                <span>{a.title || a.slug || "(בלי כותרת)"}</span>
              </button>
            ))}
          </div>
          {groups.map((group) => (
            <div className="nav__group" key={group.title}>
              <div className="nav__title">{group.title}</div>
              {group.sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`nav__item${view.kind === "section" && view.id === s.id ? " active" : ""}`}
                  onClick={() => go({ kind: "section", id: s.id })}
                >
                  {s.title}
                </button>
              ))}
            </div>
          ))}
          <div className="nav__group">
            <div className="nav__title">קבצים</div>
            <button type="button" className={`nav__item${view.kind === "images" ? " active" : ""}`} onClick={() => go({ kind: "images" })}>
              ספריית תמונות
            </button>
          </div>
        </nav>

        <main className="editor">
          {section ? (
            <>
              <div className="editor__head">
                <h1>{section.title}</h1>
                {section.hint ? <p className="muted">{section.hint}</p> : null}
              </div>
              <div className="card">
                <Field
                  name={section.path[section.path.length - 1]}
                  value={getAt(content[section.file], section.path)}
                  path={[section.file, ...section.path]}
                  onChange={(v) => update(section.file, section.path, v)}
                />
              </div>
            </>
          ) : null}

          {article && view.kind === "article" ? (
            <>
              <div className="editor__head editor__head--row">
                <div>
                  <h1>{article.title || "(בלי כותרת)"}</h1>
                  <p className="muted" dir="ltr">/articles/{article.slug}/</p>
                </div>
                <div className="editor__tools">
                  <button type="button" className="btn btn--small btn--ghost" disabled={view.index === 0} onClick={() => moveArticle(view.index, view.index - 1)}>
                    ↑ קדימה ברשימה
                  </button>
                  <button type="button" className="btn btn--small btn--ghost" disabled={view.index === articles.length - 1} onClick={() => moveArticle(view.index, view.index + 1)}>
                    ↓ אחורה ברשימה
                  </button>
                  <a className="btn btn--small btn--ghost" href={`/articles/${article.slug}/`} target="_blank" rel="noreferrer">
                    פתיחה בלשונית
                  </a>
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    onClick={() => {
                      if (!confirm(`למחוק את הפרויקט "${article.title}"? (התמונות נשארות בספרייה)`)) return;
                      update("articles", ["articles"], articles.filter((_, i) => i !== view.index));
                      go({ kind: "section", id: "articlesPage" });
                    }}
                  >
                    מחיקה
                  </button>
                </div>
              </div>
              <p className="muted small">
                הסדר ברשימה הוא הסדר באתר: הראשונים מוצגים גם בדף הבית. {view.index < Number(content.articles.projectsTeaser && (content.articles.projectsTeaser as JsonObject).count) ? "הפרויקט הזה מוצג בדף הבית." : ""}
              </p>
              <div className="card">
                <Field
                  key={view.index}
                  name={view.index}
                  value={article}
                  root={article}
                  path={["articles", "articles", view.index]}
                  onChange={(v) => update("articles", ["articles", view.index], v)}
                />
              </div>
            </>
          ) : null}

          {view.kind === "images" ? (
            <>
              <div className="editor__head editor__head--row">
                <div>
                  <h1>ספריית תמונות</h1>
                  <p className="muted">לחיצה על תמונה מעתיקה את הנתיב שלה. תמונות חדשות נשמרות ב-public/images/uploads.</p>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={async () => {
                    const file = await pickFile();
                    if (!file) return;
                    try {
                      const res = await uploadImage(file, "uploads");
                      refreshImages();
                      refreshStatus();
                      navigator.clipboard?.writeText(res.path).catch(() => {});
                      notify(`הועלתה: ${res.path} (הנתיב הועתק)`);
                    } catch (error) {
                      notify((error as Error).message, "error");
                    }
                  }}
                >
                  העלאת תמונה
                </button>
              </div>
              <input className="search" type="search" placeholder="חיפוש לפי שם קובץ…" value={filter} onChange={(e) => setFilter(e.target.value)} />
              <ImageGrid
                images={images}
                filter={filter}
                onPick={(path) => {
                  navigator.clipboard?.writeText(path).then(() => notify(`הועתק: ${path}`), () => notify(path));
                }}
              />
            </>
          ) : null}

          {view.kind === "publish" ? (
            <>
              <div className="editor__head">
                <h1>פרסום לאתר</h1>
                <p className="muted">
                  השינויים נשמרים קודם במחשב שלך. פרסום שולח אותם ל-GitHub, ו-Vercel בונה ומעלה את האתר המעודכן תוך דקה-שתיים.
                </p>
              </div>
              <div className="card">
                {dirty ? <p className="warn">יש שינויים שעוד לא נשמרו. הם יישמרו אוטומטית לפני הפרסום.</p> : null}
                <h3>מה ממתין לפרסום</h3>
                {status && (status.changes.length || status.unpushed) ? (
                  <ul className="changes" dir="ltr">
                    {status.changes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                    {status.unpushed ? <li>+ {status.unpushed} שמירות שעוד לא נשלחו ל-GitHub</li> : null}
                  </ul>
                ) : (
                  <p className="muted">{dirty ? "השינויים יופיעו כאן אחרי שמירה." : "אין שינויים שממתינים לפרסום."}</p>
                )}
                <div className="field">
                  <div className="field__label">תיאור קצר של השינוי (לא חובה)</div>
                  <input type="text" value={publishMessage} placeholder="למשל: הוספתי פרויקט חדש" onChange={(e) => setPublishMessage(e.target.value)} />
                </div>
                <button type="button" className="btn btn--gold btn--big" onClick={publish} disabled={publishing || (!dirty && !pending)}>
                  {publishing ? "מפרסמת…" : "פרסום עכשיו"}
                </button>
                {publishLog?.ok ? <p className="success">פורסם בהצלחה. האתר יתעדכן אחרי ש-Vercel יסיים לבנות אותו, בדרך כלל תוך דקה-שתיים.</p> : null}
                {publishLog ? (
                  <details className="log-wrap" open={!publishLog.ok}>
                    <summary>{publishLog.ok ? "פרטים טכניים" : "הפרסום נכשל. פרטים:"}</summary>
                    <pre className={`log${publishLog.ok ? "" : " log--error"}`} dir="ltr">{publishLog.text}</pre>
                  </details>
                ) : null}
                <p className="muted small">
                  מתפרסמים רק קובצי התוכן (src/content/data) והתמונות (public/images). שינויי קוד אחרים לא נכללים.
                </p>
              </div>
            </>
          ) : null}
        </main>

        {preview !== "off" ? (
          <aside className="preview">
            <div className="preview__bar">
              <span dir="ltr">{previewPath}</span>
              <button type="button" className="btn btn--small btn--ghost" onClick={() => iframe.current?.contentWindow?.location.reload()}>
                רענון
              </button>
            </div>
            <div className="preview__frame">
              <iframe ref={iframe} key={previewPath} src={previewPath} title="תצוגה מקדימה" />
            </div>
          </aside>
        ) : null}

        {picker ? (
          <div className="modal" onClick={() => (picker.resolve(null), setPicker(null))}>
            <div className="modal__box modal__box--wide" onClick={(e) => e.stopPropagation()}>
              <div className="modal__head">
                <h2>בחירת תמונה</h2>
                <button type="button" className="btn btn--small btn--ghost" onClick={() => (picker.resolve(null), setPicker(null))}>
                  סגירה
                </button>
              </div>
              <input className="search" type="search" autoFocus placeholder="חיפוש לפי שם קובץ…" value={filter} onChange={(e) => setFilter(e.target.value)} />
              <ImageGrid images={images} filter={filter} onPick={(path) => (picker.resolve(path), setPicker(null))} />
            </div>
          </div>
        ) : null}

        {newProject ? (
          <div className="modal" onClick={() => setNewProject(null)}>
            <form
              className="modal__box"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                createProject();
              }}
            >
              <h2>פרויקט חדש</h2>
              <div className="field">
                <div className="field__label">כותרת</div>
                <input type="text" autoFocus value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
              </div>
              <div className="field field--technical">
                <div className="field__label">כתובת באנגלית (slug)</div>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="yoga-studio-booking"
                  value={newProject.slug}
                  onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                />
                <p className="field__hint" dir="ltr">lirrey.com/articles/{slugify(newProject.slug || "...")}/</p>
              </div>
              <div className="modal__actions">
                <button type="submit" className="btn btn--gold" disabled={!newProject.slug.trim() || !newProject.title.trim()}>
                  יצירה
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setNewProject(null)}>
                  ביטול
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="toasts">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast--${t.kind}`}>
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </ToolsContext.Provider>
  );
}

// בעדכון חם של הקובץ משתמשים באותו root במקום ליצור חדש.
const holder = window as unknown as { __adminRoot?: ReturnType<typeof createRoot> };
holder.__adminRoot ??= createRoot(document.getElementById("admin")!);
holder.__adminRoot.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

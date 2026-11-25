// תוויות, רמזים ותבניות לממשק הניהול. העורך עצמו גנרי ובונה טופס מכל מבנה JSON,
// והקובץ הזה רק נותן לשדות שמות בעברית ומסביר מה כל אחד עושה באתר.

export type FileName = "site" | "articles" | "automations" | "quiz";
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type JsonObject = { [key: string]: Json };

export type Section = {
  id: string;
  file: FileName;
  // נתיב בתוך הקובץ. ריק = כל הקובץ.
  path: (string | number)[];
  title: string;
  hint?: string;
  // הכתובת שמוצגת בתצוגה המקדימה.
  preview?: string;
};

export type Group = { title: string; sections: Section[] };

export const groups: Group[] = [
  {
    title: "דף הבית",
    sections: [
      { id: "hero", file: "site", path: ["hero"], title: "פתיח (Hero)", preview: "/" },
      { id: "cta", file: "site", path: ["cta"], title: "טקסטים של כפתורים", hint: "הכפתורים שמובילים לטופס הפנייה, בכל האתר.", preview: "/" },
      { id: "statement", file: "site", path: ["statement"], title: "משפט מרכזי", preview: "/#presence" },
      { id: "outcomes", file: "site", path: ["outcomes"], title: "לפני ואחרי: יתרונות", preview: "/#benefits" },
      { id: "story", file: "site", path: ["story"], title: "איך ייראו אוטומציות (לשוניות)", preview: "/#automations" },
      { id: "projectsTeaser", file: "articles", path: ["projectsTeaser"], title: "סקשן הפרויקטים", preview: "/#projects" },
      { id: "shift", file: "site", path: ["shift"], title: "הזמנה לשאלון", preview: "/#quiz" },
      { id: "about", file: "site", path: ["about"], title: "למה לעבוד איתי", hint: "מוצג גם בדף הבית וגם בעמוד אודות.", preview: "/#about" },
      { id: "howItWorks", file: "site", path: ["howItWorks"], title: "איך מתחילים", preview: "/#how-it-works" },
      { id: "faq", file: "site", path: ["faq"], title: "שאלות ותשובות", preview: "/#faq" },
      { id: "leadForm", file: "site", path: ["leadForm"], title: "טופס פנייה", preview: "/#contact" },
      { id: "finalCta", file: "site", path: ["finalCta"], title: "קריאה לפעולה בסוף", preview: "/#final-cta" },
    ],
  },
  {
    title: "עמוד אודות",
    sections: [
      { id: "aboutPage", file: "site", path: ["aboutPage"], title: "עמוד אודות", hint: "הסיפור עצמו נלקח מ\"למה לעבוד איתי\" בדף הבית.", preview: "/about/" },
      { id: "author", file: "articles", path: ["author"], title: "תיבת הכותבת", hint: "מוצגת בכרטיסי הפרויקטים ובסוף כל פרויקט.", preview: "/articles/" },
    ],
  },
  {
    title: "עמוד הפרויקטים",
    sections: [
      { id: "articlesPage", file: "articles", path: ["articlesPage"], title: "טקסטים של עמוד הפרויקטים", preview: "/articles/" },
      { id: "articleCta", file: "articles", path: ["articleCta"], title: "סיום קבוע של כל פרויקט", preview: "/articles/" },
    ],
  },
  {
    title: "שאלון",
    sections: [
      { id: "quizTexts", file: "quiz", path: ["texts"], title: "טקסטים של השאלון", preview: "/#quiz" },
      { id: "quizQuestions", file: "quiz", path: ["questions"], title: "שאלות ותשובות בשאלון", hint: "את סדר השאלות ואת השדה key לא כדאי לשנות: לפיהם נבנית התוצאה ונשלחים הנתונים ל-Airtable.", preview: "/#quiz" },
      { id: "automations", file: "automations", path: ["automations"], title: "אוטומציות שהשאלון ממליץ עליהן", hint: "אוטומציה שיש בשם או בתיאור שלה TODO לא תוצג.", preview: "/#quiz" },
    ],
  },
  {
    title: "כללי",
    sections: [
      { id: "contact", file: "site", path: ["contact"], title: "פרטי קשר", hint: "מספר הוואטסאפ של כל הכפתורים ושל הטלפון בפוטר.", preview: "/#footer" },
      { id: "floatingWhatsApp", file: "site", path: ["floatingWhatsApp"], title: "כפתור וואטסאפ צף", preview: "/" },
      { id: "footer", file: "site", path: ["footer"], title: "פוטר", preview: "/#footer" },
      { id: "privacy", file: "site", path: ["privacy"], title: "עוגיות ופרטיות", preview: "/" },
      { id: "whatsappChat", file: "site", path: ["whatsappChat"], title: "הדגמת צ'אט וואטסאפ", hint: "שיחה לדוגמה שמוצגת באחד האיורים.", preview: "/" },
      { id: "crmLeads", file: "site", path: ["crmLeads"], title: "הדגמת טבלת לידים", hint: "שורות לדוגמה שמוצגות באחד האיורים. tone הוא הצבע: gold, green או sage.", preview: "/" },
    ],
  },
];

export const allSections = groups.flatMap((group) => group.sections);

// שמות השדות בעברית. מפתח שלא מופיע כאן יוצג בשמו המקורי.
export const labels: Record<string, string> = {
  title: "כותרת",
  titleBefore: "כותרת: חלק ראשון",
  titleAfter: "כותרת: חלק שני",
  titleKeywords: "מילות מפתח בכותרת (לא מוצג)",
  subtitle: "כותרת משנה",
  text: "טקסט",
  paragraphs: "פסקאות",
  paragraph: "פסקה",
  image: "תמונה",
  imageAlt: "תיאור התמונה (alt)",
  alt: "תיאור התמונה (alt)",
  more: "טקסט קישור \"עוד\"",
  id: "מזהה / עוגן",
  path: "כתובת העמוד",
  slug: "כתובת (slug)",
  talk: "כפתור רגיל",
  hero: "כפתור הפתיח",
  seoTitle: "כותרת לגוגל (SEO)",
  description: "תיאור",
  excerpt: "תקציר לכרטיס",
  date: "תאריך פרסום",
  updated: "תאריך עדכון",
  tags: "תגיות",
  keywords: "ביטויי חיפוש",
  summary: "\"בקצרה\" בראש העמוד",
  faq: "שאלות נפוצות",
  q: "שאלה",
  a: "תשובה",
  question: "שאלה",
  cover: "תמונת כריכה",
  src: "קובץ",
  small: "גרסה קטנה (800px)",
  og: "תמונת שיתוף (1200×630, JPG)",
  animated: "GIF בראש העמוד",
  hideOnPage: "להסתיר את הכריכה בראש העמוד",
  video: "וידאו",
  poster: "תמונת פתיחה של הווידאו",
  label: "תווית",
  sections: "חלקי המאמר",
  heading: "כותרת החלק",
  lead: "פתיח מודגש",
  figure: "תמונה",
  width: "רוחב",
  height: "גובה",
  pairs: "שורות",
  less: "לפני",
  highlight: "החלק המודגש",
  moreLabel: "כותרת עמודת \"אחרי\"",
  after: "משפט סיום",
  eyebrow: "כותרת עליונה קטנה",
  tabsLabel: "שם קבוצת הלשוניות (לקוראי מסך)",
  beforeLabel: "תווית \"לפני\"",
  afterLabel: "תווית \"אחרי\"",
  tasksTitle: "כותרת המשימות",
  intro: "פתיח",
  tabs: "לשוניות",
  before: "לפני",
  event: "האירוע",
  tasks: "משימות",
  done: "מה קורה לבד",
  closing: "משפט סיום",
  items: "פריטים",
  list: "רשימה",
  steps: "שלבים",
  number: "מספר",
  name: "שם",
  phone: "טלפון",
  business: "תחום העסק",
  notes: "הערות",
  submit: "כפתור שליחה",
  sending: "בזמן שליחה",
  errors: "הודעות שגיאה",
  phoneInvalid: "טלפון לא תקין",
  successTitle: "כותרת הצלחה",
  successText: "טקסט הצלחה",
  failText: "טקסט כשלון",
  failLink: "קישור בכשלון",
  hebrewName: "שם בעברית",
  tagline: "שורת תיאור",
  phoneLabel: "תווית טלפון",
  copyright: "זכויות יוצרים",
  message: "הודעה מוכנה",
  whatsappPhone: "מספר וואטסאפ (972…, בלי + ובלי מקפים)",
  status: "סטטוס",
  messages: "הודעות",
  from: "מי שולח (customer / business)",
  offer: "שירות",
  tone: "צבע",
  avatar: "תמונה",
  url: "קישור",
  bio: "ביו קצר",
  readMore: "טקסט כפתור קריאה",
  back: "חזרה",
  home: "דף הבית",
  summaryTitle: "כותרת \"בקצרה\"",
  faqTitle: "כותרת שאלות נפוצות",
  relatedTitle: "כותרת פרויקטים נוספים",
  signature: "חתימה",
  all: "קישור לכל הפרויקטים",
  allProjects: "קישור לכל הפרויקטים",
  count: "כמה פרויקטים להציג",
  storyTitle: "כותרת הסיפור",
  expertiseTitle: "כותרת התחומים",
  processTitle: "כותרת התהליך",
  projectsTitle: "כותרת הפרויקטים",
  banner: "באנר",
  dismiss: "כפתור סגירה",
  necessaryTitle: "הכרחיות: כותרת",
  necessaryText: "הכרחיות: טקסט",
  analyticsTitle: "אנליטיקה: כותרת",
  analyticsText: "אנליטיקה: טקסט",
  acceptAll: "כפתור \"קבל הכל\"",
  save: "כפתור שמירה",
  settings: "קישור הגדרות",
  note: "הסבר מלא",
  key: "מפתח (טכני)",
  legend: "השאלה",
  multiple: "אפשר לסמן כמה תשובות",
  max: "מקסימום תשובות",
  required: "חובה לענות",
  options: "תשובות",
  value: "ערך (טכני)",
  detail: "פירוט",
  stage: "שלב",
  howItWorks: "איך זה עובד (פנימי, לא מוצג)",
  measure: "מה מודדים (פנימי, לא מוצג)",
  start: "כפתור התחלה",
  next: "כפתור הבא",
  requiredError: "שגיאה: חובה",
  otherPlaceholder: "שדה \"אחר\"",
  details: "שלב הפרטים",
  privacy: "הערת פרטיות",
  nameError: "שגיאה: שם",
  phoneError: "שגיאה: טלפון",
  painPhrases: "ביטויי הכאבים במשפט התוצאה",
  result: "מסך התוצאה",
  emptyTitle: "כותרת כשאין כאבים",
  forgotten: "משפט על פניות שנשכחות",
  nextDay: "משפט על פניות שמחכות",
  cta: "כפתור",
  hoursText: "טקסט השעות במשפט התוצאה",
};

// רמזים קצרים שמופיעים מתחת לשדה.
export const hints: Record<string, string> = {
  id: "העוגן בכתובת (lirrey.com/#…). שינוי ישבור קישורים קיימים.",
  slug: "באותיות לטיניות קטנות ומקפים. זו הכתובת: /articles/<slug>/. שינוי ישבור קישורים קיימים.",
  highlight: "חייב להיות תחילת המשפט בשדה \"more\", בדיוק באותן מילים.",
  seoTitle: "עד כ-60 תווים. זו הכותרת שמופיעה בתוצאות החיפוש.",
  description: "עד כ-155 תווים. התיאור שמופיע בגוגל ובשיתוף.",
  date: "בפורמט 2026-11-25",
  updated: "בפורמט 2026-11-25. ממלאים רק כשמשנים פרויקט שכבר פורסם.",
  key: "טכני. לא לשנות.",
  value: "טכני. לא לשנות אחרי שהשאלון באוויר.",
  titleKeywords: "נקרא רק על ידי גוגל וקוראי מסך.",
  count: "כמה מהפרויקטים הראשונים ברשימה יוצגו בדף הבית.",
};

// מפתחות טכניים: מוצגים בכתב קטן ובפונט קבוע.
export const technicalKeys = new Set(["id", "path", "slug", "key", "value", "tone", "from", "width", "height"]);

// שדות שהם קובץ תמונה או וידאו.
export const mediaKeys = new Set(["src", "small", "og", "image", "avatar", "poster"]);

export function isMediaField(key: string | number, value: Json) {
  return typeof value === "string" && (mediaKeys.has(String(key)) || /^\/(images|videos)\//.test(value));
}

// התאמה של נתיב לתבנית, כש-* מתאים לכל אינדקס או מפתח.
export function matches(path: (string | number)[], pattern: string) {
  const parts = pattern.split(".");
  return parts.length === path.length && parts.every((part, i) => part === "*" || part === String(path[i]));
}

// סוגי פריטים שאפשר להוסיף למערך, לפי מיקום. מערך שלא מופיע כאן מוסיף עותק ריק של הפריט האחרון.
export const arrayShapes: { pattern: string; shapes: { label: string; value: Json }[] }[] = [
  {
    pattern: "articles.articles.*.sections.*.paragraphs",
    shapes: [
      { label: "פסקה", value: "" },
      { label: "פסקה עם פתיח מודגש", value: { lead: "", text: "" } },
      { label: "תמונה / GIF", value: { figure: { src: "", alt: "", width: 0, height: 0 } } },
    ],
  },
  {
    pattern: "articles.articles.*.sections",
    shapes: [{ label: "חלק חדש", value: { heading: "", paragraphs: [""] } }],
  },
];

// שדות רשות: אפשר להוסיף או להסיר אותם.
export const optionalFields: { pattern: string; fields: Record<string, Json> }[] = [
  {
    pattern: "articles.articles.*",
    fields: {
      updated: "",
      video: { src: "/videos/", poster: "", label: "" },
    },
  },
  {
    pattern: "articles.articles.*.cover",
    fields: {
      animated: { src: "", alt: "", width: 0, height: 0 },
      hideOnPage: true,
    },
  },
  { pattern: "articles.articles.*.sections.*", fields: { heading: "" } },
  { pattern: "site.faq.items.*", fields: { list: [""], closing: "" } },
  { pattern: "quiz.questions.*", fields: { max: 2 } },
  { pattern: "quiz.questions.*.options.*", fields: { detail: "" } },
  { pattern: "automations.automations.*", fields: { howItWorks: "", measure: "" } },
];

export function optionalFor(path: (string | number)[]) {
  return optionalFields.find((entry) => matches(path, entry.pattern))?.fields ?? {};
}

export function shapesFor(path: (string | number)[]) {
  return arrayShapes.find((entry) => matches(path, entry.pattern))?.shapes;
}

// פרויקט חדש: מבנה מלא עם ערכים ריקים.
export function newArticle(slug: string, title: string): JsonObject {
  const today = new Date().toISOString().slice(0, 10);
  return {
    slug,
    title,
    excerpt: "",
    description: "",
    date: today,
    tags: [""],
    seoTitle: title,
    keywords: [""],
    summary: ["הבעיה: ", "הפתרון: ", "התוצאה: "],
    faq: [{ q: "", a: "" }],
    cover: {
      src: `/images/articles/${slug}.webp`,
      small: `/images/articles/${slug}-800.webp`,
      og: `/images/articles/${slug}.jpg`,
      alt: "",
    },
    sections: [{ paragraphs: [""] }, { heading: "", paragraphs: [""] }],
  };
}

// ערך ריק באותו מבנה, לפריט חדש במערך.
export function blank(value: Json): Json {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return value;
  if (value === null) return null;
  if (Array.isArray(value)) return value.length ? [blank(value[0])] : [];
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v)]));
}

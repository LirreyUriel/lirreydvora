export type WhatsAppSource =
  | "hero"
  | "header"
  | "before_after"
  | "case_study"
  | "how_it_works"
  | "about"
  | "final_cta"
  | "sticky_mobile"
  | "footer"
  | "article"
  | "quiz_result";

const CONSENT_KEY = "lirrey-measurement-consent";
const GA_ID_PATTERN = /^G-[A-Za-z0-9]+$/;
const CLARITY_ID_PATTERN = /^[a-z0-9]+$/i;

const namedClicks: Partial<Record<WhatsAppSource, string>> = {
  hero: "hero_whatsapp_click",
  header: "header_whatsapp_click",
  final_cta: "final_whatsapp_click",
  sticky_mobile: "sticky_whatsapp_click",
  quiz_result: "quiz_whatsapp_click",
};

type Consent = "granted" | "denied";

const GA_MEASUREMENT_ID = "G-DM9S3T9S54";
const CLARITY_PROJECT_ID = "z2sksixp74";

const gaId = measurementId(import.meta.env.VITE_GA_MEASUREMENT_ID, GA_ID_PATTERN) || GA_MEASUREMENT_ID;
const clarityId =
  measurementId(import.meta.env.VITE_CLARITY_PROJECT_ID, CLARITY_ID_PATTERN) || CLARITY_PROJECT_ID;
let started = false;

function measurementId(value: string | undefined, pattern: RegExp) {
  const id = value?.trim() ?? "";
  return pattern.test(id) ? id : "";
}

export function analyticsConfigured() {
  return Boolean(gaId || clarityId);
}

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

// Measurement is on by default. Only an explicit "denied" turns it off.
export function analyticsEnabled() {
  return getConsent() !== "denied";
}

export function grantConsent() {
  rememberConsent("granted");
  if (gaId) delete (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`];
  startAnalytics();
}

export function denyConsent() {
  rememberConsent("denied");
  stopAnalytics();
}

function stopAnalytics() {
  if (typeof window === "undefined") return;
  if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true;
  window.clarity?.("consent", false);
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID)/.test(name)) continue;
    const domains = ["", location.hostname, `.${location.hostname.replace(/^www\./, "")}`];
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

function rememberConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Private mode can block storage. The choice still applies for this page view.
  }
}

// בפיתוח מקומי לא טוענים GA וקלריטי, כדי שביקורים ושגיאות מ-npm run dev לא ייכנסו לנתונים.
function isLocalHost() {
  return /^(localhost|127\.0\.0\.1|\[::1\]|.+\.localhost)$/.test(location.hostname);
}

export function startAnalytics() {
  if (started || typeof window === "undefined" || !analyticsEnabled() || isLocalHost()) return;
  started = true;
  if (gaId) loadGoogleAnalytics(gaId);
  if (clarityId) loadClarity(clarityId);
}

// ?debug=1 בכתובת שולח את האירועים במצב דיבאג, כדי לראות אותם ב-DebugView של GA4.
// נשמר ללשונית הנוכחית, כך שהמצב נשאר גם במעבר בין עמודים. ?debug=0 מכבה.
const DEBUG_KEY = "lirrey-ga-debug";

function debugMode() {
  try {
    const param = new URLSearchParams(location.search).get("debug");
    if (param === "1") sessionStorage.setItem(DEBUG_KEY, "1");
    if (param === "0") sessionStorage.removeItem(DEBUG_KEY);
    return sessionStorage.getItem(DEBUG_KEY) === "1";
  } catch {
    return new URLSearchParams(location.search).get("debug") === "1";
  }
}

function loadGoogleAnalytics(id: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false, ...(debugMode() ? { debug_mode: true } : {}) });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

function loadClarity(id: string) {
  if (window.clarity) return;

  const queued: unknown[][] = [];
  const clarity: NonNullable<Window["clarity"]> = (...args: unknown[]) => {
    queued.push(args);
  };
  clarity.q = queued;
  window.clarity = clarity;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${id}`;
  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
  else document.head.appendChild(script);
}

// מה נמדד בעמוד הנוכחי. מצורף לכל אירוע, כך שאפשר לראות ב-GA4 ובקלריטי תוצאות לכל מאמר בנפרד.
export type PageContext = {
  page_type: "home" | "projects" | "article";
  article_slug?: string;
  article_title?: string;
};

let pageContext: PageContext | null = null;

function send(event: string, params: Record<string, unknown>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", event, { ...pageContext, ...params });
  }
}

// צפייה בעמוד: page_view עם הכתובת המלאה וקבוצת תוכן ב-GA4, ותגיות + אירוע בקלריטי.
export function trackPageView(context: PageContext) {
  if (typeof window === "undefined") return;
  pageContext = context;
  if (!analyticsEnabled()) return;
  startAnalytics();

  window.clarity?.("set", "page_type", context.page_type);
  if (context.article_slug) {
    window.clarity?.("set", "article_slug", context.article_slug);
    window.clarity?.("event", "article_view");
  }

  send("page_view", {
    page_location: location.href,
    page_path: location.pathname,
    page_title: document.title,
    content_group: context.page_type,
  });
  if (context.article_slug) send("article_view", {});
}

export function trackArticleRead() {
  if (!pageContext?.article_slug) return;
  window.clarity?.("event", "article_read");
  push("article_read");
}

function push(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (!analyticsEnabled()) return;
  startAnalytics();
  send(event, params);
}

export function track(event: string, params: Record<string, unknown> = {}) {
  push(event, params);
}

export function trackWhatsApp(source: WhatsAppSource) {
  push("whatsapp_click", { source });
  const named = namedClicks[source];
  if (named) push(named);
}

const seen = new Set<string>();

export function trackViewOnce(event: string) {
  if (seen.has(event)) return;
  seen.add(event);
  push(event);
}

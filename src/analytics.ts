export type WhatsAppSource =
  | "hero"
  | "header"
  | "before_after"
  | "case_study"
  | "how_it_works"
  | "about"
  | "final_cta"
  | "sticky_mobile"
  | "footer";

const CONSENT_KEY = "lirrey-measurement-consent";
const GA_ID_PATTERN = /^G-[A-Za-z0-9]+$/;
const CLARITY_ID_PATTERN = /^[a-z0-9]+$/i;

const namedClicks: Partial<Record<WhatsAppSource, string>> = {
  hero: "hero_whatsapp_click",
  header: "header_whatsapp_click",
  final_cta: "final_whatsapp_click",
  sticky_mobile: "sticky_whatsapp_click",
};

type Consent = "granted" | "denied";
type QueuedEvent = { event: string; params: Record<string, unknown> };

const GA_MEASUREMENT_ID = "G-DM9S3T9S54";
const CLARITY_PROJECT_ID = "z2sksixp74";

const gaId = measurementId(import.meta.env.VITE_GA_MEASUREMENT_ID, GA_ID_PATTERN) || GA_MEASUREMENT_ID;
const clarityId =
  measurementId(import.meta.env.VITE_CLARITY_PROJECT_ID, CLARITY_ID_PATTERN) || CLARITY_PROJECT_ID;
const queue: QueuedEvent[] = [];
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

export function grantConsent() {
  rememberConsent("granted");
  startAnalytics();
  flush();
}

export function denyConsent() {
  rememberConsent("denied");
  queue.length = 0;
}

function rememberConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Private mode can block storage. The choice still applies for this page view.
  }
}

export function startAnalytics() {
  if (started || typeof window === "undefined" || getConsent() !== "granted") return;
  started = true;
  if (gaId) loadGoogleAnalytics(gaId);
  if (clarityId) loadClarity(clarityId);
}

function loadGoogleAnalytics(id: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });

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

function send(event: string, params: Record<string, unknown>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

function flush() {
  const pending = queue.splice(0);
  for (const item of pending) send(item.event, item.params);
}

function push(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (getConsent() === "denied") return;

  if (getConsent() === "granted") {
    startAnalytics();
    send(event, params);
    return;
  }

  if (queue.length < 40) queue.push({ event, params });
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

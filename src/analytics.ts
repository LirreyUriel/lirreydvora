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

const namedClicks: Partial<Record<WhatsAppSource, string>> = {
  hero: "hero_whatsapp_click",
  header: "header_whatsapp_click",
  final_cta: "final_whatsapp_click",
  sticky_mobile: "sticky_whatsapp_click",
};

function push(event: string, params: Record<string, unknown> = {}) {
  const payload = { event, ...params };

  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
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

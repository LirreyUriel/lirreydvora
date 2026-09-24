export const WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE || "972501234567";

export const WHATSAPP_MESSAGE =
  "היי לירי! הגעתי לאתר שלך ואשמח לבדוק יחד מה אפשר לשפר בעסק שלי.";

export const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const SITE_URL = "https://lirreydvora.com";

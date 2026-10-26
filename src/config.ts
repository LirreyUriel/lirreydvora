export const WHATSAPP_PHONE = "972553015612";

export const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}`;

export function whatsappMessageUrl(text: string) {
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export const SITE_URL = "https://lirrey.com";

// כתובת שמקבלת את תשובות השאלון (POST ב-JSON). כל עוד היא ריקה, השאלון מציג תוצאה ולא שולח כלום.
// מחובר לאוטומציה "שאלון באתר ← מתעניינים" בבסיס Clients ב-Airtable, שיוצרת שורה בטבלת "מתעניינים".
export const QUIZ_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appkBihHRyfzNadpq/wflmIZkWuhqEbyQL8/wtrbxc6uSZLR0Ckgn";

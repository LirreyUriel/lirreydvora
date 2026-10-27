export const WHATSAPP_PHONE = "972553015612";

export const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}`;

export function whatsappMessageUrl(text: string) {
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export const SITE_URL = "https://lirrey.com";

// כתובת שמקבלת את תשובות השאלון (POST ב-JSON). כל עוד היא ריקה, השאלון מציג תוצאה ולא שולח כלום.
// מחובר לאוטומציה "שאלון באתר ← מתעניינים" בבסיס Clients ב-Airtable, שיוצרת שורה בטבלת "מילאו שאלון".
// האוטומציה מפנה לטבלה לפי המזהה שלה, כך ששינוי שם הטבלה לא שובר אותה.
export const QUIZ_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appkBihHRyfzNadpq/wflmIZkWuhqEbyQL8/wtrbxc6uSZLR0Ckgn";

// כתובת שמקבלת את טופס "נדבר בקרוב" (POST כטופס רגיל: name, phone, business, notes, submitted_at, page_url).
// מחובר לאוטומציה "טופס באתר ← מילאו טופס" בבסיס Clients ב-Airtable, שיוצרת שורה בטבלת "מילאו טופס".
export const LEAD_FORM_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appkBihHRyfzNadpq/wflMTouYD0xkWkSaV/wtr6NjU8Mv4VmVx4L";

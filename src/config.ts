import { contact } from "@/content/site";

// המספר נערך בממשק הניהול, תחת "הגדרות".
export const WHATSAPP_PHONE = contact.whatsappPhone;

export const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}`;

// קישור לוואטסאפ שנפתח עם הודעה מוכנה.
export const whatsappMessageUrl = (message: string) => `${whatsappUrl}?text=${encodeURIComponent(message)}`;

// המספר כפי שהוא מוצג בפוטר. הלחיצה עליו פותחת הודעת וואטסאפ.
export const PHONE_DISPLAY = `0${WHATSAPP_PHONE.slice(3, 5)}-${WHATSAPP_PHONE.slice(5, 8)}-${WHATSAPP_PHONE.slice(8)}`;

// טופס הפנייה בעמוד הראשי. הכתובת מתחילה ב-/ כדי שתעבוד גם מעמודי הפרויקטים.
export const contactFormUrl = "/#contact";

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

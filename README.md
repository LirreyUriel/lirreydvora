# Lirrey Dvora

אתר תדמית בעמוד אחד — אוטומציות עסקיות לעסקי Wellness.

## הרצה מקומית

```bash
npm install
npm run dev
```

האתר ייפתח ב-`http://localhost:5173`.

## מספר WhatsApp

כל כפתורי ה-CTA משתמשים במשתנה אחד.

1. העתיקי את `.env.example` ל-`.env`
2. שימי מספר בינלאומי בלי `+` ובלי מקפים:

```
VITE_WHATSAPP_PHONE=972501234567
```

ההודעה המוכנה מראש נמצאת ב-`src/config.ts`.

## תוכן

כל הטקסטים נמצאים ב-`src/content/site.ts`.

## תמונות

- `public/images/logo.png` — סמל על רקע שקוף
- `public/images/about.webp` — מומלץ להחליף בתמונה אמיתית של לירי
- שאר התמונות הן תמונות אווירה של Wellness / ריטריט / סטודיו

## בנייה

```bash
npm run build
npm run preview
```

import type { ReactNode } from "react";

// אייקון קו לכל כאב בשאלה השנייה, לפי ערך האפשרות.
const icons: Record<string, ReactNode> = {
  // בועת שיחה: פניות חדשות
  first_contact: (
    <>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  // אדם עם סימן שאלה: מתעניינים שנעלמו
  stalled_leads: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21a7 7 0 0 1 10.5-6" />
      <path d="M16.5 14.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.7-.9 1.2" />
      <path d="M19 21h.01" />
    </>
  ),
  // יומן עם וי: קביעת מפגש
  booking: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  // לוח עם רשימה: הכנה לפני המפגש
  before_session: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </>
  ),
  // לב: קשר אחרי המפגש
  after_session: (
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
  ),
  // חצים במעגל: לקוחות שחוזרים
  retention: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  // גרף עמודות: תמונה כללית של העסק
  behind_scenes: (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 17v-6M13 17V7M18 17v-3" />
    </>
  ),
};

export function QuizIcon({ name }: { name: string }) {
  const icon = icons[name];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

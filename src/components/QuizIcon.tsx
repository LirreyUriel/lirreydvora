import type { ReactNode } from "react";

// צורות האייקונים (קו, 24x24).
const shapes = {
  chat: (
    <>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  userQuestion: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21a7 7 0 0 1 10.5-6" />
      <path d="M16.5 14.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.7-.9 1.2" />
      <path d="M19 21h.01" />
    </>
  ),
  calendarCheck: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </>
  ),
  heart: (
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 17v-6M13 17V7M18 17v-3" />
    </>
  ),
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </>
  ),
  mailCheck: (
    <>
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" />
      <path d="m16 19 2 2 4-4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

// כאבים מהשאלה השנייה ואוטומציות בתוצאה, לפי הערך או המזהה שלהם.
const iconFor: Record<string, keyof typeof shapes> = {
  first_contact: "chat",
  stalled_leads: "userQuestion",
  booking: "calendarCheck",
  before_session: "clipboard",
  retention: "heart",
  behind_scenes: "chart",
  first_reply: "zap",
  single_inbox: "inbox",
  gentle_followup: "bell",
  welcome_confirmation: "mailCheck",
  appointment_reminder: "calendarCheck",
  win_back: "refresh",
  weekly_summary: "chart",
  after_session: "heart",
};

export function QuizIcon({ name, size = 24 }: { name: string; size?: number }) {
  const shape = iconFor[name];
  if (!shape) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[shape]}
    </svg>
  );
}

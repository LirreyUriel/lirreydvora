// detail מציג את האפשרות ככרטיס עם אייקון, כותרת מודגשת ופירוט.
export type QuizOption = { value: string; label: string; detail?: string };

export type QuizKey =
  | "business_type"
  | "pains"
  | "hours"
  | "impact"
  | "channels"
  | "response"
  | "close_rate"
  | "booking_methods"
  | "return_rate";

export type QuizQuestion = {
  key: QuizKey;
  legend: string;
  multiple: boolean;
  max?: number;
  required: boolean;
  options: QuizOption[];
};

const rateOptions: QuizOption[] = [
  { value: "most", label: "הרוב" },
  { value: "half", label: "בערך חצי" },
  { value: "few", label: "מעט" },
  { value: "unknown", label: "אין לי דרך לדעת" },
];

const questionList = [
  {
    key: "business_type",
    legend: "מה סוג העסק?",
    multiple: true,
    max: 2,
    required: false,
    options: [
      { value: "fitness", label: "כושר ותזונה" },
      { value: "clinic", label: "קליניקה וטיפולים" },
      { value: "mind", label: "נפש והתפתחות" },
      { value: "parenting", label: "הריון והורות" },
      { value: "beauty", label: "יופי וטיפוח" },
      { value: "workshops", label: "סדנאות וריטריטים" },
      { value: "online", label: "קורסים, תוכניות וקהילות אונליין" },
      { value: "other", label: "אחר" },
    ],
  },
  {
    key: "pains",
    legend: "מה הנקודות הכי כואבות בעסק היום בעיניך?",
    multiple: true,
    max: 3,
    required: true,
    options: [
      {
        value: "first_contact",
        label: "מתעניינים חדשים",
        detail: "הפניות מפוזרות, קשה לעקוב אחרי כולן, ולפעמים אני עונה באיחור או שפניות מתפספסות",
      },
      {
        value: "stalled_leads",
        label: "מתעניינים שנעלמים",
        detail: "קשה לעקוב אחרי כל המתעניינים שדיברתי איתם ולהבין מי התקדם ולמי צריך לפנות שוב",
      },
      {
        value: "booking",
        label: "קביעת מפגש או אישורי הזמנות",
        detail: "מתבזבז זמן בתיאום מפגשים ותורים, אישורי הגעה ותזכורות, הפקת אישורי הזמנה של קורסים ועוד",
      },
      {
        value: "before_session",
        label: "לפני המפגש",
        detail: "קשה להתמודד עם ביטולים ברגע האחרון, או ששליחת שאלוני הכנה או איסוף פרטים לוגיסטיים מעמיס",
      },
      {
        value: "after_session",
        label: "אחרי המפגש",
        detail: "קשה לשמור על קשר רציף כמו שהייתי רוצה",
      },
      {
        value: "retention",
        label: "שימור",
        detail: "לקוחות מרוצים נעלמים וקשה לזכור לחזור לכולם כדי להציע להם לחזור",
      },
      {
        value: "behind_scenes",
        label: "מאחורי הקלעים",
        detail: "אין לי תמונה כללית של מה קורה בעסק שלי",
      },
    ],
  },
  {
    key: "hours",
    legend: "כמה שעות בשבוע לוקחות הפעולות האלה במצב הנוכחי?",
    multiple: false,
    required: true,
    options: [
      { value: "up_to_1", label: "עד שעה" },
      { value: "1_to_3", label: "1 עד 3 שעות" },
      { value: "3_to_6", label: "3 עד 6 שעות" },
      { value: "over_6", label: "יותר מ-6 שעות" },
      { value: "none", label: "זה לא משהו שאני עושה היום" },
    ],
  },
  {
    key: "impact",
    legend: "למה המצב הנוכחי גורם?",
    multiple: true,
    required: false,
    options: [
      { value: "time_energy", label: "בזבוז זמן ואנרגיה" },
      { value: "money", label: "בזבוז כסף" },
      { value: "missed_clients", label: "לקוחות שמתפספסים" },
    ],
  },
  {
    key: "channels",
    legend: "איפה מגיעות הפניות היום?",
    multiple: true,
    required: false,
    options: [
      { value: "whatsapp", label: "וואטסאפ" },
      { value: "instagram", label: "אינסטגרם" },
      { value: "website_form", label: "טופס באתר" },
      { value: "phone", label: "טלפון" },
      { value: "email", label: "מייל" },
    ],
  },
  {
    key: "response",
    legend: "מה קורה היום כשפונים אליך ואין זמינות לענות?",
    multiple: false,
    required: true,
    options: [
      { value: "within_hour", label: "תוך שעה יש תשובה" },
      { value: "few_hours", label: "תשובה אחרי כמה שעות" },
      { value: "next_day", label: "תשובה למחרת" },
      { value: "forgotten", label: "לפעמים הפנייה נשכחת" },
      { value: "auto_reply", label: "יש מענה אוטומטי" },
    ],
  },
  {
    key: "close_rate",
    legend: "כמה מהמתעניינים שמגיעים בחודש באמת סוגרים היום?",
    multiple: false,
    required: true,
    options: rateOptions,
  },
  {
    key: "booking_methods",
    legend: "איך לקוחות קובעים תור או נרשמים?",
    multiple: true,
    required: false,
    options: [
      { value: "google_calendar", label: "ביומן Google" },
      { value: "calendly", label: "Calendly או דומה" },
      { value: "management_system", label: "מערכת ניהול (Arbox, Mindbody ודומיהן)" },
      { value: "whatsapp_manual", label: "בוואטסאפ, ידנית" },
      { value: "sheet_or_form", label: "גיליון או טופס" },
      { value: "no_system", label: "אין דרך מסודרת" },
    ],
  },
  {
    key: "return_rate",
    legend: "כמה מהלקוחות שלך חוזרים?",
    multiple: false,
    required: true,
    options: rateOptions,
  },
] satisfies QuizQuestion[];

const byKey = Object.fromEntries(questionList.map((question) => [question.key, question])) as Record<
  QuizKey,
  QuizQuestion
>;

// שאלות שמופיעות רק אם סימנו את הכאב המתאים, לפי סדר הכאבים.
const followUps: [pain: string, keys: QuizKey[]][] = [
  ["first_contact", ["channels", "response"]],
  ["stalled_leads", ["close_rate"]],
  ["booking", ["booking_methods"]],
  ["retention", ["return_rate"]],
];

export function activeQuestions(pains: string[]): QuizQuestion[] {
  const keys: QuizKey[] = ["business_type", "pains", "hours", "impact"];
  for (const [pain, extra] of followUps) {
    if (pains.includes(pain)) keys.push(...extra);
  }
  return keys.map((key) => byKey[key]);
}

export const quiz = {
  title: "שאלון קצר: איזו אוטומציה תתאים לעסק?",
  next: "הבא",
  back: "חזרה",
  maxNote: (max: number) => `אפשר לסמן עד ${max} תשובות`,
  requiredError: "צריך לסמן לפחות תשובה אחת",
  otherPlaceholder: "מה סוג העסק?",
  details: {
    title: "כמעט סיימנו!",
    privacy: "הפרטים ישמשו ליצירת קשר בנושא השאלון בלבד",
    name: "איך קוראים לך?",
    phone: "מה מספר הטלפון?",
    submit: "לתוצאה",
    nameError: "צריך למלא שם",
    phoneError: "צריך למלא מספר טלפון",
  },
  // כל כאב מהשאלה השנייה, כפי שהוא נכנס למשפט התוצאה.
  painPhrases: {
    first_contact: "הפנייה הראשונה של לקוח",
    stalled_leads: "המעקב אחרי מתעניינים",
    booking: "תיאום המפגשים ואישורי ההזמנות",
    before_session: "ההכנה לקראת המפגש",
    after_session: "שמירת הקשר אחרי המפגש",
    retention: "החזרת לקוחות שהתרחקו",
    behind_scenes: "הניסיון להבין מה קורה בעסק",
  } as Record<string, string>,
  result: {
    // "X", "X ו-Y" או "X, Y ו-Z". כל הביטויים מתחילים בה' הידיעה, אז הו' מתחברת ישירות.
    joinPains: (phrases: string[]) =>
      phrases.length > 1 ? `${phrases.slice(0, -1).join(", ")} ו${phrases[phrases.length - 1]}` : phrases[0],
    // בלי שעות (סימנו "זה לא משהו שאני עושה היום") המשפט נעצר אחרי הכאבים.
    title: (pains: string, count: number, hours: string) => {
      const lead = count > 1 ? `הכאבים המרכזיים שלך הם ${pains}` : `הכאב המרכזי שלך הוא ${pains}`;
      if (!hours) return lead;
      return count > 1 ? `${lead}, ויחד הם מבזבזים לך ${hours} בשבוע` : `${lead}, והוא מבזבז לך ${hours} בשבוע`;
    },
    emptyTitle: "בואו נבין יחד מה מתאים",
    forgotten: "לפעמים פנייה נשכחת, ופנייה שנשכחת היא לקוח שהלך למקום אחר.",
    nextDay: "היום פניות חדשות מחכות עד למחרת.",
    intro: "האוטומציות הראשונות שהייתי בוחנת עבור העסק שלך:",
    cta: "אשמח לשמוע עוד על התהליך",
    message: "היי, מילאתי את השאלון באתר ואשמח לשמוע עוד על התהליך.",
    messagePains: (pains: string, count: number) =>
      count > 1 ? `הכאבים המרכזיים שעלו: ${pains}.` : `הכאב המרכזי שעלה: ${pains}.`,
  },
  hoursText: {
    up_to_1: "עד שעה",
    "1_to_3": "בין שעה ל-3 שעות",
    "3_to_6": "בין 3 ל-6 שעות",
    over_6: "יותר מ-6 שעות",
  } as Record<string, string>,
};

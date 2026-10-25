export type QuizOption = { value: string; label: string };

export type QuizQuestion = {
  key: "business_type" | "pains" | "hours" | "response" | "channels" | "booking_methods";
  legend: string;
  multiple: boolean;
  max?: number;
  required: boolean;
  options: QuizOption[];
};

export const quiz = {
  title: "שאלון קצר: איזו אוטומציה תתאים לעסק?",
  subtitle: "6 שאלות, כ-2 דקות.",
  next: "הבא",
  back: "חזרה",
  progress: (current: number, total: number) => `שאלה ${current} מתוך ${total}`,
  maxNote: (max: number) => `אפשר לסמן עד ${max} תשובות`,
  requiredError: "צריך לסמן לפחות תשובה אחת",
  otherPlaceholder: "מה סוג העסק?",
  details: {
    title: "כמעט סיימנו",
    name: "שם",
    contact: "וואטסאפ או מייל",
    freeText: "מה הדבר האחד שהיית רוצה שיפסיק לתפוס לך את הראש?",
    optional: "(לא חובה)",
    privacy: "הפרטים ישמשו ליצירת קשר בנושא השאלון בלבד.",
    submit: "לתוצאה",
    nameError: "צריך למלא שם",
    contactError: "צריך למלא וואטסאפ או מייל",
  },
  result: {
    title: (stage: string) => `הכאב המרכזי שלך: ${stage}`,
    emptyTitle: "בואו נבין יחד מה מתאים",
    hours: (hours: string) => `לפי התשובות, זה לוקח ${hours} בשבוע`,
    forgotten: "ולפעמים פנייה נשכחת. פנייה שנשכחת היא לקוח שהלך למקום אחר.",
    nextDay: "ופניות חדשות מחכות עד למחרת.",
    automation: (index: number, name: string) => `אוטומציה ${index}: ${name}`,
    howItWorks: "איך זה בנוי:",
    measure: "מה נמדוד:",
    cta: "אשמח לשמוע עוד על התהליך",
    message: "היי, מילאתי את השאלון באתר ואשמח לשמוע עוד על התהליך.",
    messageStage: (stage: string) => `הכאב המרכזי שעלה: ${stage}.`,
  },
  hoursText: {
    up_to_1: "עד שעה",
    "1_to_3": "בין שעה ל-3 שעות",
    "3_to_6": "בין 3 ל-6 שעות",
    over_6: "יותר מ-6 שעות",
  } as Record<string, string>,
  questions: [
    {
      key: "business_type",
      legend: "מה סוג העסק?",
      multiple: true,
      max: 2,
      required: false,
      options: [
        { value: "fitness", label: "כושר ותזונה (סטודיו, קבוצות, אימון אישי, ליווי אחד על אחד)" },
        { value: "clinic", label: "קליניקה וטיפולים (רפואה משלימה, פיזיותרפיה, דיקור, עיסוי)" },
        { value: "mind", label: "נפש והתפתחות (פסיכולוגיה, NLP, אימון לחיים, ייעוץ הורי)" },
        { value: "parenting", label: "הריון והורות (הכנה ללידה, ייעוץ הנקה, ליווי)" },
        { value: "beauty", label: "יופי וטיפוח (קוסמטיקה, ציפורניים, שיער, ספא)" },
        { value: "workshops", label: "סדנאות וריטריטים" },
        { value: "online", label: "קורסים, תוכניות וקהילות אונליין" },
        { value: "other", label: "אחר" },
      ],
    },
    {
      key: "pains",
      legend: "איפה בעסק הכי הרבה נופל בין הכיסאות?",
      multiple: true,
      max: 3,
      required: true,
      options: [
        {
          value: "first_contact",
          label: "פניות חדשות: עונים באיחור, והפניות מפוזרות בין וואטסאפ, אינסטגרם וטלפון",
        },
        { value: "stalled_leads", label: "מתעניינים שנעלמים: שאלו מחיר ולא חזרו" },
        { value: "booking", label: "הזמנה או הרשמה: תיאום תור, תשלום, חשבוניות, אישורים" },
        {
          value: "before_session",
          label: "לפני המפגש: ביטולים ברגע האחרון, שאלוני הכנה, פרטים לוגיסטיים",
        },
        { value: "after_session", label: "אחרי המפגש: מעקב, סיכום, שיעור נוסף" },
        { value: "retention", label: "שימור: לקוחות שנעלמים, ימי הולדת, חידוש כרטיסייה" },
        {
          value: "behind_scenes",
          label: "מאחורי הקלעים: אין תמונה כללית של מה קורה בעסק בלי לפתוח חמש מערכות",
        },
      ],
    },
    {
      key: "hours",
      legend: "כמה שעות בשבוע זה לוקח?",
      multiple: false,
      required: true,
      options: [
        { value: "up_to_1", label: "עד שעה" },
        { value: "1_to_3", label: "1 עד 3 שעות" },
        { value: "3_to_6", label: "3 עד 6 שעות" },
        { value: "over_6", label: "יותר מ-6 שעות" },
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
  ] satisfies QuizQuestion[],
};

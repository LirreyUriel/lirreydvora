import data from "./data/quiz.json";

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

const questionList = data.questions as QuizQuestion[];

export const questionsByKey = Object.fromEntries(questionList.map((question) => [question.key, question])) as Record<
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
  return keys.map((key) => questionsByKey[key]);
}

// הטקסטים נערכים דרך ממשק הניהול ונשמרים ב-data/quiz.json. כאן נשארות רק פונקציות שמרכיבות משפטים.
export const quiz = {
  ...data.texts,
  maxNote: (max: number) => `אפשר לסמן עד ${max} תשובות`,
  // כל כאב מהשאלה השנייה, כפי שהוא נכנס למשפט התוצאה.
  painPhrases: data.texts.painPhrases as Record<string, string>,
  hoursText: data.texts.hoursText as Record<string, string>,
  result: {
    ...data.texts.result,
    // "X", "X ו-Y" או "X, Y ו-Z". כל הביטויים מתחילים בה' הידיעה, אז הו' מתחברת ישירות.
    joinPains: (phrases: string[]) =>
      phrases.length > 1 ? `${phrases.slice(0, -1).join(", ")} ו${phrases[phrases.length - 1]}` : phrases[0],
    // בלי שעות (סימנו "זה לא משהו שאני עושה היום") המשפט נעצר אחרי הכאבים.
    title: (pains: string, count: number, hours: string) => {
      const lead = count > 1 ? `הכאבים המרכזיים שלך הם ${pains}` : `הכאב המרכזי שלך הוא ${pains}`;
      if (!hours) return lead;
      return count > 1 ? `${lead}, ויחד הם מבזבזים לך ${hours} בשבוע` : `${lead}, והוא מבזבז לך ${hours} בשבוע`;
    },
  },
};

import { automations, type Automation } from "../content/automations.ts";

export type QuizAnswers = {
  pains: string[];
  response?: string;
  channels: string[];
  booking_methods: string[];
};

// כל שלב בשאלה 2 והאוטומציה שלו, לפי סדר השלבים בעסק.
const stageAutomation: [pain: string, automationId: string][] = [
  ["first_contact", "first_reply"],
  ["stalled_leads", "gentle_followup"],
  ["booking", "welcome_confirmation"],
  ["before_session", "appointment_reminder"],
  ["after_session", "after_session"],
  ["retention", "win_back"],
  ["behind_scenes", "weekly_summary"],
];

const MAX_RESULTS = 3;

function isComplete(automation: Automation) {
  return [automation.name, automation.description].every(
    (text) => text.trim() !== "" && !text.includes("TODO"),
  );
}

export function selectAutomations(
  answers: QuizAnswers,
  catalog: readonly Automation[] = automations,
): Automation[] {
  const ids: string[] = [];

  // תשובה ראשונה קודמת ל"מקום אחד לכל הפניות" גם כשפניות חדשות סומנו כשלב שכואב.
  const slowReply = answers.response === "forgotten" || answers.response === "next_day";
  if (slowReply || answers.pains.includes("first_contact")) {
    ids.push("first_reply");
  }

  const manualBooking = answers.booking_methods.some(
    (method) => method === "whatsapp_manual" || method === "no_system",
  );
  if (answers.channels.length >= 3 || manualBooking) {
    ids.push("single_inbox");
  }

  for (const [pain, automationId] of stageAutomation) {
    if (answers.pains.includes(pain)) ids.push(automationId);
  }

  return [...new Set(ids)]
    .map((id) => catalog.find((automation) => automation.id === id))
    .filter((automation): automation is Automation => !!automation && isComplete(automation))
    .slice(0, MAX_RESULTS);
}

import { automations, type Automation } from "../content/automations.ts";

export type QuizAnswers = {
  pains: string[];
  response: string[];
  channels: string[];
  booking_methods: string[];
};

// כל שלב בשאלה 2 והאוטומציות שלו, לפי סדר השלבים בעסק.
// שימור הקשר מאחד את "אחרי המפגש" ו"שימור", ולכן מוביל לשתי אוטומציות.
const stageAutomations: [pain: string, automationIds: string[]][] = [
  ["first_contact", ["first_reply"]],
  ["stalled_leads", ["gentle_followup"]],
  ["booking", ["welcome_confirmation"]],
  ["before_session", ["appointment_reminder"]],
  ["retention", ["win_back", "after_session"]],
  ["behind_scenes", ["weekly_summary"]],
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
  const slowReply = answers.response.includes("forgotten") || answers.response.includes("next_day");
  if (slowReply || answers.pains.includes("first_contact")) {
    ids.push("first_reply");
  }

  const manualBooking = answers.booking_methods.some(
    (method) => method === "whatsapp_manual" || method === "no_system",
  );
  if (answers.channels.length >= 3 || manualBooking) {
    ids.push("single_inbox");
  }

  for (const [pain, automationIds] of stageAutomations) {
    if (answers.pains.includes(pain)) ids.push(...automationIds);
  }

  return [...new Set(ids)]
    .map((id) => catalog.find((automation) => automation.id === id))
    .filter((automation): automation is Automation => !!automation && isComplete(automation))
    .slice(0, MAX_RESULTS);
}

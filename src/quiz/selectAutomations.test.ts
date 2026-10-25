import { test } from "node:test";
import assert from "node:assert/strict";
import { selectAutomations, type QuizAnswers } from "./selectAutomations.ts";

function ids(answers: Partial<QuizAnswers>) {
  return selectAutomations({ pains: [], channels: [], booking_methods: [], ...answers }).map(
    (automation) => automation.id,
  );
}

test("forgotten replies come first, then the chosen stage", () => {
  assert.deepEqual(ids({ pains: ["first_contact", "before_session"], response: "forgotten" }), [
    "first_reply",
    "appointment_reminder",
  ]);
});

test("no forced rules leaves only the chosen stage", () => {
  assert.deepEqual(
    ids({
      pains: ["retention"],
      response: "within_hour",
      channels: ["whatsapp"],
      booking_methods: ["google_calendar"],
    }),
    ["win_back"],
  );
});

test("forgotten replies add first_reply before retention", () => {
  assert.deepEqual(ids({ pains: ["retention"], response: "forgotten" }), ["first_reply", "win_back"]);
});

test("both forced rules plus stages are cut to three", () => {
  assert.deepEqual(
    ids({
      pains: ["stalled_leads", "booking", "behind_scenes"],
      response: "forgotten",
      channels: ["whatsapp", "instagram", "website_form", "phone"],
    }),
    ["first_reply", "single_inbox", "gentle_followup"],
  );
});

test("manual WhatsApp booking adds a single inbox", () => {
  assert.deepEqual(
    ids({ pains: ["first_contact"], response: "within_hour", booking_methods: ["whatsapp_manual"] }),
    ["first_reply", "single_inbox"],
  );
});

test("after the session suggests its own automation", () => {
  assert.deepEqual(ids({ pains: ["after_session"], response: "within_hour" }), ["after_session"]);
});

test("an automation still marked TODO is never shown", () => {
  const draft = { id: "win_back", stage: "שימור", name: "TODO", description: "TODO" };
  const picked = selectAutomations(
    { pains: ["retention"], channels: [], booking_methods: [] },
    [draft],
  );
  assert.deepEqual(picked, []);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { cinematicPolicy } from "../lib/cinematic-policy.ts";
const normal = { reduced: false, saveData: false, paused: false, near: true, visible: true, hidden: false, failed: false };
test("motion and data preferences release media even inside the viewport", () => {
  for (const key of ["reduced", "saveData", "failed"] as const) {
    assert.deepEqual(cinematicPolicy({ ...normal, [key]: true }), { attach: false, play: false, release: true });
  }
});
test("nearby offscreen media may load but cannot play", () => {
  assert.deepEqual(cinematicPolicy({ ...normal, visible: false }), { attach: true, play: false, release: false });
  assert.deepEqual(cinematicPolicy({ ...normal, near: false, visible: false }), { attach: false, play: false, release: false });
});
test("manual pause survives viewport and visibility changes without releasing its frame", () => {
  for (const visible of [true, false]) for (const hidden of [true, false]) {
    assert.deepEqual(cinematicPolicy({ ...normal, paused: true, visible, hidden }), { attach: false, play: false, release: false });
  }
});
test("hidden tabs do not play; returning to an eligible viewport may play", () => {
  assert.equal(cinematicPolicy({ ...normal, hidden: true }).play, false);
  assert.equal(cinematicPolicy(normal).play, true);
});

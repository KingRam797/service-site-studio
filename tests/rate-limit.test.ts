import assert from "node:assert/strict";
import test from "node:test";
import { clientKey, pruneRateLimits, rateLimit } from "../lib/rate-limit.ts";

test("requests inside the limit are allowed", () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.equal(rateLimit("inside", 5, 60_000).allowed, true);
  }
});

test("the request past the limit is rejected with a retry hint", () => {
  for (let attempt = 0; attempt < 3; attempt += 1) rateLimit("past", 3, 60_000);
  const blocked = rateLimit("past", 3, 60_000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});

test("a fresh window opens once the old one expires", () => {
  rateLimit("expiring", 1, 1);
  assert.equal(rateLimit("expiring", 1, 1).allowed, false);
  const later = Date.now() + 10;
  while (Date.now() < later) { /* wait out the 1ms window */ }
  assert.equal(rateLimit("expiring", 1, 1).allowed, true);
});

test("expired windows are pruned so the map cannot grow without bound", () => {
  rateLimit("pruned", 1, 1);
  pruneRateLimits(Date.now() + 1000);
  assert.equal(rateLimit("pruned", 1, 60_000).allowed, true);
});

test("the client key prefers the first forwarded address", () => {
  const request = new Request("https://example.com", {
    headers: { "x-forwarded-for": "203.0.113.7, 198.51.100.2" },
  });
  assert.equal(clientKey(request), "203.0.113.7");
});

test("an unidentifiable client still yields a stable key", () => {
  assert.equal(clientKey(new Request("https://example.com")), "unknown");
});

import assert from "node:assert/strict";
import test from "node:test";
import { emailOwner } from "../lib/inquiry-delivery.ts";
import { siteConfig } from "../config/site.config.ts";

const inquiry = { name: "Test", email: "lead@example.com", message: "A build request." };

/** Swaps global fetch for the duration of one case and records the request. */
async function withFetch(
  handler: (url: string, init: RequestInit) => Response | Promise<Response>,
  run: () => Promise<void>,
) {
  const original = globalThis.fetch;
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), body: JSON.parse(String(init.body)) });
    return handler(String(url), init);
  }) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
  return calls;
}

test("no email is attempted without an API key", async () => {
  delete process.env.RESEND_API_KEY;
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    assert.equal(await emailOwner(inquiry), false);
  });
  assert.equal(calls.length, 0);
});

test("the API key alone is enough — the sender falls back to Resend's test address", async () => {
  process.env.RESEND_API_KEY = "re_test";
  delete process.env.INQUIRY_FROM_EMAIL;
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    assert.equal(await emailOwner(inquiry), true);
  });
  assert.equal(calls.length, 1);
  assert.match(String(calls[0].body.from), /onboarding@resend\.dev/);
});

test("the inquiry is addressed to the configured business email", async () => {
  process.env.RESEND_API_KEY = "re_test";
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    await emailOwner(inquiry);
  });
  assert.deepEqual(calls[0].body.to, [siteConfig.business.email]);
  assert.equal(calls[0].body.reply_to, "lead@example.com");
});

test("INQUIRY_FROM_EMAIL overrides the sender once a domain is verified", async () => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.INQUIRY_FROM_EMAIL = "hello@push2start.com";
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    await emailOwner(inquiry);
  });
  assert.equal(calls[0].body.from, "hello@push2start.com");
  delete process.env.INQUIRY_FROM_EMAIL;
});

test("a rejection from Resend reports failure rather than throwing", async () => {
  process.env.RESEND_API_KEY = "re_test";
  await withFetch(() => new Response("domain not verified", { status: 403 }), async () => {
    assert.equal(await emailOwner(inquiry), false);
  });
});

test("an unreachable provider reports failure rather than throwing", async () => {
  process.env.RESEND_API_KEY = "re_test";
  await withFetch(() => { throw new Error("network down"); }, async () => {
    assert.equal(await emailOwner(inquiry), false);
  });
  delete process.env.RESEND_API_KEY;
});

import assert from "node:assert/strict";
import test from "node:test";
import { deliveryDiagnostics, emailOwner, inquiryRecipient, sendTestEmail } from "../lib/inquiry-delivery.ts";
import { siteConfig } from "../config/site.config.ts";

const inquiry = { name: "Test", email: "lead@example.com", message: "A build request." };

/** Swaps global fetch for the duration of one case and records the request. */
async function withFetch(
  handler: (url: string, init: RequestInit) => Response | Promise<Response>,
  run: () => Promise<void>,
) {
  const original = globalThis.fetch;
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    // Bodyless requests (the diagnostics GET) record an empty body rather than
    // throwing inside the stub and masking the real result.
    calls.push({ url: String(url), body: init.body ? JSON.parse(String(init.body)) : {} });
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
  assert.deepEqual(calls[0].body.to, [siteConfig.business.email.toLowerCase()]);
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

test("INQUIRY_TO_EMAIL redirects the notification without changing the published address", async () => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.INQUIRY_TO_EMAIL = "someone.else@example.com";
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    await emailOwner(inquiry);
  });
  assert.deepEqual(calls[0].body.to, ["someone.else@example.com"]);
  // The site still publishes the business address; only delivery moved.
  assert.equal(siteConfig.business.email, "Push2starter@gmail.com");
  delete process.env.INQUIRY_TO_EMAIL;
});

test("the recipient falls back to the published business address", () => {
  delete process.env.INQUIRY_TO_EMAIL;
  assert.equal(inquiryRecipient(), siteConfig.business.email.toLowerCase());
});

test("both delivery paths normalize the owner address for Resend's test-recipient restriction", async () => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.INQUIRY_TO_EMAIL = "  Push2starter@Gmail.com  ";
  try {
    const calls = await withFetch((_url, init) => {
      const { to } = JSON.parse(String(init.body));
      return to[0] === "push2starter@gmail.com"
        ? new Response('{"id":"accepted"}', { status: 200 })
        : new Response("You can only send testing emails to your own email address", { status: 403 });
    }, async () => {
      assert.equal(await emailOwner(inquiry), true);
      assert.equal((await sendTestEmail()).ok, true);
    });
    assert.equal(calls.length, 2);
    assert.equal(siteConfig.business.email, "Push2starter@gmail.com");
  } finally {
    delete process.env.INQUIRY_TO_EMAIL;
    delete process.env.RESEND_API_KEY;
  }
});

test("a whitespace-only recipient override falls back to the owner address", () => {
  process.env.INQUIRY_TO_EMAIL = "   ";
  try {
    assert.equal(inquiryRecipient(), "push2starter@gmail.com");
  } finally {
    delete process.env.INQUIRY_TO_EMAIL;
  }
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

test("diagnostics report a missing key without calling Resend", async () => {
  delete process.env.RESEND_API_KEY;
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    const report = await deliveryDiagnostics();
    assert.equal(report.resendKeyPresent, false);
    assert.equal(report.resendKeyLooksValid, null);
    assert.equal(report.recipient, siteConfig.business.email.toLowerCase());
    assert.equal(report.senderIsSharedTestAddress, true);
  });
  assert.equal(calls.length, 0);
});

test("diagnostics surface a rejected key and never echo its value", async () => {
  process.env.RESEND_API_KEY = "re_secret_value";
  await withFetch(() => new Response("invalid api key", { status: 401 }), async () => {
    const report = await deliveryDiagnostics();
    assert.equal(report.resendKeyPresent, true);
    assert.equal(report.resendKeyLooksValid, false);
    assert.equal(report.resendAuthStatus, 401);
    assert.ok(!JSON.stringify(report).includes("re_secret_value"));
  });
  delete process.env.RESEND_API_KEY;
});

test("diagnostics confirm a live key", async () => {
  process.env.RESEND_API_KEY = "re_good";
  await withFetch(() => new Response("{\"data\":[]}", { status: 200 }), async () => {
    const report = await deliveryDiagnostics();
    assert.equal(report.resendKeyLooksValid, true);
    assert.equal(report.resendAuthStatus, 200);
  });
  delete process.env.RESEND_API_KEY;
});

test("the test send reports Resend's verbatim refusal", async () => {
  process.env.RESEND_API_KEY = "re_secret_value";
  const refusal = "You can only send testing emails to your own email address";
  await withFetch(() => new Response(refusal, { status: 403 }), async () => {
    const result = await sendTestEmail();
    assert.equal(result.attempted, true);
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.match(String(result.body), /only send testing emails/);
    assert.ok(!JSON.stringify(result).includes("re_secret_value"));
  });
  delete process.env.RESEND_API_KEY;
});

test("the test send does not fire without a key", async () => {
  delete process.env.RESEND_API_KEY;
  const calls = await withFetch(() => new Response("{}", { status: 200 }), async () => {
    assert.equal((await sendTestEmail()).attempted, false);
  });
  assert.equal(calls.length, 0);
});

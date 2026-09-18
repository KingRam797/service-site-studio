import assert from "node:assert/strict";
import test from "node:test";
import { resolveSiteUrl } from "../lib/site-url.ts";

test("an explicit custom domain wins over everything", () => {
  assert.equal(
    resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://push2start.com", VERCEL_PROJECT_PRODUCTION_URL: "ignored.vercel.app" }),
    "https://push2start.com",
  );
});

test("Vercel's production domain is used when no custom domain is set", () => {
  assert.equal(
    resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "push2start.vercel.app" }),
    "https://push2start.vercel.app",
  );
});

test("a renamed Vercel project changes the canonical without a code edit", () => {
  assert.equal(
    resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "renamed-later.vercel.app" }),
    "https://renamed-later.vercel.app",
  );
});

test("the URL is absolute even with nothing configured", () => {
  assert.match(resolveSiteUrl({}), /^https:\/\//);
});

test("a trailing slash never doubles up", () => {
  assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://push2start.com/" }), "https://push2start.com");
});

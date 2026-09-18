import assert from "node:assert/strict";
import test from "node:test";
import { siteConfig } from "../config/site.config.ts";
import { hasDialablePhone, validateSiteConfig } from "../lib/config.ts";

test("the shipped client configuration is valid", () => {
  assert.deepEqual(validateSiteConfig(siteConfig), []);
});

test("services remain the source for the inquiry choices", () => {
  assert.ok(siteConfig.services.items.length >= 1);
  assert.equal(new Set(siteConfig.services.items.map((service) => service.name)).size, siteConfig.services.items.length);
});

test("the legal entity and a dialable phone are set for the legal pages and schema", () => {
  assert.ok(siteConfig.business.legalEntity.trim().length > 0);
  assert.ok(!/TODO_FROM_KING/.test(siteConfig.business.legalEntity));
  assert.ok(hasDialablePhone(siteConfig.business.phone));
});

test("no placeholder token survives in user-facing config", () => {
  assert.ok(!JSON.stringify(siteConfig).includes("TODO_FROM_KING"));
});

test("conversion collects a name, message, and contact method", () => {
  assert.ok(siteConfig.conversion.fields.includes("name"));
  assert.ok(siteConfig.conversion.fields.includes("message"));
  assert.ok(siteConfig.conversion.fields.includes("email") || siteConfig.conversion.fields.includes("phone"));
});

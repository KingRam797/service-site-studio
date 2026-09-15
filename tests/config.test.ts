import assert from "node:assert/strict";
import test from "node:test";
import { siteConfig } from "../config/site.config.ts";
import { validateSiteConfig } from "../lib/config.ts";

test("the shipped client configuration is valid", () => {
  assert.deepEqual(validateSiteConfig(siteConfig), []);
});

test("services remain the source for the inquiry choices", () => {
  assert.ok(siteConfig.services.items.length >= 1);
  assert.equal(new Set(siteConfig.services.items.map((service) => service.name)).size, siteConfig.services.items.length);
});

test("conversion collects a name, message, and contact method", () => {
  assert.ok(siteConfig.conversion.fields.includes("name"));
  assert.ok(siteConfig.conversion.fields.includes("message"));
  assert.ok(siteConfig.conversion.fields.includes("email") || siteConfig.conversion.fields.includes("phone"));
});

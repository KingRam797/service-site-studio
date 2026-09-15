import type { SiteConfig } from "@/config/types";

const hexPattern = /^#[0-9a-f]{6}$/i;

export function validateSiteConfig(config: SiteConfig): string[] {
  const errors: string[] = [];
  const required = [
    ["business.name", config.business.name],
    ["business.location", config.business.location],
    ["business.phone", config.business.phone],
    ["business.email", config.business.email],
    ["hero.headline", config.hero.headline],
    ["conversion.heading", config.conversion.heading],
  ] as const;

  for (const [label, value] of required) {
    if (!value.trim()) errors.push(`${label} is required`);
  }

  for (const [name, value] of Object.entries({
    background: config.theme.background,
    surface: config.theme.surface,
    ink: config.theme.ink,
    muted: config.theme.muted,
    accent: config.theme.accent,
    accentAlt: config.theme.accentAlt,
  })) {
    if (!hexPattern.test(value)) errors.push(`theme.${name} must be a six-digit hex color`);
  }

  if (config.services.items.length < 1) errors.push("At least one service is required");
  if (config.proof.items.length < 1) errors.push("At least one proof item is required");
  if (new Set(config.conversion.fields).size !== config.conversion.fields.length) {
    errors.push("conversion.fields cannot contain duplicates");
  }
  if (!config.conversion.fields.includes("name")) errors.push("conversion.fields must include name");
  if (!config.conversion.fields.includes("message")) errors.push("conversion.fields must include message");
  if (!config.conversion.fields.includes("email") && !config.conversion.fields.includes("phone")) {
    errors.push("conversion.fields must include email or phone");
  }

  return errors;
}

export function configToCss(config: SiteConfig): React.CSSProperties {
  const radii = { none: "0px", soft: "18px", round: "999px" };
  return {
    "--bg": config.theme.background,
    "--surface": config.theme.surface,
    "--ink": config.theme.ink,
    "--muted": config.theme.muted,
    "--accent": config.theme.accent,
    "--accent-alt": config.theme.accentAlt,
    "--display": config.theme.displayFont,
    "--body": config.theme.bodyFont,
    "--radius": radii[config.theme.radius],
  } as React.CSSProperties;
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

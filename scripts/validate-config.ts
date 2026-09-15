import { siteConfig } from "../config/site.config.ts";
import { validateSiteConfig } from "../lib/config.ts";

const errors = validateSiteConfig(siteConfig);
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Configuration valid: ${siteConfig.business.name}`);

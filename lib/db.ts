import { neon } from "@neondatabase/serverless";

export const databaseConfigured = Boolean(process.env.DATABASE_URL);

let sqlClient: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  sqlClient ??= neon(process.env.DATABASE_URL);
  return sqlClient;
}

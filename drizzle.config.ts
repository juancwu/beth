import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  out: "./migrations",
} satisfies Config;

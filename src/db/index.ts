import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.AUTH_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });

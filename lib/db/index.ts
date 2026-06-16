import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

let _db: DB | undefined;

function getDb(): DB {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Add it to your environment (see .env.local.example).",
      );
    }
    _db = drizzle(neon(url), { schema });
  }
  return _db;
}

// Lazy proxy so importing this module never connects at build time — the
// Neon client is only created on first actual property access (a query).
export const db: DB = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

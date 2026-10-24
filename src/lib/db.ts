import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import { mkdirSync } from "node:fs";
import * as schema from "./schema";

// DATABASE_URL байвал жинхэнэ Postgres, байхгүй бол локал хөгжүүлэлтэд .data/ дахь PGlite.
type DB = NodePgDatabase<typeof schema>;

const g = globalThis as unknown as { __db?: DB; __pglite?: PGlite };

function make(): DB {
  const url = process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: url, max: 5 });
    return drizzlePg(pool, { schema });
  }
  return drizzlePglite(lite(), { schema }) as unknown as DB;
}

export const db: DB = (g.__db ??= make());

export async function rawExec(sql: string) {
  const url = process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: url, max: 1 });
    try { await pool.query(sql); } finally { await pool.end(); }
    return;
  }
  await lite().exec(sql);
}

function lite() {
  if (!g.__pglite) {
    const dir = process.env.PGLITE_DIR ?? ".data/pg";
    mkdirSync(dir, { recursive: true });
    g.__pglite = new PGlite(dir);
  }
  return g.__pglite;
}

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import type BetterSqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../config/env.js';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(__dirname, '../..');
const dbPath = path.resolve(apiRoot, env.DATABASE_URL);

mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite: BetterSqlite3.Database = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export { sqlite };

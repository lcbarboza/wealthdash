## 1. Dependencies and Configuration

- [x] 1.1 Install `better-sqlite3`, `drizzle-orm`, and `drizzle-kit` in `apps/api`
- [x] 1.2 Install `@types/better-sqlite3` as a dev dependency
- [x] 1.3 Create `apps/api/drizzle.config.ts` (Drizzle Kit configuration)
- [x] 1.4 Add `DATABASE_URL` to `src/config/env.ts` with default `data/wealthdash.db`
- [x] 1.5 Add `data/` to `.gitignore`

## 2. Database Module

- [x] 2.1 Create `src/db/schema.ts` (empty initial schema, re-export point)
- [x] 2.2 Create `src/db/index.ts` (singleton connection with WAL mode)
- [x] 2.3 Create `src/db/migrate.ts` (migration runner using `drizzle-orm/better-sqlite3/migrator`)

## 3. Server Integration

- [x] 3.1 Call migration runner during server startup in `src/server.ts`
- [x] 3.2 Extend `GET /health` to include database connectivity status

## 4. Scripts and Tooling

- [x] 4.1 Add `db:generate` and `db:studio` scripts to `apps/api/package.json`
- [x] 4.2 Generate initial (empty) migration baseline
- [x] 4.3 Run Biome auto-fix and verify lint passes
- [x] 4.4 Verify server starts correctly and health endpoint returns database status

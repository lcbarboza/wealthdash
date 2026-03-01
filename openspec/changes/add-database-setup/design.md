## Context

The backend (`apps/api`) currently has no persistence. All upcoming features (assets, transactions, positions, income events) require a database. This change introduces the database layer as foundational infrastructure.

Key constraints from `project.md`:
- Personal app, single user — no need for a multi-tenant database server
- MVP must work with manual entry and no required external integrations
- Architecture should remain future-friendly for Postgres migration

## Goals / Non-Goals

**Goals:**
- Provide a type-safe, zero-config database that works out of the box
- Establish migration infrastructure so schema changes are versioned and reproducible
- Keep the database layer thin and simple — no premature abstractions
- Ensure the ORM choice gives strict TypeScript integration

**Non-Goals:**
- Define domain tables (assets, transactions) — those come in subsequent changes
- Support multiple database engines simultaneously
- Add connection pooling or clustering (single-user app)

## Decisions

### Database Engine: SQLite via `better-sqlite3`

**Rationale:**
- Zero external dependencies — no database server to install/manage
- Embedded, single-file database — perfect for a personal app
- Excellent performance for single-user read/write patterns
- `better-sqlite3` is synchronous, which simplifies Fastify request handling (no connection pool management)
- Future migration to Postgres is straightforward with Drizzle (same schema definitions, different driver)

**Alternatives considered:**
- **PostgreSQL**: More powerful but requires running a server. Overkill for a single-user personal app. Can migrate later if needed.
- **JSON files**: Too fragile for relational data (assets, transactions, positions). No query capabilities.

### ORM: Drizzle ORM

**Rationale:**
- TypeScript-first with full type inference from schema definitions
- SQL-like API — no magic, easy to understand generated queries
- Lightweight (no heavy runtime, no entity manager)
- Built-in migration tooling via Drizzle Kit
- Excellent SQLite support via `drizzle-orm/better-sqlite3`
- Schema-as-code: tables defined in TypeScript, migrations generated from diffs

**Alternatives considered:**
- **Prisma**: Heavier runtime, requires code generation step, schema in separate DSL file (not TypeScript)
- **Kysely**: Great query builder but no built-in migration tooling or schema definition layer
- **Raw SQL**: Maximum control but no type safety, manual migration management

### Migration Strategy: Drizzle Kit (generate + migrate)

**Workflow:**
1. Define/modify schema in `src/db/schema.ts`
2. Run `drizzle-kit generate` to produce SQL migration files
3. Migrations are applied automatically on server startup via `drizzle-orm/better-sqlite3/migrator`
4. Migration files are committed to git (versioned, reproducible)

**Database file location:**
- Default: `data/wealthdash.db` (relative to `apps/api/`)
- Configurable via `DATABASE_URL` environment variable
- The `data/` directory is gitignored

### Directory Structure

```
apps/api/
├── src/
│   └── db/
│       ├── index.ts        # Database connection (singleton)
│       ├── schema.ts       # Drizzle table definitions (empty initially)
│       └── migrate.ts      # Migration runner
├── drizzle/                # Generated migration SQL files
├── drizzle.config.ts       # Drizzle Kit configuration
└── data/                   # SQLite database file (gitignored)
```

## Risks / Trade-offs

- **SQLite concurrent writes**: SQLite uses file-level locking. For a single-user app this is irrelevant, but it would be a bottleneck for multi-user. Mitigation: Drizzle makes switching to Postgres straightforward if needed.
- **Synchronous `better-sqlite3`**: Blocks the event loop during queries. Mitigation: Queries on a small personal dataset are sub-millisecond. WAL mode is enabled for better read concurrency.
- **Migration on startup**: Could slow down cold starts if migrations are heavy. Mitigation: Migrations on a small schema are instant. Log migration status for observability.

## Open Questions

None — this is a well-understood pattern for the chosen stack.

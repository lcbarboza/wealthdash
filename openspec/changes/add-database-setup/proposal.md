# Change: Add Database Setup

## Why

The backend scaffold has no persistence layer. Every upcoming feature (asset registration, transactions, positions) requires a database. We need to establish the database connection, ORM, and migration infrastructure before any domain data can be stored.

## What Changes

- Add SQLite database via `better-sqlite3` as the persistence engine
- Add Drizzle ORM for type-safe database access and schema definitions
- Add Drizzle Kit for schema-driven migrations
- Create database connection module (`src/db/index.ts`)
- Create migration runner that executes on server startup
- Add initial empty migration baseline
- Update `project.md` to reflect database conventions

## Impact

- Affected specs: new `database-setup` capability
- Affected code: `apps/api/` (new `src/db/` directory, updated `src/server.ts`, new dependencies)

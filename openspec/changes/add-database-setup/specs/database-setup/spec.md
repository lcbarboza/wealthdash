## ADDED Requirements

### Requirement: Database Connection

The system SHALL provide a SQLite database connection via `better-sqlite3` with Drizzle ORM, configured as a singleton module at `src/db/index.ts`.

The database file location SHALL default to `data/wealthdash.db` (relative to `apps/api/`) and be configurable via a `DATABASE_URL` environment variable.

The connection SHALL enable WAL (Write-Ahead Logging) mode for improved read concurrency.

#### Scenario: Default database connection

- **GIVEN** no `DATABASE_URL` environment variable is set
- **WHEN** the database module is imported
- **THEN** a SQLite database file is created at `data/wealthdash.db`
- **AND** the connection uses WAL journal mode

#### Scenario: Custom database path

- **GIVEN** `DATABASE_URL` is set to a custom file path
- **WHEN** the database module is imported
- **THEN** the SQLite database file is created at the specified path

### Requirement: Schema Definitions

The system SHALL define database table schemas using Drizzle ORM's SQLite schema builders in `src/db/schema.ts`.

All table definitions SHALL be co-located in `src/db/schema.ts` (or re-exported from it) to serve as the single source of truth for the database structure.

#### Scenario: Empty initial schema

- **GIVEN** the database setup is freshly installed
- **WHEN** `src/db/schema.ts` is reviewed
- **THEN** it exports an empty schema object (no domain tables yet — those are added in subsequent changes)

### Requirement: Migration Infrastructure

The system SHALL use Drizzle Kit to generate SQL migration files from schema changes and store them in `apps/api/drizzle/`.

Migrations SHALL be applied automatically on server startup via `drizzle-orm/better-sqlite3/migrator`.

Migration files SHALL be committed to version control to ensure reproducible database state across environments.

#### Scenario: Migrations run on startup

- **GIVEN** the server starts and there are pending migrations in `drizzle/`
- **WHEN** the migration runner executes
- **THEN** all pending migrations are applied in order
- **AND** the migration status is logged

#### Scenario: No pending migrations

- **GIVEN** the server starts and all migrations have already been applied
- **WHEN** the migration runner executes
- **THEN** no changes are made to the database
- **AND** startup continues normally

#### Scenario: Generate migration from schema change

- **GIVEN** a developer modifies `src/db/schema.ts`
- **WHEN** `drizzle-kit generate` is executed
- **THEN** a new SQL migration file is created in `drizzle/` reflecting the schema diff

### Requirement: Database File Exclusion

The SQLite database file and the `data/` directory SHALL be excluded from version control via `.gitignore`.

#### Scenario: Database file not tracked

- **GIVEN** the server has been started and a database file exists
- **WHEN** `git status` is run
- **THEN** the `data/` directory and its contents do not appear as untracked files

### Requirement: Health Check Database Status

The existing `GET /health` endpoint SHALL be extended to include database connectivity status in its response.

#### Scenario: Health check with database connected

- **GIVEN** the database connection is healthy
- **WHEN** `GET /health` is called
- **THEN** the response includes `"database": "ok"` alongside the existing status and uptime fields

#### Scenario: Health check with database error

- **GIVEN** the database connection has failed
- **WHEN** `GET /health` is called
- **THEN** the response includes `"database": "error"` and the overall status reflects the degraded state

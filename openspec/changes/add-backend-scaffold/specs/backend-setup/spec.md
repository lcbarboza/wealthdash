## ADDED Requirements

### Requirement: API Workspace Configuration
The `apps/api` workspace MUST be configured as an npm workspace with Fastify, TypeScript in strict mode, and the directory structure defined in `project.md`.

#### Scenario: Workspace is resolvable
- **GIVEN** `apps/api/package.json` exists with a valid `name` field
- **WHEN** `npm install` is run from the project root
- **THEN** the `apps/api` workspace MUST be linked and its dependencies installed without errors

#### Scenario: TypeScript strict mode enforced
- **GIVEN** the `apps/api/tsconfig.json` file
- **WHEN** a developer inspects the compiler options
- **THEN** `strict: true` MUST be enabled

#### Scenario: Directory structure follows project conventions
- **GIVEN** the `apps/api/src` directory
- **WHEN** a developer inspects the folder layout
- **THEN** the directories `routes/`, `services/`, `utils/`, `types/`, and `config/` MUST exist

### Requirement: Fastify Server Entry Point
The `apps/api` workspace MUST have a Fastify server entry point that starts and listens on a configurable port.

#### Scenario: Server starts successfully
- **GIVEN** all dependencies are installed
- **WHEN** `npm run dev` is executed in `apps/api`
- **THEN** the Fastify server MUST start and listen on the configured port without errors

#### Scenario: Production build succeeds
- **GIVEN** all dependencies are installed
- **WHEN** `npm run build` is executed in `apps/api`
- **THEN** TypeScript MUST compile without errors and produce output in the `dist/` directory

### Requirement: Root Scripts for API Workspace
The root `package.json` MUST include convenience scripts to run api workspace commands.

#### Scenario: Root dev script starts the API server
- **GIVEN** the root `package.json`
- **WHEN** `npm run dev:api` is executed from the project root
- **THEN** the api workspace dev server MUST start

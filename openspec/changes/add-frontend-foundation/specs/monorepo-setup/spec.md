## ADDED Requirements

### Requirement: npm Workspaces Configuration
The project MUST use npm workspaces to manage a monorepo with workspace packages under the `apps/` directory.

#### Scenario: Root package.json declares workspaces
- **GIVEN** the root `package.json` exists
- **WHEN** a developer inspects the `workspaces` field
- **THEN** it MUST include `apps/*` as a workspace glob

#### Scenario: Web workspace is resolvable
- **GIVEN** `apps/web/package.json` exists with a valid `name` field
- **WHEN** `npm install` is run from the project root
- **THEN** the `apps/web` workspace MUST be linked and its dependencies installed without errors

### Requirement: Monorepo Root Structure
The project root MUST contain shared configuration files that apply across all workspaces.

#### Scenario: Biome configuration at root
- **GIVEN** the monorepo root directory
- **WHEN** a developer checks for linting/formatting configuration
- **THEN** a `biome.json` file MUST exist at the root with project-wide rules (2-space indent, single quotes)

#### Scenario: Root package.json scripts
- **GIVEN** the root `package.json`
- **WHEN** a developer needs to run common tasks
- **THEN** convenience scripts MUST exist to run dev, build, and lint commands for the web workspace

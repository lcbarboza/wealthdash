## ADDED Requirements

### Requirement: React 19 with TypeScript
The `apps/web` workspace MUST use React 19 with TypeScript in strict mode as the frontend framework.

#### Scenario: React app renders successfully
- **GIVEN** the `apps/web` workspace is set up
- **WHEN** the dev server is started with `npm run dev`
- **THEN** the React application MUST render without errors in the browser

#### Scenario: TypeScript strict mode enforced
- **GIVEN** the `apps/web/tsconfig.json` file
- **WHEN** a developer inspects the compiler options
- **THEN** `strict: true` MUST be enabled

### Requirement: Vite Build Pipeline
The `apps/web` workspace MUST use Vite as its build tool for development and production builds.

#### Scenario: Development server starts
- **GIVEN** all dependencies are installed
- **WHEN** `npm run dev` is executed in `apps/web`
- **THEN** a local dev server MUST start with hot module replacement enabled

#### Scenario: Production build succeeds
- **GIVEN** all dependencies are installed
- **WHEN** `npm run build` is executed in `apps/web`
- **THEN** a production bundle MUST be generated in the `dist/` directory without errors

### Requirement: Biome Lint and Format
The monorepo MUST use Biome as the single lint and format tool, configured at the root and applying to all workspaces.

#### Scenario: Lint check passes on scaffolded code
- **GIVEN** the project is freshly scaffolded
- **WHEN** `npx @biomejs/biome check .` is run from the project root
- **THEN** no lint or format errors MUST be reported on application source files

#### Scenario: Biome enforces project conventions
- **GIVEN** the `biome.json` configuration
- **WHEN** a developer inspects the formatting rules
- **THEN** indentation MUST be set to 2 spaces and quote style MUST be set to single quotes

## Context
This is the first code change in the Wealth Dash project. The monorepo must follow the layout defined in `project.md` (`apps/web` for frontend, `apps/api` for backend). Only the frontend workspace (`apps/web`) is scaffolded in this change; the backend workspace is out of scope.

The visual identity must support a finance-oriented dashboard application with dark and light mode readiness, using a professional color palette that conveys trust and clarity.

## Goals / Non-Goals
- Goals:
  - Establish a working monorepo with `npm workspaces`
  - Scaffold `apps/web` with React 19 + Vite + TypeScript (strict mode)
  - Configure Biome as the single lint/format tool at the monorepo root
  - Set up Tailwind CSS v4 with a defined design token system
  - Define a visual identity: color palette, typography scale, spacing scale, border radii
  - Verify the pipeline works end-to-end (dev server starts, build succeeds)

- Non-Goals:
  - Scaffolding `apps/api` (separate change)
  - Routing or page structure beyond a minimal shell
  - Component library or UI kit (future work)
  - Dark mode toggle implementation (this change only defines the token foundation)
  - State management setup

## Decisions

### Monorepo tool: npm workspaces
- **Decision**: Use npm workspaces as defined in `project.md`
- **Alternatives considered**: pnpm workspaces, Turborepo. npm workspaces is the project convention and sufficient for the current scale.

### Build tool: Vite
- **Decision**: Use Vite as the build tool for `apps/web`, as specified in `project.md`
- **Rationale**: Fast HMR, first-class React/TS support, minimal config

### CSS framework: Tailwind CSS v4
- **Decision**: Use Tailwind CSS v4 with CSS-first configuration
- **Rationale**: Tailwind v4 uses CSS-based configuration (`@theme` directives) instead of `tailwind.config.js`, reducing config files and aligning with modern CSS practices

### Visual identity approach: Tailwind theme + CSS custom properties
- **Decision**: Define design tokens as Tailwind `@theme` extensions that generate CSS custom properties
- **Rationale**: Tokens are accessible from both utility classes and custom CSS. This approach keeps a single source of truth and enables future dark mode via CSS variable swapping.
- **Alternatives considered**: Separate design-tokens package, CSS-only variables without Tailwind integration. The Tailwind-first approach is simpler and avoids an extra build step.

### Typography: System font stack
- **Decision**: Use a system font stack (Inter as preferred web font, falling back to system UI fonts)
- **Rationale**: Good readability for financial data, widely available, no custom font loading complexity in MVP

## Risks / Trade-offs
- **Tailwind v4 is relatively new** -> Mitigation: v4 is stable and well-documented; the project is greenfield so no migration burden
- **Visual identity defined before UI exists** -> Mitigation: tokens are intentionally minimal and can be extended; the goal is consistency, not completeness

## Open Questions
- None at this stage. The tech stack and conventions are well-defined in `project.md`.

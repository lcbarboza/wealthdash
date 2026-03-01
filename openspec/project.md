# Project Context

## Purpose

**Investimentos** is a personal app to **track, register, and analyze an investment portfolio** in a consolidated way.

Core goals:

- Register assets and organize them by **asset class**, **sector**, and **currency**
- Record **transactions** (buy/sell) and **income events** (dividends/JCP/interest)
- Provide **dashboards** and consolidated views (total value, performance, allocation, risk/concentration)
- Generate **insights** for the overall portfolio (e.g., sector concentration, rebalancing suggestions, per-asset analysis, alerts)
- Follow a spec-first workflow using **OpenCode + OpenSpec** (plan/spec before implementation)

Initial MVP scope:

- Manual asset + transaction registration
- Basic position/performance calculations
- Initial dashboards and per-asset detail pages
- A structure that is ready to integrate market data/prices later

## Tech Stack

- **Monorepo**: npm workspaces
- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Fastify, TypeScript
- **Tooling**: Biome (lint/format), Docker

## Project Conventions

### Code Style

- **TypeScript**
  - `strict: true` enabled everywhere
  - Prefer explicit types at module boundaries (public functions, service interfaces, API request/response DTOs)
- **Formatting / Lint**
  - Biome for linting + formatting across the monorepo
  - 2-space indentation
  - Single quotes
- **Frontend (React)**
  - Functional components only
  - Hooks-based state/effects
  - Prefer composition over inheritance
  - Keep UI components presentational when possible; move logic into hooks/services
- **Naming**
  - `PascalCase` for React components and types/interfaces
  - `camelCase` for functions/variables
  - `kebab-case` for file/folder names where applicable (or keep consistent with repo standard)

### Architecture Patterns

- **Monorepo layout**
  - `apps/api` — Fastify backend
  - `apps/web` — React frontend
- **Backend: service-oriented architecture**
  - `services/` — business logic (e.g., `PortfolioService`, `TransactionsService`, `InsightsService`)
  - `routes/` — HTTP endpoints (no business logic in route handlers)
  - `utils/` — pure utility functions (no side effects)
  - `types/` — backend domain types/interfaces (DTOs, entities, enums)
  - `config/` — configuration constants and environment-driven settings
- **Frontend**
  - Keep API access in a dedicated layer (e.g., `services/` or `api/`), separate from UI
  - Dashboards should be built from composable widgets/cards
- **OpenSpec workflow (mandatory)**
  - Meaningful changes start with specs (e.g., `project.md`, plus `specs/**` / `openspec/**` depending on workspace conventions)
  - Implementation only starts after the plan/spec is coherent and agreed by you (as the author)

### Testing Strategy

- **Unit tests** for:
  - Backend services (`services/`) and pure utilities (`utils/`)
  - Frontend hooks and non-UI business logic (calculations, aggregations, formatting)
- **Integration tests** for:
  - API routes (Fastify server in test environment)
- **E2E tests** (later, once core flows stabilize):
  - Asset registration → transaction entry → position view
  - Consolidated dashboard and filters (asset class, sector, currency)
- Keep tests deterministic; avoid relying on real external services (use mocks/stubs).

### Git Workflow

- Trunk-based or simple feature-branch workflow:
  - Branches like `feat/...`, `fix/...`, `chore/...`
  - PRs merge into `main`
- Commit convention (suggested):
  - Conventional Commits style: `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`, `test: ...`
- Keep commits small and focused; include tests when adding/modifying behavior.

## Domain Context

The domain centers around **portfolio**, **assets**, **trades/operations**, and **market data**.

Expected conceptual entities:

- **Asset**
  - Identifier (ticker/symbol), name, type (stock, ETF, REIT/FII, fixed income, crypto, etc.)
  - Asset class (fixed income/equities/real estate/alternatives), **sector**, country/exchange, base currency
- **Transaction**
  - Date (DD/MM/YYYY), type (buy/sell), quantity, unit price, fees
  - Linked to an asset and, later, to a broker/account
- **IncomeEvent**
  - Payment date, net amount, type (dividend/JCP/coupon), reinvest (yes/no)
- **Position**
  - Current quantity, average cost, cost basis, market value, realized/unrealized P&L
- **PriceSnapshot**
  - Price by date/time, currency, source (future)
- **Portfolio**
  - Set of positions + target allocations (targets by asset class/sector/asset)

Metrics and rules (phased):

- MVP:
  - Position per asset (quantity, avg cost, cost basis, market value when prices exist)
  - Consolidated totals
  - Allocation by asset class and sector (based on asset metadata)
- Later:
  - Performance (TWR/MWR), volatility, drawdown, concentration, suggested rebalancing
  - Alerts: allocation drift, concentration thresholds, relevant events (income, large moves)

Display conventions (UI/reporting):

- Dates: **DD/MM/YYYY**
- Currency formatting: **R$** with 2 decimals (e.g., `R$ 1,234.56` — adjust formatting per locale in UI)
- Percent changes: signed with 2 decimals (e.g., `+3.25%`, `-1.10%`)
- Default timezone: `America/Sao_Paulo` (especially for “end of day” summaries)

## Important Constraints

- Monorepo required with npm workspaces (`apps/api` and `apps/web`)
- TypeScript strict mode across frontend and backend
- Biome is the single source of truth for linting/formatting (2 spaces, single quotes)
- Backend business logic must follow the services pattern (no business logic in route handlers)
- MVP must be usable with **manual entry** and no required external integrations
- Architecture should remain future-friendly for:
  - Market data and FX integrations
  - Broker note / CSV imports
  - Multiple portfolios/accounts (if desired)

## External Dependencies

- **None required initially** (keep the first version self-contained).
- **Future (optional, incremental)**:
  - Market data provider (prices for stocks/ETFs/FIIs), FX, and benchmarks (Selic/IPCA)
  - Database (e.g., Postgres) and migrations
  - Authentication (if it becomes multi-user)
  - Persistence/backup and export (CSV/JSON)
  - Analytics/telemetry (with opt-out)
  
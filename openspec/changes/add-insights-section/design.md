## Context
The portfolio app has a working dashboard with allocation charts (by asset class, type, currency, sector) and a `PortfolioService` that already computes all the breakdown data. However, this data is purely descriptive — it tells the user "what is" but not "what to think about." The Insights section adds an analytical layer that interprets allocation data and surfaces actionable observations.

This change is cross-cutting: it introduces a new backend service, a new API endpoint, a new frontend page, and new UI components. The `InsightsService` depends on `PortfolioService` data but does not modify it.

## Goals / Non-Goals

### Goals
- Provide a dedicated Insights page that acts as an extensible container for multiple insight categories
- Ship the first insight category: **Asset Allocation Analysis** with rule-based detection of allocation issues
- Each insight is a structured card with severity, title, description, and supporting data — easy to scan and understand
- The insight rules are simple, deterministic, and configurable via thresholds
- Server-side analysis: the backend returns pre-computed insights so the frontend is purely presentational

### Non-Goals
- AI/ML-powered insights or natural language generation — simple rules are sufficient for MVP
- Historical trend analysis (requires time-series data we don't have yet)
- Performance attribution (TWR/MWR) — future insight category
- Rebalancing recommendations with target allocations — future insight category
- Real-time alerts or push notifications — future scope
- Customizable thresholds from the UI — hardcoded thresholds are fine for a personal app

## Decisions

### 1. Server-side rule engine vs client-side analysis
- **Decision**: Server-side in `InsightsService`
- **Rationale**: Keeps analysis logic centralized and testable. The service calls `PortfolioService.getPortfolioSummary()` internally, applies rules, and returns structured results. The frontend just renders cards.
- **Alternatives considered**: Client-side analysis (fetch portfolio summary, run rules in React). Rejected because it duplicates threshold logic, makes testing harder, and couples the UI to analysis logic.

### 2. Insight data structure
- **Decision**: Each insight is an object with `{ id, category, severity, title, description, data }` where `data` is a flexible key-value object for context-specific values (e.g., `{ asset_class: "EQUITY", weight: 75, threshold: 70 }`)
- **Rationale**: A uniform shape makes it easy for the frontend to render consistently with severity-based styling. The `data` field allows each rule to attach relevant context without a rigid schema.

### 3. Severity levels
- **Decision**: Three levels: `info` (informational, no action needed), `warning` (worth reviewing), `critical` (needs attention)
- **Rationale**: Maps cleanly to visual styling (blue, amber, red) and avoids over-engineering with 5+ levels. Thresholds determine severity (e.g., 70% concentration = warning, 85% = critical).

### 4. Insight categories (extensibility)
- **Decision**: Each insight has a `category` field (e.g., `allocation`, `risk`, `income`, `performance`). The API endpoint is per-category (`/api/insights/allocation`). The Insights page renders sections per category, fetching each independently.
- **Rationale**: Per-category endpoints allow incremental development — ship allocation insights now, add `/api/insights/risk` later without changing the allocation endpoint. The frontend page can progressively add sections.
- **Alternatives considered**: Single `/api/insights` endpoint returning all categories at once. Rejected because it couples all insight types and makes the endpoint grow unboundedly.

### 5. Reusing PortfolioService vs separate queries
- **Decision**: `InsightsService` calls `PortfolioService.getPortfolioSummary()` to get the allocation data, then applies rules on top of it
- **Rationale**: Avoids duplicating the aggregation logic. `PortfolioSummary` already has all the breakdowns (by asset class, type, currency, sector, wallet) and top holdings. The insight rules are pure functions over this data.

### 6. Threshold configuration
- **Decision**: Hardcoded constants in the insights service (e.g., `ASSET_CLASS_CONCENTRATION_WARNING = 0.70`, `SINGLE_ASSET_WARNING = 0.20`)
- **Rationale**: This is a personal app — no need for a settings UI. Constants are easy to tune and well-documented in code. Can be moved to the settings table later if needed.

### 7. Frontend page structure
- **Decision**: New `/insights` route with a page that has a header, a summary/health banner, and a grid of insight cards. Cards are grouped by category. Each card shows severity icon, title, and description with expandable data.
- **Rationale**: Follows the existing page pattern (`space-y-6 p-6`). Insight cards reuse the visual language of the dashboard section cards (rounded-xl, border, bg-white) with severity-based accent colors.

## Risks / Trade-offs

- **Stale data**: Insights depend on `PortfolioSummary` which depends on manually-updated prices. Insight cards will reflect the last updated state. Mitigation: the API response includes a `generated_at` timestamp and the UI can show "last analyzed" time.
- **Threshold tuning**: Hardcoded thresholds may not suit every investor's risk tolerance. Mitigation: start with conservative/commonly-accepted thresholds; parameterize later if needed.
- **Empty state**: If the portfolio has few positions or no priced positions, most rules won't trigger. Mitigation: show an "all clear" or "insufficient data" message gracefully.
- **Performance**: `getPortfolioSummary()` is called for each insight endpoint. For a personal portfolio this is fast. If multiple insight categories each call it, consider caching the summary within a request cycle.

## Open Questions
- None. The first insight category (allocation) is well-defined and self-contained.

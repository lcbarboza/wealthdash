## Context
The dashboard is a static placeholder. Positions already exist per-wallet with `value_brl` normalization and market value computation. The gap is a cross-wallet aggregation layer and a frontend that surfaces allocation analytics. The data model already has `asset_class`, `asset_type`, `currency`, and `sector` as grouping dimensions — all stored on assets and partially propagated through the Position response.

## Goals / Non-Goals

### Goals
- Provide a single API endpoint that returns a portfolio-wide allocation summary without requiring the frontend to fetch and aggregate positions from each wallet individually
- Surface allocation breakdowns by asset class, asset type, currency, and sector
- Show total portfolio value, cost basis, and unrealized gain/loss in BRL
- Show top holdings ranked by portfolio weight
- Replace the dashboard placeholder with actionable allocation views

### Non-Goals
- Performance metrics (TWR, MWR, volatility, drawdown) — future work
- Historical allocation tracking or time-series — future work
- Target allocation / rebalancing suggestions — future work
- Real-time price updates or WebSocket feeds — future work
- Charts requiring external charting libraries — use HTML/CSS-based visualizations or defer to future enhancement

## Decisions

### 1. Server-side aggregation vs client-side
- **Decision**: Server-side aggregation in a new `PortfolioService`
- **Rationale**: The backend already owns the position computation logic. Aggregating across wallets on the server avoids N+1 fetches from the frontend and keeps allocation math in one place. The endpoint returns pre-computed breakdowns so the frontend is purely presentational.
- **Alternatives considered**: Client-side aggregation (fetch all wallets, fetch positions per wallet, aggregate in React). Rejected because it requires multiple API calls, duplicates business logic on the frontend, and doesn't scale if more wallets are added.

### 2. Endpoint design
- **Decision**: `GET /api/portfolio/summary` returns a single JSON object with all allocation breakdowns
- **Rationale**: One call, one render. The dashboard loads everything it needs in a single request. The response includes total values and pre-grouped breakdowns to avoid any computation on the frontend.
- **Alternatives considered**: Separate endpoints per breakdown type (`/api/portfolio/by-class`, `/api/portfolio/by-currency`). Rejected for simplicity — the data volume is small (personal portfolio) and one request is better UX.

### 3. Handling positions without market value
- **Decision**: Positions without `current_price` (and therefore no `market_value` or `value_brl`) are excluded from allocation percentages but included in a "Missing Price" indicator so the user knows their allocation view may be incomplete.
- **Rationale**: You can't compute allocation weight without knowing the current value. Including cost basis as a fallback would mix realized costs with market values and mislead the user. Better to surface incomplete data transparently.

### 4. Sector propagation
- **Decision**: Add `sector` to the Position response (join from assets table, already in the query). The portfolio summary groups by sector using this field. Positions with `null` sector are grouped under "Unclassified".
- **Rationale**: Sector is already stored on assets. The position query already joins `assets` — adding one more selected column is trivial.

### 5. Frontend visualization approach
- **Decision**: Use simple HTML/CSS bar charts (horizontal stacked bars or proportional bars) for allocation visualization. No external charting library in this change.
- **Rationale**: Keeps the dependency footprint minimal. Allocation breakdowns are essentially percentages — a colored bar with labels is sufficient for MVP. A charting library (Recharts, etc.) can be added later when historical/time-series charts are needed.

## Risks / Trade-offs

- **Stale data**: Prices are manually updated. Allocation percentages reflect the last manually-entered `current_price`. Mitigation: show "Last Updated" timestamp from the setting/asset data.
- **Missing prices**: If many assets lack `current_price`, the allocation view will be incomplete. Mitigation: show a visible count of positions without market value.
- **Small dataset**: The aggregation is trivial for a personal portfolio (likely <100 positions). If this ever scaled, the query could be optimized, but for now a simple in-memory aggregation over all wallet positions is fine.

## Open Questions
- None — the data model already supports all required dimensions.

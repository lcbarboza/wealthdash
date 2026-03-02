# Change: Add Portfolio Insights Section

## Why
The app currently has a dashboard that shows static allocation snapshots (how the portfolio looks right now) but offers zero actionable intelligence. An investor needs more than pie charts — they need to understand whether their allocation is healthy, where risk is concentrated, which positions dominate excessively, and what adjustments would improve diversification. The Insights section bridges the gap between "here is your data" and "here is what you should think about."

The first insight type is **Asset Allocation Analysis**, which evaluates the portfolio's allocation against common diversification principles and surfaces actionable observations (overconcentration, underexposure, single-asset dominance, etc.). The section is designed as an extensible container so future insight types (per-asset analysis, income analysis, rebalancing suggestions, risk alerts, performance attribution) can be added incrementally.

## What Changes

### Backend
- Add a new **Insights API endpoint** (`GET /api/insights/allocation`) that analyzes the portfolio's current allocation and returns structured insight cards
- Create an **InsightsService** in `apps/api/src/services/insights-service.ts` that:
  - Leverages the existing `PortfolioService.getPortfolioSummary()` data
  - Applies rule-based analysis to detect allocation patterns (concentration, imbalance, gaps)
  - Returns an array of typed insight objects with severity, category, title, description, and supporting data
- Define insight types in `apps/api/src/types/insights.ts`

### Frontend
- Add a new **Insights page** (`/insights`) with its own sidebar navigation entry
- Create an `InsightsPage` component that renders insight cards grouped by category
- The first visible section is **Asset Allocation Insights** showing:
  - An overall allocation health score/summary
  - Individual insight cards for detected issues (e.g., "Equity concentration is 75% — consider diversifying into fixed income")
  - Each card has severity (info/warning/critical), a title, description, and relevant data points
- The page is designed as a container for multiple insight sections (only allocation ships first)

### Insight Rules (Asset Allocation)
The allocation analysis SHALL evaluate the following rules:
1. **Asset class concentration**: Flag when any single asset class exceeds 70% of portfolio value
2. **Asset class gap**: Flag when the portfolio has zero exposure to an asset class (e.g., no fixed income, no real estate)
3. **Single asset dominance**: Flag when any single asset represents more than 20% of the total portfolio
4. **Top 3 concentration**: Flag when the top 3 holdings represent more than 60% of the portfolio
5. **Currency concentration**: Flag when a single currency represents more than 90% of portfolio value
6. **Sector concentration**: Flag when a single sector represents more than 40% of portfolio value
7. **Wallet concentration**: Flag when a single wallet holds more than 80% of portfolio value
8. **Small position alert**: Flag positions that represent less than 1% of the portfolio (potential noise/clutter)
9. **Missing prices warning**: Flag when positions without market price represent a material portion of the portfolio

## Impact
- Affected specs: `portfolio-insights` (new)
- Affected code:
  - `apps/api/src/types/insights.ts` (new)
  - `apps/api/src/services/insights-service.ts` (new)
  - `apps/api/src/routes/insights.ts` (new)
  - `apps/api/src/server.ts` (register insights routes)
  - `apps/web/src/types/insights.ts` (new)
  - `apps/web/src/services/api/insights.ts` (new)
  - `apps/web/src/pages/insights-page.tsx` (new)
  - `apps/web/src/components/insights/` (new — insight cards, section containers)
  - `apps/web/src/components/layout/sidebar.tsx` (add "Insights" nav item)
  - `apps/web/src/app.tsx` (add `/insights` route)

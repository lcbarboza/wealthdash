## 1. Backend: Insight Types
- [x] 1.1 Create `apps/api/src/types/insights.ts` with interfaces: `InsightSeverity` (info/warning/critical), `InsightCategory` (allocation + future categories), `Insight` (id, category, severity, title, description, data), `AllocationInsightsResponse` (insights array, generated_at, summary)
- [x] 1.2 Define threshold constants: `ASSET_CLASS_CONCENTRATION_WARNING` (0.70), `ASSET_CLASS_CONCENTRATION_CRITICAL` (0.85), `SINGLE_ASSET_WARNING` (0.20), `SINGLE_ASSET_CRITICAL` (0.35), `TOP3_WARNING` (0.60), `TOP3_CRITICAL` (0.80), `CURRENCY_CONCENTRATION_INFO` (0.90), `CURRENCY_CONCENTRATION_WARNING` (0.95), `SECTOR_CONCENTRATION_WARNING` (0.40), `SECTOR_CONCENTRATION_CRITICAL` (0.55), `WALLET_CONCENTRATION_INFO` (0.80), `WALLET_CONCENTRATION_WARNING` (0.90), `SMALL_POSITION_THRESHOLD` (0.01), `SMALL_POSITION_MIN_COUNT` (3)

## 2. Backend: Insights Service
- [x] 2.1 Create `apps/api/src/services/insights-service.ts` with `getAllocationInsights()` function
- [x] 2.2 Implement `getAllocationInsights()`: call `PortfolioService.getPortfolioSummary()`, then run each rule function
- [x] 2.3 Implement asset class concentration rule: iterate `by_asset_class`, check weight vs thresholds, generate insight per offending class
- [x] 2.4 Implement asset class gap rule: check for asset classes with zero representation, generate info insight for each missing class
- [x] 2.5 Implement single asset dominance rule: iterate `top_holdings`, check weight vs thresholds, generate insight per dominant asset
- [x] 2.6 Implement top 3 concentration rule: sum weights of top 3 holdings, check vs thresholds
- [x] 2.7 Implement currency concentration rule: iterate `by_currency`, check weight vs thresholds
- [x] 2.8 Implement sector concentration rule: iterate `by_sector`, exclude "Unclassified", check weight vs thresholds
- [x] 2.9 Implement wallet concentration rule: iterate `by_wallet`, skip if only 1 wallet, check weight vs thresholds
- [x] 2.10 Implement small position alert rule: count holdings with weight < 1%, generate insight if count > 3
- [x] 2.11 Implement missing prices warning rule: check `positions_missing_price` from summary, generate warning if > 0
- [x] 2.12 Build summary object: count total insights and breakdown by severity

## 3. Backend: Insights Route
- [x] 3.1 Create `apps/api/src/routes/insights.ts` with `GET /api/insights/allocation` handler
- [x] 3.2 Register insights routes in `apps/api/src/server.ts`

## 4. Frontend: Insight Types & API Client
- [x] 4.1 Create `apps/web/src/types/insights.ts` with matching types (Insight, InsightSeverity, AllocationInsightsResponse)
- [x] 4.2 Create `apps/web/src/services/api/insights.ts` with `fetchAllocationInsights()` function

## 5. Frontend: Insight Components
- [x] 5.1 Create `apps/web/src/components/insights/insight-card.tsx` — card component with severity-based accent colors (blue for info, amber for warning, red for critical), severity icon, title, and description
- [x] 5.2 Create `apps/web/src/components/insights/insights-summary.tsx` — banner showing total insights count, breakdown by severity, or "all clear" message when no insights exist
- [x] 5.3 Create `apps/web/src/components/insights/allocation-section.tsx` — container that renders the summary banner and a grid of insight cards for the allocation category

## 6. Frontend: Insights Page & Navigation
- [x] 6.1 Create `apps/web/src/pages/insights-page.tsx` — page component with header, loading/error states, and allocation section
- [x] 6.2 Add `/insights` route to `apps/web/src/app.tsx`
- [x] 6.3 Add "Insights" link with icon to sidebar in `apps/web/src/components/layout/sidebar.tsx`

## 7. Verification
- [x] 7.1 Verify `GET /api/insights/allocation` returns correct insights for current seed data
- [x] 7.2 Verify the Insights page renders all insight cards with correct severity styling
- [x] 7.3 Verify empty portfolio returns empty insights array gracefully
- [x] 7.4 Verify loading and error states work correctly on the Insights page
- [x] 7.5 Verify sidebar navigation includes the Insights link and route works

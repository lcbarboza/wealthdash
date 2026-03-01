## 1. Backend: Extend Position with Sector
- [x] 1.1 Add `sector` field to the Position interface in `apps/api/src/types/transaction.ts`
- [x] 1.2 Add `sector` to the SELECT in `getPositionsByWallet` in `apps/api/src/services/transaction-service.ts` (already joining assets table)
- [x] 1.3 Add `sector` field to the frontend Position type in `apps/web/src/types/transaction.ts`

## 2. Backend: Portfolio Types
- [x] 2.1 Create `apps/api/src/types/portfolio.ts` with interfaces: `AllocationBreakdownItem`, `PortfolioSummary`

## 3. Backend: Portfolio Service
- [x] 3.1 Create `apps/api/src/services/portfolio-service.ts` with `getPortfolioSummary()` function
- [x] 3.2 Implement cross-wallet position aggregation (fetch all wallets, get positions for each, merge)
- [x] 3.3 Implement allocation grouping by asset class, asset type, currency, sector
- [x] 3.4 Implement top holdings computation (sorted by value_brl descending)
- [x] 3.5 Compute total portfolio value, total cost, total gain, gain percentage
- [x] 3.6 Count and report positions missing market value

## 4. Backend: Portfolio Route
- [x] 4.1 Create `apps/api/src/routes/portfolio.ts` with `GET /api/portfolio/summary`
- [x] 4.2 Register the portfolio route in the Fastify app

## 5. Frontend: Portfolio Types & API Client
- [x] 5.1 Create `apps/web/src/types/portfolio.ts` with matching types
- [x] 5.2 Create `apps/web/src/services/portfolio-api.ts` with `fetchPortfolioSummary()` function

## 6. Frontend: Dashboard Components
- [x] 6.1 Create `AllocationBar` component — horizontal proportional bar showing allocation segments with color coding
- [x] 6.2 Create `AllocationTable` component — table showing category, value (R$), weight (%), and gain
- [x] 6.3 Create `SummaryCard` component — card showing a metric label and value (reusable for total value, gain, etc.)
- [x] 6.4 Create `TopHoldings` component — table showing top positions by weight

## 7. Frontend: Dashboard Page
- [x] 7.1 Replace the placeholder `DashboardPage` with the real allocation dashboard
- [x] 7.2 Fetch portfolio summary on mount using the API client
- [x] 7.3 Render summary cards row (total value, total gain/loss with %, number of positions, missing prices count)
- [x] 7.4 Render allocation by asset class section (bar + table)
- [x] 7.5 Render allocation by asset type section (bar + table)
- [x] 7.6 Render currency exposure section (bar + table)
- [x] 7.7 Render sector allocation section (bar + table)
- [x] 7.8 Render top holdings section

## 8. Verification
- [x] 8.1 Verify the `GET /api/portfolio/summary` endpoint returns correct aggregations with existing seed data
- [x] 8.2 Verify the dashboard renders all sections with real data
- [x] 8.3 Verify positions without `current_price` are flagged as missing in the summary
- [x] 8.4 Verify BRL/USD positions are correctly normalized to BRL using the `usd_brl_rate` setting

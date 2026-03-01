# Change: Add Asset Allocation Dashboard

## Why
The dashboard is currently a static placeholder with hardcoded zeroes. With wallets, transactions, positions, and market values already in place, the app lacks the most critical view for any investor: a consolidated big-picture of where their money is and how risk is distributed. A financial expert needs to see total portfolio value, allocation breakdowns by asset class (risk profile), asset type, currency exposure (international vs local), and sector at a glance.

## What Changes

### Backend
- Add a new **cross-wallet portfolio aggregation endpoint** (`GET /api/portfolio/summary`) that aggregates positions from all wallets and returns:
  - Total portfolio value (BRL-normalized)
  - Total cost basis
  - Total unrealized gain/loss (absolute and percentage)
  - Breakdown by asset class (EQUITY, FIXED_INCOME, REAL_ESTATE) with value, weight %, and gain
  - Breakdown by asset type (STOCK, ETF, FII, etc.) with value, weight %, and gain
  - Breakdown by currency (BRL vs USD) with value and weight %
  - Breakdown by sector with value and weight %
  - Top positions ranked by portfolio weight
- Extend the Position type with `sector` field (currently on Asset but not propagated to Position response)

### Frontend
- Replace the dashboard placeholder with a real allocation dashboard containing:
  - **Summary cards**: total value, total gain/loss (with % return), number of positions
  - **Allocation by asset class** section (chart + table)
  - **Allocation by asset type** section (chart + table)
  - **Currency exposure** section (international vs local, chart + table)
  - **Sector allocation** section (chart + table)
  - **Top holdings** table (top N positions by weight)

## Impact
- Affected specs: `position-consolidation` (modified — add sector to Position), `portfolio-aggregation` (new), `dashboard-allocation` (new)
- Affected code:
  - `apps/api/src/services/transaction-service.ts` (extend `getPositionsByWallet` to include sector)
  - `apps/api/src/services/` (new portfolio aggregation service)
  - `apps/api/src/routes/` (new portfolio routes)
  - `apps/api/src/types/` (new portfolio types)
  - `apps/web/src/pages/dashboard-page.tsx` (replace placeholder)
  - `apps/web/src/types/` (new portfolio types)
  - `apps/web/src/services/` (new portfolio API client)
  - `apps/web/src/components/` (new dashboard widgets)

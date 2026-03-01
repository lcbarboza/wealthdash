# Change: Add current price to assets, market value to positions, and USD/BRL exchange rate

## Why

Positions currently only show cost-based information (total cost, average cost). Users need to see the current market value of their positions to understand what their portfolio is actually worth today. This requires a `current_price` field on each asset, which the user sets manually and which the positions view uses to compute market value (quantity x current price). Additionally, since the portfolio contains both BRL and USD assets, a global USD/BRL exchange rate setting is needed so that USD positions can show their equivalent value in BRL, enabling meaningful portfolio-wide totals.

## What Changes

- **New `settings` table**: key-value store for global settings; initially stores `usd_brl_rate` (the current USD/BRL exchange rate, manually entered by the user)
- **New Settings CRUD API**: `GET /api/settings` and `PUT /api/settings/:key` for reading/updating settings
- **New Settings UI**: a place in the frontend for the user to view and update the USD/BRL rate
- **Modified `assets` table**: add nullable `current_price` (real) column — represents the current unit price of the asset in its configured currency
- **Modified Asset CRUD**: `current_price` accepted on create and update, returned on read; validated as >= 0 when provided
- **Modified Asset form (frontend)**: new "Current Price" input field, with currency symbol matching the asset's currency
- **Modified Position type and API response**: add `current_price`, `market_value` (quantity x current_price), `gain` (market_value - total_cost), and `value_brl` (market_value converted to BRL using the exchange rate for USD assets, or market_value itself for BRL assets) to the position object
- **Modified Positions table (frontend)**: add "Current Price", "Market Value", "Gain", and "Value (BRL)" columns; display "--" when current_price is null; the "Value (BRL)" column enables a BRL-denominated total in the footer even when the wallet has mixed-currency positions

## Impact

- Affected specs: `asset-management` (modified), `position-consolidation` (modified), `exchange-rate-settings` (new)
- Affected code:
  - `apps/api/src/db/schema.ts` (add `current_price` column on assets, add `settings` table)
  - `apps/api/drizzle/` (new migration)
  - `apps/api/src/types/asset.ts` (accept current_price in DTOs)
  - `apps/api/src/types/setting.ts` (new — Setting interface)
  - `apps/api/src/services/asset-service.ts` (validate current_price)
  - `apps/api/src/services/setting-service.ts` (new — CRUD for settings)
  - `apps/api/src/routes/settings.ts` (new — settings API routes)
  - `apps/api/src/types/transaction.ts` (extend Position interface with market_value, gain, value_brl)
  - `apps/api/src/services/transaction-service.ts` (include current_price in position query, compute market_value/gain)
  - `apps/web/src/types/asset.ts` (add current_price to Asset/DTOs)
  - `apps/web/src/types/setting.ts` (new — Setting interface)
  - `apps/web/src/types/transaction.ts` (extend Position interface)
  - `apps/web/src/services/api/settings.ts` (new — settings API client)
  - `apps/web/src/components/assets/asset-form.tsx` (new current_price field)
  - `apps/web/src/components/wallets/position-list.tsx` (new columns: current price, market value, gain, value BRL)

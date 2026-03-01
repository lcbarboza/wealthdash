## 1. Database Schema & Migration

- [x] 1.1 Add `current_price` (real, nullable) column to `assets` table in Drizzle schema (`apps/api/src/db/schema.ts`)
- [x] 1.2 Add `settings` table to Drizzle schema: `key` (text PK), `value` (text NOT NULL), `updated_at` (timestamp)
- [x] 1.3 Generate Drizzle migration for both changes (`apps/api/drizzle/`)

## 2. Backend Types

- [x] 2.1 Add `current_price` to `CreateAssetInput` and `UpdateAssetInput` in `apps/api/src/types/asset.ts`
- [x] 2.2 Create `apps/api/src/types/setting.ts`: Setting interface, UpdateSettingInput
- [x] 2.3 Add `current_price` (nullable), `market_value` (nullable), `gain` (nullable), and `value_brl` (nullable) to `Position` interface in `apps/api/src/types/transaction.ts`

## 3. Backend Services

- [x] 3.1 Add `current_price >= 0` validation to `asset-service.ts` (on create and update, when field is provided)
- [x] 3.2 Create `apps/api/src/services/setting-service.ts`: listSettings, getSettingByKey, updateSetting (validate non-empty value, validate key exists)
- [x] 3.3 Update `getPositionsByWallet` in `transaction-service.ts` to include `assets.current_price` in the query and compute `market_value` (quantity x current_price), `gain` (market_value - total_cost), and `value_brl` (for BRL: market_value, for USD: market_value x usd_brl_rate) — all null when current_price is null

## 4. Backend Routes

- [x] 4.1 Create `apps/api/src/routes/settings.ts`: GET /api/settings, PUT /api/settings/:key
- [x] 4.2 Register settings routes in `apps/api/src/server.ts`

## 5. Frontend Types & API Clients

- [x] 5.1 Add `current_price` (nullable) to the `Asset` interface and `CreateAssetInput`/`UpdateAssetInput` in `apps/web/src/types/asset.ts`
- [x] 5.2 Create `apps/web/src/types/setting.ts`: Setting interface
- [x] 5.3 Create `apps/web/src/services/api/settings.ts`: listSettings, updateSetting
- [x] 5.4 Add `current_price` (nullable), `market_value` (nullable), `gain` (nullable), and `value_brl` (nullable) to `Position` interface in `apps/web/src/types/transaction.ts`

## 6. Frontend — Asset Form

- [x] 6.1 Add "Current Price" input field to `apps/web/src/components/assets/asset-form.tsx` with dynamic currency symbol matching the asset's currency

## 7. Frontend — Position List & Exchange Rate

- [x] 7.1 Add "Current Price", "Market Value", "Gain", and "Value (BRL)" columns to `apps/web/src/components/wallets/position-list.tsx`
- [x] 7.2 Display "--" for current price, market value, gain, and value (BRL) when `current_price` is null
- [x] 7.3 Update footer to show "Total (BRL)" summing value_brl of all positions (or "--" if any position has null value_brl)
- [x] 7.4 Add exchange rate display/input near the positions table header in wallet detail, allowing inline update of the USD/BRL rate

## 8. Seed Data

- [x] 8.1 Update seed script to include `current_price` on some assets (and leave others null) to demonstrate both states
- [x] 8.2 Seed the `usd_brl_rate` setting with a realistic default value

# Change: Add Asset Schema and CRUD

## Why

The application has no way to store or manage investment assets. Assets are the foundational entity — every other feature (transactions, positions, dashboards) depends on them. We need a flexible schema that handles variable income (stocks, ETFs, FIIs), funds (investment funds, previdencia privada), and fixed income (Tesouro Direto, CDB, LCI, LCA) in a single table.

## What Changes

- Define the `assets` table in Drizzle schema with columns covering both variable and fixed income attributes
- Generate and apply the first real database migration
- Create `AssetService` with full CRUD operations
- Create REST API routes for asset management (`/api/assets`)
- Define TypeScript types/enums for asset classification (type, class, currency, indexer, rate type)

## Impact

- Affected specs: new `asset-management` capability
- Affected code: `apps/api/src/db/schema.ts`, new `src/services/asset-service.ts`, new `src/routes/assets.ts`, new `src/types/asset.ts`

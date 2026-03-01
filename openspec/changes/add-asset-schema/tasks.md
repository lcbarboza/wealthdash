## 1. Types and Enums

- [x] 1.1 Create `src/types/asset.ts` with enums (`AssetType`, `AssetClass`, `Currency`, `RateType`, `Indexer`) and DTO types

## 2. Database Schema

- [x] 2.1 Define `assets` table in `src/db/schema.ts` using Drizzle SQLite schema builders
- [x] 2.2 Generate migration with `drizzle-kit generate`
- [x] 2.3 Add custom SQL for partial unique index on `ticker` (if Drizzle cannot express it)
- [x] 2.4 Verify migration applies cleanly on server start

## 3. Service Layer

- [x] 3.1 Create `src/services/asset-service.ts` with CRUD methods (create, getById, list, update, delete)
- [x] 3.2 Implement validation logic (required fields per type, rate consistency rules)
- [x] 3.3 Implement query filters (asset_type, asset_class, currency)

## 4. API Routes

- [x] 4.1 Create `src/routes/assets.ts` with REST endpoints (POST, GET list, GET by id, PUT, DELETE)
- [x] 4.2 Register asset routes in `src/server.ts`
- [x] 4.3 Return proper HTTP status codes (201, 200, 400, 404, 409)

## 5. Verification

- [x] 5.1 Run Biome auto-fix and verify lint passes
- [x] 5.2 Verify TypeScript build compiles
- [x] 5.3 Start server and test CRUD endpoints manually (create stock, create CDB, create FUND, create PREVIDENCIA, list, filter, update, delete)

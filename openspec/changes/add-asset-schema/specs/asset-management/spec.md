## ADDED Requirements

### Requirement: Asset Schema

The system SHALL store assets in a single `assets` table that accommodates variable income (stocks, ETFs, FIIs), fund-based assets (investment funds, previdencia privada), and fixed income (Tesouro Direto, CDB, LCI, LCA) instruments.

Each asset SHALL have: `id` (UUID), `name`, `asset_type`, `asset_class`, `currency`, `created_at`, and `updated_at` as required fields.

Each asset MAY have: `ticker`, `sector`, `maturity_date`, `rate_type`, `indexer`, `rate_value`, and `notes` as optional fields.

The `ticker` column SHALL have a partial unique index that prevents duplicate tickers while allowing multiple assets with no ticker.

#### Scenario: Create a Brazilian stock

- **GIVEN** a user wants to register a Brazilian stock
- **WHEN** an asset is created with `asset_type = "STOCK"`, `ticker = "PETR4"`, `name = "Petrobras PN"`, `asset_class = "EQUITY"`, `currency = "BRL"`
- **THEN** the asset is persisted with a generated UUID and timestamps
- **AND** fixed income fields (`maturity_date`, `rate_type`, `indexer`, `rate_value`) are NULL

#### Scenario: Create a fixed income asset

- **GIVEN** a user wants to register a CDB
- **WHEN** an asset is created with `asset_type = "CDB"`, `name = "CDB Banco X"`, `asset_class = "FIXED_INCOME"`, `currency = "BRL"`, `rate_type = "POST"`, `indexer = "CDI"`, `rate_value = 110.0`, `maturity_date = "2026-06-15"`
- **THEN** the asset is persisted with all fixed income fields populated

#### Scenario: Create an investment fund

- **GIVEN** a user wants to register a fundo de investimento
- **WHEN** an asset is created with `asset_type = "FUND"`, `name = "Alaska Black FIC FIA"`, `asset_class = "EQUITY"`, `currency = "BRL"`
- **THEN** the asset is persisted successfully without fixed income fields

#### Scenario: Create a previdencia privada

- **GIVEN** a user wants to register a PGBL/VGBL plan
- **WHEN** an asset is created with `asset_type = "PREVIDENCIA"`, `name = "Icatu Vanguarda Dividendos"`, `asset_class = "EQUITY"`, `currency = "BRL"`
- **THEN** the asset is persisted successfully without fixed income fields

#### Scenario: Duplicate ticker rejected

- **GIVEN** an asset with `ticker = "PETR4"` already exists
- **WHEN** a new asset is created with `ticker = "PETR4"`
- **THEN** the creation fails with a conflict error

### Requirement: Asset Type Classification

The system SHALL support the following `asset_type` values: `STOCK`, `ETF`, `FII`, `FUND`, `PREVIDENCIA`, `TESOURO`, `CDB`, `LCI`, `LCA`.

The system SHALL support the following `asset_class` values: `EQUITY`, `FIXED_INCOME`, `REAL_ESTATE`.

The system SHALL support the following `currency` values: `BRL`, `USD`.

#### Scenario: Valid asset types accepted

- **WHEN** an asset is created with `asset_type = "FII"`
- **THEN** the asset is persisted successfully

#### Scenario: Invalid asset type rejected

- **WHEN** an asset is created with `asset_type = "CRYPTO"`
- **THEN** the creation fails with a validation error

### Requirement: Fixed Income Rate Modeling

Fixed income assets SHALL use structured rate fields: `rate_type` (`PRE` | `POST` | `HYBRID`), `indexer` (`CDI` | `IPCA` | `SELIC` | `NONE`), and `rate_value` (numeric).

For `rate_type = "PRE"`, `indexer` SHALL be `NONE` and `rate_value` represents the annual rate percentage.

For `rate_type = "POST"`, `indexer` SHALL be one of `CDI`, `IPCA`, `SELIC` and `rate_value` represents the percentage of the indexer.

For `rate_type = "HYBRID"`, `indexer` SHALL be one of `CDI`, `IPCA`, `SELIC` and `rate_value` represents the spread over the indexer.

#### Scenario: Post-fixed CDB rate

- **GIVEN** a CDB that pays 110% of CDI
- **WHEN** the asset is created with `rate_type = "POST"`, `indexer = "CDI"`, `rate_value = 110.0`
- **THEN** the rate fields are stored correctly

#### Scenario: Hybrid Tesouro IPCA+ rate

- **GIVEN** a Tesouro IPCA+ that pays IPCA + 6%
- **WHEN** the asset is created with `rate_type = "HYBRID"`, `indexer = "IPCA"`, `rate_value = 6.0`
- **THEN** the rate fields are stored correctly

### Requirement: Asset CRUD API

The system SHALL expose REST endpoints for asset management:

- `POST /api/assets` — Create a new asset
- `GET /api/assets` — List all assets with optional query filters (`asset_type`, `asset_class`, `currency`)
- `GET /api/assets/:id` — Get a single asset by ID
- `PUT /api/assets/:id` — Update an existing asset
- `DELETE /api/assets/:id` — Delete an asset

All endpoints SHALL validate input and return appropriate HTTP status codes (201, 200, 400, 404, 409).

#### Scenario: List assets filtered by class

- **GIVEN** the database contains assets of types STOCK, FII, and CDB
- **WHEN** `GET /api/assets?asset_class=EQUITY` is called
- **THEN** only EQUITY-class assets are returned

#### Scenario: Get asset by ID

- **GIVEN** an asset exists with a known ID
- **WHEN** `GET /api/assets/:id` is called with that ID
- **THEN** the full asset record is returned with status 200

#### Scenario: Asset not found

- **GIVEN** no asset exists with the provided ID
- **WHEN** `GET /api/assets/:id` is called
- **THEN** a 404 response is returned

#### Scenario: Update asset

- **GIVEN** an asset exists
- **WHEN** `PUT /api/assets/:id` is called with updated fields
- **THEN** the asset is updated and `updated_at` is refreshed

#### Scenario: Delete asset

- **GIVEN** an asset exists
- **WHEN** `DELETE /api/assets/:id` is called
- **THEN** the asset is removed from the database and status 200 is returned

### Requirement: Asset Validation

The system SHALL enforce validation rules at the service layer:

- Required fields (`name`, `asset_type`, `asset_class`, `currency`) MUST always be present
- Fixed income types (`TESOURO`, `CDB`, `LCI`, `LCA`) MUST have `maturity_date`, `rate_type`, `indexer`, and `rate_value`
- Fund-based types (`FUND`, `PREVIDENCIA`) do NOT require fixed income fields — they are quantity-based (cotas x valor da cota)
- `rate_type = "PRE"` MUST have `indexer = "NONE"`
- `rate_type = "POST"` or `"HYBRID"` MUST have `indexer` other than `"NONE"`
- `ticker`, if provided, MUST be unique across all assets

#### Scenario: Fixed income missing rate fields

- **WHEN** an asset with `asset_type = "CDB"` is created without `rate_type`
- **THEN** the creation fails with a validation error listing missing fields

#### Scenario: Prefixed rate with wrong indexer

- **WHEN** an asset is created with `rate_type = "PRE"` and `indexer = "CDI"`
- **THEN** the creation fails with a validation error

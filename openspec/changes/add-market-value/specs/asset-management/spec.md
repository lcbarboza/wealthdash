## MODIFIED Requirements

### Requirement: Asset Schema

The system SHALL store assets in a single `assets` table that accommodates variable income (stocks, ETFs, FIIs), fund-based assets (investment funds, previdencia privada), and fixed income (Tesouro Direto, CDB, LCI, LCA, CRI, CRA) instruments.

Each asset SHALL have: `id` (UUID), `name`, `asset_type`, `asset_class`, `currency`, `created_at`, and `updated_at` as required fields.

Each asset MAY have: `ticker`, `sector`, `current_price`, `maturity_date`, `rate_type`, `indexer`, `rate_value`, and `notes` as optional fields.

The `current_price` field SHALL be a nullable real number representing the current unit price of the asset in its configured currency. When provided, `current_price` MUST be greater than or equal to zero.

The `ticker` column SHALL have a partial unique index that prevents duplicate tickers while allowing multiple assets with no ticker.

#### Scenario: Create a Brazilian stock

- **GIVEN** a user wants to register a Brazilian stock
- **WHEN** an asset is created with `asset_type = "STOCK"`, `ticker = "PETR4"`, `name = "Petrobras PN"`, `asset_class = "EQUITY"`, `currency = "BRL"`
- **THEN** the asset is persisted with a generated UUID and timestamps
- **AND** `current_price` is NULL
- **AND** fixed income fields (`maturity_date`, `rate_type`, `indexer`, `rate_value`) are NULL

#### Scenario: Create asset with current price

- **GIVEN** a user wants to register a stock with its current market price
- **WHEN** an asset is created with `asset_type = "STOCK"`, `ticker = "PETR4"`, `name = "Petrobras PN"`, `asset_class = "EQUITY"`, `currency = "BRL"`, `current_price = 38.50`
- **THEN** the asset is persisted with `current_price = 38.50`

#### Scenario: Update current price

- **GIVEN** an asset "PETR4" exists with `current_price = 38.50`
- **WHEN** the asset is updated with `current_price = 40.00`
- **THEN** the asset's `current_price` is set to `40.00` and `updated_at` is refreshed

#### Scenario: Negative current price rejected

- **WHEN** an asset is created or updated with `current_price = -5.00`
- **THEN** the system returns a validation error indicating current_price must be >= 0

#### Scenario: Create a fixed income asset

- **GIVEN** a user wants to register a CDB
- **WHEN** an asset is created with `asset_type = "CDB"`, `name = "CDB Banco X"`, `asset_class = "FIXED_INCOME"`, `currency = "BRL"`, `rate_type = "POST"`, `indexer = "CDI"`, `rate_value = 110.0`, `maturity_date = "2026-06-15"`
- **THEN** the asset is persisted with all fixed income fields populated

#### Scenario: Duplicate ticker rejected

- **GIVEN** an asset with `ticker = "PETR4"` already exists
- **WHEN** a new asset is created with `ticker = "PETR4"`
- **THEN** the creation fails with a conflict error

### Requirement: Asset Validation

The system SHALL enforce validation rules at the service layer:

- Required fields (`name`, `asset_type`, `asset_class`, `currency`) MUST always be present
- Fixed income types (`TESOURO`, `CDB`, `LCI`, `LCA`, `CRI`, `CRA`) MUST have `maturity_date`, `rate_type`, `indexer`, and `rate_value`
- Fund-based types (`FUND`, `PREVIDENCIA`) do NOT require fixed income fields — they are quantity-based (cotas x valor da cota)
- `rate_type = "PRE"` MUST have `indexer = "NONE"`
- `rate_type = "POST"` or `"HYBRID"` MUST have `indexer` other than `"NONE"`
- `ticker`, if provided, MUST be unique across all assets
- `current_price`, if provided, MUST be greater than or equal to zero

#### Scenario: Fixed income missing rate fields

- **WHEN** an asset with `asset_type = "CDB"` is created without `rate_type`
- **THEN** the creation fails with a validation error listing missing fields

#### Scenario: Prefixed rate with wrong indexer

- **WHEN** an asset is created with `rate_type = "PRE"` and `indexer = "CDI"`
- **THEN** the creation fails with a validation error

#### Scenario: Negative current price on update

- **GIVEN** an existing asset
- **WHEN** the asset is updated with `current_price = -1`
- **THEN** the update fails with a validation error

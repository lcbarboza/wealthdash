## Context

The app must support a diverse set of Brazilian and international investment instruments. The key challenge is that variable income assets (stocks, ETFs, FIIs), fund-based assets (investment funds, previdencia privada), and fixed income assets (Tesouro Direto, CDB, LCI, LCA) have fundamentally different attributes, yet must coexist in a unified portfolio.

## Goals / Non-Goals

**Goals:**
- Single `assets` table that accommodates all supported asset types
- Structured rate modeling for fixed income (not free-text)
- Proper enum-like classification for asset type, class, currency, and indexer
- CRUD API with validation appropriate to each asset type
- TypeScript types that make the domain clear

**Non-Goals:**
- Price tracking or market data integration (future change)
- Transaction recording (future change)
- Position calculations (future change)
- Broker/account association (future change)

## Decisions

### Single Table with Optional Fields

All assets live in one `assets` table. Fixed-income-specific columns (`maturity_date`, `rate_value`, `rate_type`, `indexer`) are nullable — they're only populated for fixed income assets. This avoids joins for portfolio-level queries and keeps the model simple.

Trade-off: Some columns will be NULL for equities. This is acceptable because:
- The number of fixed-income-specific columns is small (4)
- Portfolio queries don't need to join across tables
- Validation enforces required fields per asset type at the service layer

### Asset Type Taxonomy

Covers the requested Brazilian + international scope:

| `asset_type` | Description | Example |
|---|---|---|
| `STOCK` | Stocks (BR or international, differentiated by `currency`) | PETR4, VALE3, AAPL, MSFT |
| `ETF` | Exchange-traded funds (BR or international) | BOVA11, IVVB11, VOO, VT |
| `FII` | Fundos Imobiliários (REITs) | HGLG11, XPLG11 |
| `FUND` | Fundos de Investimento | Alaska Black FIC FIA, Verde AM |
| `PREVIDENCIA` | Previdencia Privada (PGBL/VGBL) | Icatu Vanguarda, Brasilprev |
| `TESOURO` | Tesouro Direto | Tesouro Selic 2029, Tesouro IPCA+ 2035 |
| `CDB` | Certificado de Depósito Bancário | CDB Banco X 110% CDI |
| `LCI` | Letra de Crédito Imobiliário | LCI Banco Y 95% CDI |
| `LCA` | Letra de Crédito do Agronegócio | LCA Banco Z 93% CDI |

### Asset Class (for allocation/grouping)

| `asset_class` | Groups |
|---|---|
| `EQUITY` | STOCK, ETF (equity ETFs) |
| `FIXED_INCOME` | TESOURO, CDB, LCI, LCA |
| `REAL_ESTATE` | FII |

Note: ETFs, FUNDs, and PREVIDENCIA can span multiple asset classes in practice. The user sets `asset_class` explicitly per asset to handle this correctly. FUND and PREVIDENCIA behave like quantity-based assets (cotas x valor da cota) and do NOT require fixed income fields.

### Rate Modeling (Fixed Income)

Three structured fields work together:

- **`rate_type`**: `PRE` | `POST` | `HYBRID`
  - `PRE` = prefixado (e.g., 12% a.a.)
  - `POST` = pós-fixado (e.g., 110% do CDI)
  - `HYBRID` = indexador + spread (e.g., IPCA + 6%)
- **`indexer`**: `CDI` | `IPCA` | `SELIC` | `NONE`
  - `NONE` for prefixado
  - `CDI` for CDB/LCI/LCA pós-fixado
  - `IPCA` or `SELIC` for Tesouro
- **`rate_value`**: numeric, meaning depends on rate_type
  - `PRE`: annual rate (12.0 = 12% a.a.)
  - `POST`: percentage of indexer (110.0 = 110% do CDI)
  - `HYBRID`: spread over indexer (6.0 = IPCA + 6%)

Examples:
| Product | rate_type | indexer | rate_value |
|---|---|---|---|
| CDB 110% CDI | POST | CDI | 110.0 |
| Tesouro IPCA+ 2035 6% | HYBRID | IPCA | 6.0 |
| Tesouro Selic 2029 | POST | SELIC | 100.0 |
| Tesouro Prefixado 12% | PRE | NONE | 12.0 |
| LCI 95% CDI | POST | CDI | 95.0 |

### Currency

| `currency` | Use |
|---|---|
| `BRL` | All Brazilian assets |
| `USD` | International stocks/ETFs |

### Schema

```sql
CREATE TABLE assets (
  id          TEXT PRIMARY KEY,       -- UUID
  name        TEXT NOT NULL,          -- Display name ("Petrobras PN", "Tesouro IPCA+ 2035")
  ticker      TEXT,                   -- Nullable: PETR4, AAPL, null for some fixed income
  asset_type  TEXT NOT NULL,          -- STOCK | ETF | FII | FUND | PREVIDENCIA | TESOURO | CDB | LCI | LCA
  asset_class TEXT NOT NULL,          -- EQUITY | FIXED_INCOME | REAL_ESTATE
  sector      TEXT,                   -- Nullable: "Petróleo", "Tecnologia", "Bancário"
  currency    TEXT NOT NULL DEFAULT 'BRL',  -- BRL | USD

  -- Fixed income fields (nullable for variable income)
  maturity_date TEXT,                 -- ISO 8601 date (YYYY-MM-DD)
  rate_type     TEXT,                 -- PRE | POST | HYBRID
  indexer       TEXT,                 -- CDI | IPCA | SELIC | NONE
  rate_value    REAL,                 -- See rate modeling above

  -- Metadata
  notes       TEXT,                   -- Free-text user notes
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_assets_ticker ON assets(ticker) WHERE ticker IS NOT NULL;
```

Key decisions:
- **UUID primary key** (`id`): Avoids auto-increment conflicts, good for future sync/import scenarios
- **`ticker` is nullable**: CDB/LCI/LCA from specific banks don't always have tickers
- **Partial unique index on `ticker`**: Prevents duplicate tickers but allows multiple NULL tickers
- **Dates as ISO 8601 text**: SQLite has no native date type; text with ISO format sorts and compares correctly
- **`sector` is free-text**: No predefined enum — sectors vary too much across asset types and markets

### API Design

```
POST   /api/assets          — Create asset
GET    /api/assets          — List assets (with optional filters: asset_type, asset_class, currency)
GET    /api/assets/:id      — Get asset by ID
PUT    /api/assets/:id      — Update asset
DELETE /api/assets/:id      — Delete asset
```

## Risks / Trade-offs

- **Nullable columns for fixed income**: Acceptable given the small number (4 columns). Service-layer validation ensures fixed income assets always have these fields populated.
- **No foreign key to a "types" table**: Enum values are validated in TypeScript, not enforced by the database. Simpler, and Drizzle doesn't support SQLite CHECK constraints well. If an invalid value somehow gets in, it's a bug in the service layer.
- **Partial unique index on ticker**: SQLite supports this (WHERE clause in CREATE INDEX). Drizzle may not generate it automatically — we may need a custom migration.

## Open Questions

None.

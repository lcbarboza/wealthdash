## ADDED Requirements

### Requirement: Cross-Wallet Portfolio Aggregation
The system SHALL aggregate positions from all wallets into a unified portfolio summary. The aggregation SHALL merge positions for the same asset across different wallets (summing quantities and costs). All monetary values SHALL be normalized to BRL using the `usd_brl_rate` setting for USD-denominated assets. Positions without `current_price` (and therefore no `market_value`) SHALL be excluded from allocation weight calculations but their count SHALL be reported separately.

#### Scenario: Aggregate positions across two wallets
- **GIVEN** wallet "Corretora XP" has a position in "PETR4" with value_brl R$ 10,000
- **AND** wallet "Rico" has a position in "PETR4" with value_brl R$ 5,000
- **AND** wallet "Rico" has a position in "VALE3" with value_brl R$ 8,000
- **WHEN** the portfolio summary is requested
- **THEN** the portfolio total is R$ 23,000, with "PETR4" at R$ 15,000 and "VALE3" at R$ 8,000

#### Scenario: Positions without market value are excluded from allocation
- **GIVEN** wallet "Corretora XP" has a position in "PETR4" with value_brl R$ 10,000
- **AND** wallet "Corretora XP" has a position in "ITUB4" with value_brl null (no current_price)
- **WHEN** the portfolio summary is requested
- **THEN** the portfolio total is R$ 10,000 and `positions_missing_price` count is 1

#### Scenario: Empty portfolio
- **GIVEN** there are no wallets or no wallets have transactions
- **WHEN** the portfolio summary is requested
- **THEN** the portfolio total is R$ 0, all breakdowns are empty arrays, and `positions_missing_price` is 0

### Requirement: Allocation Breakdown by Asset Class
The portfolio summary SHALL include a breakdown by asset class (EQUITY, FIXED_INCOME, REAL_ESTATE). Each entry SHALL contain the asset class label, total value in BRL, weight as a percentage of total portfolio value, total cost in BRL, and gain in BRL.

#### Scenario: Portfolio with multiple asset classes
- **GIVEN** the aggregated portfolio has EQUITY positions worth R$ 50,000, FIXED_INCOME positions worth R$ 30,000, and REAL_ESTATE positions worth R$ 20,000
- **WHEN** the portfolio summary is requested
- **THEN** the `by_asset_class` breakdown shows EQUITY at 50%, FIXED_INCOME at 30%, REAL_ESTATE at 20%

#### Scenario: Portfolio with single asset class
- **GIVEN** the aggregated portfolio has only EQUITY positions worth R$ 100,000
- **WHEN** the portfolio summary is requested
- **THEN** the `by_asset_class` breakdown shows EQUITY at 100%

### Requirement: Allocation Breakdown by Asset Type
The portfolio summary SHALL include a breakdown by asset type (STOCK, ETF, FII, FUND, PREVIDENCIA, TESOURO, CDB, LCI, LCA, CRI, CRA). Each entry SHALL contain the asset type label, total value in BRL, weight as a percentage, total cost in BRL, and gain in BRL.

#### Scenario: Portfolio with multiple asset types
- **GIVEN** the aggregated portfolio has STOCK positions worth R$ 30,000, ETF positions worth R$ 20,000, and FII positions worth R$ 10,000
- **WHEN** the portfolio summary is requested
- **THEN** the `by_asset_type` breakdown shows STOCK at 50%, ETF at ~33.3%, FII at ~16.7%

### Requirement: Allocation Breakdown by Currency
The portfolio summary SHALL include a breakdown by currency (BRL, USD). Each entry SHALL contain the currency label, total value in BRL (using the exchange rate for USD), and weight as a percentage of total portfolio value.

#### Scenario: Portfolio with BRL and USD assets
- **GIVEN** the portfolio has BRL positions with market value R$ 60,000 and USD positions with market value $2,000
- **AND** the USD/BRL rate is 5.00
- **WHEN** the portfolio summary is requested
- **THEN** the `by_currency` breakdown shows BRL at R$ 60,000 (85.7%) and USD at R$ 10,000 (14.3%)

#### Scenario: Portfolio with only BRL assets
- **GIVEN** the portfolio has only BRL-denominated positions
- **WHEN** the portfolio summary is requested
- **THEN** the `by_currency` breakdown shows BRL at 100%

### Requirement: Allocation Breakdown by Sector
The portfolio summary SHALL include a breakdown by sector. Each entry SHALL contain the sector name, total value in BRL, weight as a percentage, total cost in BRL, and gain in BRL. Positions with `null` sector SHALL be grouped under "Unclassified".

#### Scenario: Portfolio with multiple sectors
- **GIVEN** the portfolio has positions in "Oil & Gas" worth R$ 20,000 and "Banking" worth R$ 30,000
- **WHEN** the portfolio summary is requested
- **THEN** the `by_sector` breakdown shows "Oil & Gas" at 40% and "Banking" at 60%

#### Scenario: Positions without sector
- **GIVEN** the portfolio has a position in "PETR4" (sector "Oil & Gas", value R$ 20,000) and "XPML11" (sector null, value R$ 10,000)
- **WHEN** the portfolio summary is requested
- **THEN** the `by_sector` breakdown shows "Oil & Gas" at ~66.7% and "Unclassified" at ~33.3%

### Requirement: Top Holdings
The portfolio summary SHALL include a list of the top positions ranked by portfolio weight (value_brl descending). Each entry SHALL contain the asset name, asset ticker, asset type, value in BRL, weight as a percentage of total portfolio value, and gain in BRL.

#### Scenario: Top holdings ranking
- **GIVEN** the portfolio has "PETR4" worth R$ 30,000, "VALE3" worth R$ 20,000, and "ITUB4" worth R$ 10,000
- **WHEN** the portfolio summary is requested
- **THEN** the `top_holdings` list is ordered: PETR4 (50%), VALE3 (33.3%), ITUB4 (16.7%)

### Requirement: Portfolio Summary API Endpoint
The system SHALL expose a `GET /api/portfolio/summary` endpoint that returns the complete portfolio summary. The response SHALL include: `total_value` (number, BRL), `total_cost` (number, BRL), `total_gain` (number, BRL), `total_gain_pct` (number, percentage), `total_positions` (number), `positions_missing_price` (number), `by_asset_class` (array), `by_asset_type` (array), `by_currency` (array), `by_sector` (array), and `top_holdings` (array).

#### Scenario: Successful summary request
- **WHEN** a GET request is made to `/api/portfolio/summary`
- **THEN** the response status is 200 and the body contains all portfolio summary fields

#### Scenario: Summary with no data
- **GIVEN** there are no wallets or transactions in the system
- **WHEN** a GET request is made to `/api/portfolio/summary`
- **THEN** the response status is 200 with `total_value: 0`, `total_cost: 0`, `total_gain: 0`, `total_gain_pct: 0`, empty breakdown arrays, and `positions_missing_price: 0`

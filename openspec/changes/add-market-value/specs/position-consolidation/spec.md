## MODIFIED Requirements

### Requirement: Position Consolidation per Wallet
The system SHALL compute consolidated positions for each asset within a wallet by aggregating all BUY transactions. For each asset with at least one transaction in the wallet, the system SHALL calculate: total quantity (sum of all transaction quantities), total cost (sum of quantity x unit price for each transaction), average cost (total cost / total quantity), market value (total quantity x asset's current_price, or null if current_price is not set), gain (market_value - total_cost, or null if market_value is null), and value in BRL (for BRL assets: same as market_value; for USD assets: market_value x usd_brl_rate; null if market_value is null).

#### Scenario: Single transaction for an asset
- **GIVEN** wallet "Corretora XP" has one BUY transaction for "PETR4" with quantity 100 at unit price 28.50
- **AND** "PETR4" has `current_price = 40.00` and `currency = "BRL"`
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the position for "PETR4" shows total quantity 100, total cost R$ 2,850.00, average cost R$ 28.50, market value R$ 4,000.00, gain R$ 1,150.00, and value_brl R$ 4,000.00

#### Scenario: Multiple transactions for the same asset
- **GIVEN** wallet "Corretora XP" has two BUY transactions for "PETR4": 100 shares at R$ 28.50 and 50 shares at R$ 30.00
- **AND** "PETR4" has `current_price = 35.00`
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the position for "PETR4" shows total quantity 150, total cost R$ 4,350.00, average cost R$ 29.00, market value R$ 5,250.00, and gain R$ 900.00

#### Scenario: Asset without current price
- **GIVEN** wallet "Corretora XP" has a BUY transaction for "VALE3" with quantity 50 at unit price 60.00
- **AND** "VALE3" has `current_price = null`
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the position for "VALE3" shows total quantity 50, total cost R$ 3,000.00, average cost R$ 60.00, market value null, gain null, and value_brl null

#### Scenario: USD asset converted to BRL
- **GIVEN** wallet "Interactive Brokers" has one BUY transaction for "AAPL" with quantity 10 at unit price $150.00
- **AND** "AAPL" has `current_price = 180.00` and `currency = "USD"`
- **AND** the USD/BRL exchange rate is 5.50
- **WHEN** positions are requested for "Interactive Brokers"
- **THEN** the position for "AAPL" shows market value $1,800.00, gain $300.00, and value_brl R$ 9,900.00

#### Scenario: Multiple assets in a wallet
- **GIVEN** wallet "Corretora XP" has transactions for "PETR4" and "VALE3"
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the system returns one consolidated position per asset, each with market value, gain, and value_brl computed independently

#### Scenario: Wallet with no transactions
- **GIVEN** wallet "Corretora XP" has no transactions
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the system returns an empty positions list

### Requirement: Position API Endpoint
The system SHALL expose a `GET /api/wallets/:walletId/positions` endpoint that returns the consolidated positions for a wallet. Each position SHALL include the asset id, asset name, asset ticker, asset type, asset class, asset currency, current price (nullable), total quantity, total cost, average cost, market value (nullable), gain (nullable), and value_brl (nullable). The endpoint SHALL use the current `usd_brl_rate` setting to compute value_brl for USD-denominated positions.

#### Scenario: Get positions for wallet
- **GIVEN** wallet "Corretora XP" has transactions for multiple assets
- **WHEN** a GET request is made to `/api/wallets/:walletId/positions`
- **THEN** the response contains an array of positions with asset details, cost fields, market value/gain fields, and value_brl

#### Scenario: Get positions for non-existent wallet
- **WHEN** a GET request is made to `/api/wallets/non-existent/positions`
- **THEN** the system returns a not-found error

### Requirement: Position Display in Wallet Detail
The system SHALL display consolidated positions in the wallet detail view. The positions table SHALL show each asset's name, ticker, total quantity, average cost, total cost, current price, market value, gain, and value (BRL). When an asset's current_price is null, the current price, market value, gain, and value (BRL) columns SHALL display "--". Positions SHALL be the default view when opening a wallet detail. The footer SHALL show a "Total (BRL)" that sums the value_brl of all positions (displaying "--" if any position has a null value_brl). The exchange rate input SHALL be displayed near the positions table so the user can adjust it.

#### Scenario: View positions with market value
- **GIVEN** wallet "Corretora XP" has positions for "PETR4" (BRL, current_price set) and "AAPL" (USD, current_price set)
- **AND** the USD/BRL rate is 5.50
- **WHEN** user opens wallet "Corretora XP" detail
- **THEN** the positions tab shows both assets with cost columns, current price, market value, gain, and value (BRL) — where AAPL's value (BRL) is its market value multiplied by 5.50

#### Scenario: View positions without current price
- **GIVEN** wallet "Corretora XP" has a position for "PETR4" where current_price is null
- **WHEN** user opens wallet "Corretora XP" detail
- **THEN** the current price, market value, gain, and value (BRL) columns display "--" for "PETR4"

#### Scenario: Footer total in BRL
- **GIVEN** wallet has BRL positions worth R$ 10,000 and USD positions worth $1,000 with rate 5.50
- **WHEN** user views the positions table
- **THEN** the footer shows "Total (BRL): R$ 15,500.00"

#### Scenario: Footer total with missing prices
- **GIVEN** wallet has some positions with null current_price
- **WHEN** user views the positions table
- **THEN** the footer total shows "--"

#### Scenario: Empty wallet positions view
- **GIVEN** wallet "Corretora XP" has no transactions
- **WHEN** user opens wallet "Corretora XP" detail
- **THEN** an empty state is shown suggesting the user add transactions

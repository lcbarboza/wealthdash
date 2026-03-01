## ADDED Requirements

### Requirement: Position Consolidation per Wallet
The system SHALL compute consolidated positions for each asset within a wallet by aggregating all BUY transactions. For each asset with at least one transaction in the wallet, the system SHALL calculate: total quantity (sum of all transaction quantities), total cost (sum of quantity * unit price for each transaction), and average cost (total cost / total quantity).

#### Scenario: Single transaction for an asset
- **GIVEN** wallet "Corretora XP" has one BUY transaction for "PETR4" with quantity 100 at unit price 28.50
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the position for "PETR4" shows total quantity 100, total cost R$ 2,850.00, and average cost R$ 28.50

#### Scenario: Multiple transactions for the same asset
- **GIVEN** wallet "Corretora XP" has two BUY transactions for "PETR4": 100 shares at R$ 28.50 and 50 shares at R$ 30.00
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the position for "PETR4" shows total quantity 150, total cost R$ 4,350.00, and average cost R$ 29.00

#### Scenario: Multiple assets in a wallet
- **GIVEN** wallet "Corretora XP" has transactions for "PETR4" and "VALE3"
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the system returns one consolidated position per asset

#### Scenario: Wallet with no transactions
- **GIVEN** wallet "Corretora XP" has no transactions
- **WHEN** positions are requested for "Corretora XP"
- **THEN** the system returns an empty positions list

### Requirement: Position API Endpoint
The system SHALL expose a `GET /api/wallets/:walletId/positions` endpoint that returns the consolidated positions for a wallet. Each position SHALL include the asset id, asset name, asset ticker, asset type, asset class, total quantity, total cost, and average cost.

#### Scenario: Get positions for wallet
- **GIVEN** wallet "Corretora XP" has transactions for multiple assets
- **WHEN** a GET request is made to `/api/wallets/:walletId/positions`
- **THEN** the response contains an array of positions with asset details, total quantity, total cost, and average cost

#### Scenario: Get positions for non-existent wallet
- **WHEN** a GET request is made to `/api/wallets/non-existent/positions`
- **THEN** the system returns a not-found error

### Requirement: Position Display in Wallet Detail
The system SHALL display consolidated positions in the wallet detail view. The positions view SHALL show a table or card list with each asset's name, ticker, total quantity, average cost, and total cost. Positions SHALL be the default view when opening a wallet detail.

#### Scenario: View positions in wallet detail
- **GIVEN** wallet "Corretora XP" has positions for "PETR4" and "VALE3"
- **WHEN** user opens wallet "Corretora XP" detail
- **THEN** the positions tab/section shows both assets with their consolidated quantity, average cost, and total cost

#### Scenario: Empty wallet positions view
- **GIVEN** wallet "Corretora XP" has no transactions
- **WHEN** user opens wallet "Corretora XP" detail
- **THEN** an empty state is shown suggesting the user add transactions

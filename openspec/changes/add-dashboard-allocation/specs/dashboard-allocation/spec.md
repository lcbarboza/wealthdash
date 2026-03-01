## ADDED Requirements

### Requirement: Dashboard Summary Cards
The dashboard page SHALL display summary cards at the top showing: total portfolio value (formatted as R$ with 2 decimals), total unrealized gain/loss (formatted as R$ with sign and colored green for positive, red for negative), gain/loss percentage (formatted with sign and 2 decimals), total number of positions, and a count of positions missing market price (if any). When the portfolio has no data, the summary cards SHALL display R$ 0,00 for values and 0 for counts.

#### Scenario: Dashboard with portfolio data
- **GIVEN** the portfolio has total value R$ 100,000, total gain R$ 15,000 (15%)
- **WHEN** the user opens the dashboard
- **THEN** the summary cards show "R$ 100,000.00" for total value, "+R$ 15,000.00" in green for gain, "+15.00%" for return, and the position count

#### Scenario: Dashboard with negative gain
- **GIVEN** the portfolio has total value R$ 80,000, total gain -R$ 5,000 (-5.88%)
- **WHEN** the user opens the dashboard
- **THEN** the gain card shows "-R$ 5,000.00" in red and "-5.88%"

#### Scenario: Dashboard with missing prices
- **GIVEN** the portfolio has 3 positions with market value and 2 positions without current_price
- **WHEN** the user opens the dashboard
- **THEN** the summary shows a warning indicator with "2 positions missing price"

#### Scenario: Dashboard with empty portfolio
- **GIVEN** there are no wallets or transactions
- **WHEN** the user opens the dashboard
- **THEN** the summary cards show R$ 0,00 for all values and 0 for all counts

### Requirement: Asset Class Allocation Section
The dashboard SHALL display an "Allocation by Asset Class" section containing a visual allocation bar (horizontal proportional bar with color-coded segments) and a detail table. The table SHALL show each asset class with its value (R$), weight (%), and gain (R$). Asset classes SHALL be labeled with human-readable names (Equity, Fixed Income, Real Estate).

#### Scenario: View asset class allocation
- **GIVEN** the portfolio has EQUITY 50%, FIXED_INCOME 30%, REAL_ESTATE 20%
- **WHEN** the user opens the dashboard
- **THEN** the asset class section shows a proportional bar and table with three rows showing the correct values, weights, and gains

#### Scenario: Single asset class
- **GIVEN** the portfolio has only EQUITY positions
- **WHEN** the user opens the dashboard
- **THEN** the asset class section shows one full-width bar segment and a single table row at 100%

### Requirement: Asset Type Allocation Section
The dashboard SHALL display an "Allocation by Asset Type" section with an allocation bar and detail table. The table SHALL show each asset type with its value (R$), weight (%), and gain (R$). Asset types SHALL be labeled with human-readable names.

#### Scenario: View asset type allocation
- **GIVEN** the portfolio has STOCK 50%, ETF 33%, FII 17%
- **WHEN** the user opens the dashboard
- **THEN** the asset type section shows a proportional bar and table with three rows

### Requirement: Currency Exposure Section
The dashboard SHALL display a "Currency Exposure" section showing the split between BRL and USD denominated positions. The section SHALL include an allocation bar and a table showing each currency with its value (R$) and weight (%). This gives the user a clear view of international vs local exposure.

#### Scenario: View currency exposure
- **GIVEN** the portfolio has 80% BRL and 20% USD positions (by value in BRL)
- **WHEN** the user opens the dashboard
- **THEN** the currency exposure section shows a bar with BRL dominant and two table rows

#### Scenario: Only local positions
- **GIVEN** the portfolio has only BRL-denominated positions
- **WHEN** the user opens the dashboard
- **THEN** the currency section shows BRL at 100%

### Requirement: Sector Allocation Section
The dashboard SHALL display an "Allocation by Sector" section with an allocation bar and detail table. The table SHALL show each sector with its value (R$), weight (%), and gain (R$). Positions without a sector SHALL appear as "Unclassified".

#### Scenario: View sector allocation
- **GIVEN** the portfolio has positions across "Oil & Gas" (40%), "Banking" (35%), and "Unclassified" (25%)
- **WHEN** the user opens the dashboard
- **THEN** the sector section shows three segments in the bar and three table rows

### Requirement: Top Holdings Section
The dashboard SHALL display a "Top Holdings" section showing the largest positions by portfolio weight. The table SHALL include asset name, ticker, asset type, value (R$), weight (%), and gain (R$). Holdings SHALL be sorted by value descending.

#### Scenario: View top holdings
- **GIVEN** the portfolio has 10 positions with varying values
- **WHEN** the user opens the dashboard
- **THEN** the top holdings table lists positions sorted by value descending with their weight percentages

#### Scenario: Top holdings with few positions
- **GIVEN** the portfolio has only 3 positions
- **WHEN** the user opens the dashboard
- **THEN** the top holdings table shows all 3 positions

### Requirement: Dashboard Data Loading
The dashboard SHALL fetch portfolio summary data from `GET /api/portfolio/summary` when the page loads. While data is loading, the dashboard SHALL display loading indicators. If the request fails, the dashboard SHALL display an error message with a retry option.

#### Scenario: Dashboard loading state
- **WHEN** the user navigates to the dashboard
- **THEN** loading indicators are shown while the API request is in progress

#### Scenario: Dashboard error state
- **GIVEN** the API returns an error
- **WHEN** the user opens the dashboard
- **THEN** an error message is displayed with a "Retry" button that re-fetches the data

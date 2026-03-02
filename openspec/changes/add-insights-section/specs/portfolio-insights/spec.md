## ADDED Requirements

### Requirement: Insights Page and Navigation
The system SHALL provide an Insights page accessible at the `/insights` route. The sidebar navigation SHALL include an "Insights" link with an appropriate icon. The Insights page SHALL serve as a container for multiple insight categories, each rendered as a distinct section. The page SHALL display a header and organize insight cards by category.

#### Scenario: Navigate to insights page
- **WHEN** user clicks "Insights" in the sidebar navigation
- **THEN** the browser navigates to `/insights` and the Insights page is displayed

#### Scenario: Insights page with no data
- **GIVEN** there are no wallets or transactions in the system
- **WHEN** the user opens the Insights page
- **THEN** the page displays an empty state message indicating insufficient portfolio data for analysis

#### Scenario: Insights page with allocation insights
- **GIVEN** the portfolio has positions with market values
- **WHEN** the user opens the Insights page
- **THEN** the page displays an "Asset Allocation" section containing insight cards generated from the allocation analysis

### Requirement: Allocation Insights API Endpoint
The system SHALL expose a `GET /api/insights/allocation` endpoint that analyzes the portfolio's current allocation and returns an array of insight objects. Each insight object SHALL contain: `id` (string, unique identifier for the rule), `category` (string, always "allocation" for this endpoint), `severity` (string, one of "info", "warning", "critical"), `title` (string, human-readable short title), `description` (string, explanatory text with specific values), and `data` (object, context-specific key-value pairs for the insight). The response SHALL also include a `generated_at` ISO timestamp and a `summary` object with `total_insights` count and counts per severity level. When the portfolio is empty or has no priced positions, the endpoint SHALL return an empty insights array with a summary indicating zero insights.

#### Scenario: Successful allocation insights request
- **GIVEN** the portfolio has positions with market values and some allocation issues
- **WHEN** a GET request is made to `/api/insights/allocation`
- **THEN** the response status is 200 and the body contains an array of insight objects, a `generated_at` timestamp, and a `summary` with counts

#### Scenario: Allocation insights with empty portfolio
- **GIVEN** there are no wallets or transactions
- **WHEN** a GET request is made to `/api/insights/allocation`
- **THEN** the response status is 200 with an empty `insights` array and `summary.total_insights` of 0

#### Scenario: Allocation insights with no issues detected
- **GIVEN** the portfolio is well-diversified and no rules trigger
- **WHEN** a GET request is made to `/api/insights/allocation`
- **THEN** the response status is 200 with an empty `insights` array

### Requirement: Asset Class Concentration Detection
The allocation analysis SHALL detect when any single asset class (EQUITY, FIXED_INCOME, REAL_ESTATE) exceeds a concentration threshold of the total portfolio value. When a single asset class weight exceeds 70%, the system SHALL generate a warning-level insight. When it exceeds 85%, the system SHALL generate a critical-level insight. The insight SHALL include the asset class name, its current weight, and the threshold breached.

#### Scenario: Asset class at warning concentration
- **GIVEN** the portfolio has EQUITY at 75% of total value
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated with title indicating equity overconcentration, the description mentions 75% weight, and `data` contains `{ asset_class: "EQUITY", weight: 75, threshold: 70 }`

#### Scenario: Asset class at critical concentration
- **GIVEN** the portfolio has EQUITY at 90% of total value
- **WHEN** allocation insights are generated
- **THEN** a critical insight is generated indicating severe equity concentration at 90%

#### Scenario: No asset class concentration
- **GIVEN** no single asset class exceeds 70% of the portfolio
- **WHEN** allocation insights are generated
- **THEN** no asset class concentration insight is generated

### Requirement: Asset Class Gap Detection
The allocation analysis SHALL detect when the portfolio has zero exposure to any of the three asset classes (EQUITY, FIXED_INCOME, REAL_ESTATE). For each missing asset class, the system SHALL generate an info-level insight suggesting the user consider adding exposure to that class.

#### Scenario: Missing fixed income exposure
- **GIVEN** the portfolio has EQUITY and REAL_ESTATE positions but zero FIXED_INCOME positions
- **WHEN** allocation insights are generated
- **THEN** an info insight is generated indicating no fixed income exposure, with `data` containing `{ missing_class: "FIXED_INCOME" }`

#### Scenario: All asset classes present
- **GIVEN** the portfolio has positions in all three asset classes
- **WHEN** allocation insights are generated
- **THEN** no asset class gap insight is generated

### Requirement: Single Asset Dominance Detection
The allocation analysis SHALL detect when any single asset (identified by ticker/name) represents more than 20% of the total portfolio value. For each dominant asset, the system SHALL generate a warning-level insight. When a single asset exceeds 35%, the severity SHALL be critical. The insight SHALL include the asset name, ticker, weight, and the threshold breached.

#### Scenario: Single asset above warning threshold
- **GIVEN** asset "PETR4" represents 25% of the total portfolio value
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated indicating PETR4 dominance at 25%, with `data` containing the asset details and weight

#### Scenario: Single asset above critical threshold
- **GIVEN** asset "VALE3" represents 40% of the total portfolio value
- **WHEN** allocation insights are generated
- **THEN** a critical insight is generated indicating severe VALE3 concentration at 40%

#### Scenario: No single asset dominance
- **GIVEN** no individual asset exceeds 20% of the portfolio
- **WHEN** allocation insights are generated
- **THEN** no single asset dominance insight is generated

### Requirement: Top Holdings Concentration Detection
The allocation analysis SHALL detect when the top 3 holdings by value represent more than 60% of the total portfolio. The system SHALL generate a warning-level insight. When they exceed 80%, the severity SHALL be critical. The insight SHALL include the names and combined weight of the top 3 holdings.

#### Scenario: Top 3 above warning threshold
- **GIVEN** the top 3 holdings (PETR4, VALE3, ITUB4) represent 65% of the portfolio
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated about top 3 concentration at 65%, with `data` containing the top 3 names and combined weight

#### Scenario: Top 3 below threshold
- **GIVEN** the top 3 holdings represent 45% of the portfolio
- **WHEN** allocation insights are generated
- **THEN** no top holdings concentration insight is generated

#### Scenario: Portfolio with fewer than 3 positions
- **GIVEN** the portfolio has only 2 positions
- **WHEN** allocation insights are generated
- **THEN** the top holdings rule evaluates the 2 positions combined weight and generates an insight if applicable

### Requirement: Currency Concentration Detection
The allocation analysis SHALL detect when a single currency represents more than 90% of the portfolio value. The system SHALL generate an info-level insight suggesting currency diversification. When it exceeds 95%, the severity SHALL be warning.

#### Scenario: BRL at 95% exposure
- **GIVEN** BRL-denominated positions represent 95% of the portfolio value
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated about BRL concentration at 95%, with `data` containing `{ currency: "BRL", weight: 95, threshold: 90 }`

#### Scenario: Balanced currency exposure
- **GIVEN** BRL represents 80% and USD represents 20% of the portfolio
- **WHEN** allocation insights are generated
- **THEN** no currency concentration insight is generated

### Requirement: Sector Concentration Detection
The allocation analysis SHALL detect when any single sector represents more than 40% of the portfolio value. The system SHALL generate a warning-level insight. When it exceeds 55%, the severity SHALL be critical. The "Unclassified" sector SHALL be excluded from this analysis.

#### Scenario: Sector above warning threshold
- **GIVEN** sector "Oil & Gas" represents 45% of the portfolio value
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated about Oil & Gas sector concentration at 45%

#### Scenario: Unclassified sector excluded
- **GIVEN** "Unclassified" positions represent 50% of the portfolio but no classified sector exceeds 40%
- **WHEN** allocation insights are generated
- **THEN** no sector concentration insight is generated (unclassified is excluded)

### Requirement: Wallet Concentration Detection
The allocation analysis SHALL detect when a single wallet holds more than 80% of the total portfolio value. The system SHALL generate an info-level insight suggesting distribution across multiple wallets/brokers. When it exceeds 90%, the severity SHALL be warning.

#### Scenario: Single wallet dominance
- **GIVEN** wallet "Corretora XP" holds 85% of the total portfolio value
- **WHEN** allocation insights are generated
- **THEN** an info insight is generated about concentration in Corretora XP at 85%

#### Scenario: Single wallet at critical level
- **GIVEN** wallet "Corretora XP" holds 95% of the total portfolio value
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated about severe wallet concentration at 95%

#### Scenario: Only one wallet exists
- **GIVEN** the user has only one wallet
- **WHEN** allocation insights are generated
- **THEN** the wallet concentration rule is skipped (single wallet is expected for new users)

### Requirement: Small Position Alert
The allocation analysis SHALL detect positions that represent less than 1% of the total portfolio value. When more than 3 such positions exist, the system SHALL generate a single info-level insight listing the count and combined weight of these small positions, suggesting they may add complexity without meaningful impact.

#### Scenario: Multiple small positions
- **GIVEN** the portfolio has 5 positions each worth less than 1% of total value, with combined weight of 3%
- **WHEN** allocation insights are generated
- **THEN** an info insight is generated indicating 5 small positions representing 3% of the portfolio

#### Scenario: Few small positions
- **GIVEN** the portfolio has 2 positions worth less than 1% each
- **WHEN** allocation insights are generated
- **THEN** no small position alert is generated (threshold is more than 3)

### Requirement: Missing Prices Warning Insight
The allocation analysis SHALL detect when positions without market prices exist. When positions are missing prices, the system SHALL generate a warning-level insight indicating the count of affected positions and a note that the allocation analysis may be incomplete.

#### Scenario: Some positions missing prices
- **GIVEN** 3 out of 10 positions are missing current_price
- **WHEN** allocation insights are generated
- **THEN** a warning insight is generated indicating 3 positions lack market prices and allocation percentages may be incomplete

#### Scenario: All positions have prices
- **GIVEN** all positions have current_price set
- **WHEN** allocation insights are generated
- **THEN** no missing prices warning is generated

### Requirement: Insight Card UI Component
The system SHALL render each insight as a card component with severity-based visual styling. Cards with `info` severity SHALL use a blue/neutral accent. Cards with `warning` severity SHALL use an amber/yellow accent. Cards with `critical` severity SHALL use a red accent. Each card SHALL display the severity icon, title, and description. The cards SHALL be arranged in a responsive grid layout within their category section.

#### Scenario: Render warning insight card
- **GIVEN** an insight with severity "warning" and title "Equity overconcentration"
- **WHEN** the insight card is rendered
- **THEN** the card displays with an amber accent color, a warning icon, the title, and the description text

#### Scenario: Render critical insight card
- **GIVEN** an insight with severity "critical" and title "Severe single-asset dominance"
- **WHEN** the insight card is rendered
- **THEN** the card displays with a red accent color, an alert icon, the title, and the description text

#### Scenario: Render info insight card
- **GIVEN** an insight with severity "info" and title "No fixed income exposure"
- **WHEN** the insight card is rendered
- **THEN** the card displays with a blue/neutral accent, an info icon, the title, and the description text

### Requirement: Insights Loading and Error States
The Insights page SHALL display loading indicators while fetching insight data from the API. If the API request fails, the page SHALL display an error message with a retry button. The loading and error patterns SHALL be consistent with the existing dashboard page behavior.

#### Scenario: Insights loading state
- **WHEN** the user navigates to the Insights page
- **THEN** loading indicators are shown while the API request is in progress

#### Scenario: Insights error state
- **GIVEN** the insights API returns an error
- **WHEN** the user opens the Insights page
- **THEN** an error message is displayed with a "Retry" button that re-fetches the data

### Requirement: Insights Summary Banner
The Insights page SHALL display a summary banner at the top of the allocation section showing the total number of insights found and a breakdown by severity (e.g., "2 critical, 3 warnings, 1 info"). When no insights are found, the banner SHALL display an "all clear" message indicating the portfolio allocation looks healthy.

#### Scenario: Summary with insights
- **GIVEN** the allocation analysis returned 2 warnings and 1 critical insight
- **WHEN** the Insights page is rendered
- **THEN** the summary banner shows "3 insights found: 1 critical, 2 warnings"

#### Scenario: Summary with no insights
- **GIVEN** the allocation analysis returned zero insights
- **WHEN** the Insights page is rendered
- **THEN** the summary banner shows an "all clear" message

## ADDED Requirements

### Requirement: Settings Storage

The system SHALL store global application settings in a `settings` table with columns: `key` (text, primary key), `value` (text, NOT NULL), and `updated_at` (timestamp). The system SHALL seed a default `usd_brl_rate` setting with a value of `5.00` on first run or migration.

#### Scenario: Default USD/BRL rate exists after setup

- **GIVEN** the application database has been initialized
- **WHEN** the settings are queried
- **THEN** a setting with `key = "usd_brl_rate"` and `value = "5.00"` exists

#### Scenario: Setting value is updated

- **GIVEN** a setting `usd_brl_rate` exists with value `5.00`
- **WHEN** the setting is updated to `5.75`
- **THEN** the setting value is `5.75` and `updated_at` is refreshed

### Requirement: Settings API

The system SHALL expose a `GET /api/settings` endpoint that returns all settings as an array of `{ key, value, updated_at }` objects. The system SHALL expose a `PUT /api/settings/:key` endpoint that updates a setting's value. The value MUST be a non-empty string. Unknown keys SHALL return a not-found error.

#### Scenario: List all settings

- **WHEN** a GET request is made to `/api/settings`
- **THEN** the response contains an array including `{ key: "usd_brl_rate", value: "5.00" }`

#### Scenario: Update USD/BRL rate

- **GIVEN** setting `usd_brl_rate` exists
- **WHEN** a PUT request is made to `/api/settings/usd_brl_rate` with body `{ "value": "5.75" }`
- **THEN** the setting is updated and the response returns the updated setting

#### Scenario: Update non-existent setting

- **WHEN** a PUT request is made to `/api/settings/unknown_key`
- **THEN** the system returns a not-found error

#### Scenario: Update with empty value

- **WHEN** a PUT request is made to `/api/settings/usd_brl_rate` with body `{ "value": "" }`
- **THEN** the system returns a validation error

### Requirement: Exchange Rate Display

The frontend SHALL display the current USD/BRL exchange rate and allow the user to update it. The exchange rate input SHALL be accessible from the wallet detail view (e.g., near the positions table header) so the user can quickly adjust it when reviewing positions. The input SHALL validate that the value is a positive number.

#### Scenario: View current exchange rate

- **GIVEN** the USD/BRL rate is set to 5.75
- **WHEN** the user opens a wallet detail
- **THEN** the current exchange rate is displayed as "USD/BRL: 5.75"

#### Scenario: Update exchange rate inline

- **GIVEN** the user is viewing a wallet detail
- **WHEN** the user changes the exchange rate to 6.00 and confirms
- **THEN** the rate is saved and positions are recalculated with the new rate

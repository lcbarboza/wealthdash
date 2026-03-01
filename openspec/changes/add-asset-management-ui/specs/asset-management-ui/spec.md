## ADDED Requirements

### Requirement: Asset List Panel

The assets page SHALL display a list panel on the left side showing all registered assets with their name, ticker, asset type, and asset class.

#### Scenario: Display asset list
- **WHEN** the user navigates to the assets page
- **THEN** a list of all assets is displayed in the left panel with name, ticker, type, and class for each entry

#### Scenario: Search assets by name or ticker
- **WHEN** the user types in the search input on the asset list
- **THEN** the list is filtered client-side to show only assets whose name or ticker matches the search term

#### Scenario: Select an asset
- **WHEN** the user clicks on an asset in the list
- **THEN** the URL updates to `/assets/:id` and the asset detail is shown in the right panel

#### Scenario: Highlight selected asset
- **WHEN** an asset is selected via URL or click
- **THEN** the corresponding item in the list is visually highlighted

### Requirement: Asset Detail Panel

The assets page SHALL display a detail panel on the right side showing all fields of the selected asset with the ability to edit or delete.

#### Scenario: View asset details
- **WHEN** an asset is selected from the list
- **THEN** the right panel displays all asset fields: name, ticker, asset type, asset class, sector, currency, and fixed-income fields (maturity date, rate type, indexer, rate value) when applicable, plus notes and timestamps

#### Scenario: Edit asset inline
- **WHEN** the user clicks the Edit button on the asset detail
- **THEN** the detail panel switches to an editable form pre-filled with the asset's current values
- **AND WHEN** the user submits the form
- **THEN** the `PUT /api/assets/:id` endpoint is called, the asset list is refreshed, and the updated detail is displayed

#### Scenario: Delete asset
- **WHEN** the user clicks the Delete button on the asset detail
- **THEN** a confirmation prompt is shown
- **AND WHEN** the user confirms deletion
- **THEN** the `DELETE /api/assets/:id` endpoint is called, the asset is removed from the list, and the right panel returns to the empty state

### Requirement: Asset Creation

The assets page SHALL allow creating a new asset via a form displayed in the right panel.

#### Scenario: Open creation form
- **WHEN** the user clicks the "New Asset" button in the list panel
- **THEN** the right panel displays an empty asset form for creating a new asset

#### Scenario: Submit creation form
- **WHEN** the user fills in the required fields and submits the creation form
- **THEN** the `POST /api/assets` endpoint is called, the new asset appears in the list, and the new asset's detail is displayed

#### Scenario: Conditional fixed-income fields
- **WHEN** the user selects a fixed-income asset type (TESOURO, CDB, LCI, LCA)
- **THEN** the form displays additional required fields: maturity date, rate type, indexer, and rate value

#### Scenario: Validation error display
- **WHEN** the API returns a validation error (400) during creation or editing
- **THEN** the error messages are displayed inline on the form near the relevant fields

### Requirement: Asset Empty State

The assets page right panel SHALL display an empty state when no asset is selected and the user is not creating a new asset.

#### Scenario: No asset selected
- **WHEN** the user navigates to `/assets` without an asset ID
- **THEN** the right panel displays a message prompting the user to select an asset from the list or create a new one

### Requirement: Split View Layout

The assets page SHALL use a split view layout with a list panel on the left and a detail/form panel on the right.

#### Scenario: Split view rendering
- **WHEN** the user is on the assets page
- **THEN** the page is divided into a left panel (asset list) and a right panel (detail, form, or empty state)

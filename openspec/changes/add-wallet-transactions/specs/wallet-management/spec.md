## ADDED Requirements

### Requirement: Wallet Creation
The system SHALL allow users to create a wallet by providing a name (required) and an optional description. The wallet name MUST be unique across all wallets. The system SHALL generate a UUID for each wallet and record creation and update timestamps.

#### Scenario: Create wallet with valid name
- **GIVEN** no wallet with name "Corretora XP" exists
- **WHEN** user creates a wallet with name "Corretora XP" and description "Main brokerage account"
- **THEN** a new wallet is created with a generated UUID, the provided name and description, and timestamps are set

#### Scenario: Create wallet with duplicate name
- **GIVEN** a wallet with name "Corretora XP" already exists
- **WHEN** user attempts to create a wallet with name "Corretora XP"
- **THEN** the system returns a conflict error indicating the name is already taken

#### Scenario: Create wallet without required name
- **WHEN** user attempts to create a wallet without providing a name
- **THEN** the system returns a validation error indicating name is required

### Requirement: Wallet Listing
The system SHALL return a list of all wallets ordered by name. Each wallet in the list SHALL include its id, name, description, and timestamps.

#### Scenario: List wallets
- **GIVEN** wallets "Corretora XP" and "BTG Pactual" exist
- **WHEN** user requests the wallet list
- **THEN** the system returns both wallets with their full details

#### Scenario: List wallets when none exist
- **GIVEN** no wallets exist
- **WHEN** user requests the wallet list
- **THEN** the system returns an empty list

### Requirement: Wallet Detail
The system SHALL return the full details of a single wallet by its id, including id, name, description, and timestamps.

#### Scenario: Get existing wallet
- **GIVEN** a wallet with id "abc-123" exists
- **WHEN** user requests wallet "abc-123"
- **THEN** the system returns the wallet details

#### Scenario: Get non-existent wallet
- **WHEN** user requests a wallet with an id that does not exist
- **THEN** the system returns a not-found error

### Requirement: Wallet Update
The system SHALL allow users to update a wallet's name and/or description. The updated name MUST remain unique across all wallets. The system SHALL update the `updated_at` timestamp on modification.

#### Scenario: Update wallet name
- **GIVEN** a wallet "Corretora XP" exists and no other wallet is named "Rico"
- **WHEN** user updates the wallet name to "Rico"
- **THEN** the wallet name is changed to "Rico" and `updated_at` is refreshed

#### Scenario: Update wallet name to duplicate
- **GIVEN** wallets "Corretora XP" and "Rico" exist
- **WHEN** user attempts to rename "Corretora XP" to "Rico"
- **THEN** the system returns a conflict error

### Requirement: Wallet Deletion
The system SHALL allow users to delete a wallet by its id. Deleting a wallet SHALL also delete all transactions associated with that wallet (cascade delete).

#### Scenario: Delete wallet with transactions
- **GIVEN** a wallet "Corretora XP" exists with 3 transactions
- **WHEN** user deletes wallet "Corretora XP"
- **THEN** the wallet and all 3 of its transactions are removed

#### Scenario: Delete non-existent wallet
- **WHEN** user attempts to delete a wallet that does not exist
- **THEN** the system returns a not-found error

### Requirement: Wallet Management UI
The system SHALL provide a frontend page for managing wallets with a master-detail layout. The page SHALL display a list of wallets in the left panel and wallet details (or a creation form) in the right panel. The sidebar navigation SHALL include a "Wallets" link.

#### Scenario: Navigate to wallets page
- **WHEN** user clicks "Wallets" in the sidebar
- **THEN** the wallets page is displayed with the wallet list and an empty state or first wallet selected

#### Scenario: Create wallet from UI
- **WHEN** user clicks the "New" button on the wallets page and fills in the name and description
- **THEN** the wallet is created and appears in the wallet list

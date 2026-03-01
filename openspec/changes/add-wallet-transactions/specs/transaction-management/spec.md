## ADDED Requirements

### Requirement: Transaction Creation
The system SHALL allow users to create a transaction within a wallet by providing an asset id, quantity, unit price, and purchase date. The transaction type SHALL default to "BUY". Quantity MUST be greater than zero. Unit price MUST be greater than or equal to zero. The date MUST be a valid date in YYYY-MM-DD format (stored) and displayed as DD/MM/YYYY. The system SHALL validate that both the wallet and the referenced asset exist.

#### Scenario: Create buy transaction with valid data
- **GIVEN** wallet "Corretora XP" and asset "PETR4" exist
- **WHEN** user creates a transaction in "Corretora XP" for asset "PETR4" with quantity 100, unit price 28.50, and date "2025-01-15"
- **THEN** a BUY transaction is created with the provided details, a generated UUID, and timestamps

#### Scenario: Create transaction with non-existent asset
- **GIVEN** wallet "Corretora XP" exists but asset id "non-existent" does not
- **WHEN** user creates a transaction referencing "non-existent" asset
- **THEN** the system returns a validation error indicating the asset does not exist

#### Scenario: Create transaction with non-existent wallet
- **GIVEN** asset "PETR4" exists but wallet id "non-existent" does not
- **WHEN** user creates a transaction in wallet "non-existent"
- **THEN** the system returns a not-found error for the wallet

#### Scenario: Create transaction with invalid quantity
- **WHEN** user creates a transaction with quantity 0 or negative
- **THEN** the system returns a validation error indicating quantity must be greater than zero

#### Scenario: Create transaction with invalid unit price
- **WHEN** user creates a transaction with a negative unit price
- **THEN** the system returns a validation error indicating unit price must be greater than or equal to zero

### Requirement: Transaction Listing
The system SHALL return all transactions for a given wallet, ordered by date descending (most recent first). Each transaction SHALL include its id, asset id, asset name, asset ticker, transaction type, quantity, unit price, total cost (quantity * unit price), date, notes, and timestamps.

#### Scenario: List transactions for a wallet
- **GIVEN** wallet "Corretora XP" has 3 transactions for different assets
- **WHEN** user requests transactions for "Corretora XP"
- **THEN** the system returns all 3 transactions with full details, ordered by date descending

#### Scenario: List transactions for wallet with no transactions
- **GIVEN** wallet "Corretora XP" has no transactions
- **WHEN** user requests transactions for "Corretora XP"
- **THEN** the system returns an empty list

### Requirement: Transaction Detail
The system SHALL return the full details of a single transaction by its id within a wallet context, including the referenced asset name and ticker.

#### Scenario: Get existing transaction
- **GIVEN** a transaction with id "txn-123" exists in wallet "Corretora XP"
- **WHEN** user requests transaction "txn-123"
- **THEN** the system returns the transaction with full details including asset information

#### Scenario: Get non-existent transaction
- **WHEN** user requests a transaction with an id that does not exist
- **THEN** the system returns a not-found error

### Requirement: Transaction Update
The system SHALL allow users to update a transaction's quantity, unit price, date, and notes. The asset reference SHALL NOT be changeable after creation. The same validation rules for quantity, unit price, and date apply on update.

#### Scenario: Update transaction quantity and price
- **GIVEN** a transaction exists with quantity 100 and unit price 28.50
- **WHEN** user updates the quantity to 150 and unit price to 29.00
- **THEN** the transaction is updated and `updated_at` is refreshed

#### Scenario: Update transaction with invalid data
- **WHEN** user updates a transaction with quantity 0
- **THEN** the system returns a validation error

### Requirement: Transaction Deletion
The system SHALL allow users to delete a single transaction by its id within a wallet.

#### Scenario: Delete existing transaction
- **GIVEN** a transaction "txn-123" exists in wallet "Corretora XP"
- **WHEN** user deletes transaction "txn-123"
- **THEN** the transaction is removed

#### Scenario: Delete non-existent transaction
- **WHEN** user attempts to delete a transaction that does not exist
- **THEN** the system returns a not-found error

### Requirement: Transaction Management UI
The system SHALL provide a UI for managing transactions within a wallet detail view. The UI SHALL include a transaction list showing all transactions for the wallet, a form to add new transactions (with asset selector, quantity, unit price, and date fields), and the ability to edit and delete existing transactions.

#### Scenario: Add transaction from wallet detail
- **GIVEN** user is viewing wallet "Corretora XP" detail
- **WHEN** user clicks "Add Transaction", selects asset "PETR4", enters quantity 100, unit price 28.50, date 15/01/2025, and submits
- **THEN** the transaction appears in the transaction list within the wallet

#### Scenario: View transactions in wallet detail
- **GIVEN** wallet "Corretora XP" has transactions
- **WHEN** user views the wallet detail
- **THEN** transactions are displayed in a list sorted by date with asset name, quantity, unit price, total, and date columns

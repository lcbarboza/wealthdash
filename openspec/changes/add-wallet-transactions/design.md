## Context

The investment portfolio app currently has asset CRUD but no mechanism to record holdings or transactions. This change introduces wallets (logical groupings of holdings) and transactions (individual buy operations) as the foundation for portfolio tracking. It is a cross-cutting change spanning database, backend services/routes, and frontend pages/components.

## Goals / Non-Goals

- Goals:
  - Allow users to create and manage wallets
  - Record buy transactions (asset, quantity, unit price, purchase date) within a wallet
  - Consolidate multiple transactions of the same asset into a single position view (total quantity, weighted average cost, total cost basis)
  - Keep the data model simple and extensible for future sell transactions, income events, and multi-currency support
- Non-Goals:
  - Sell transactions (future scope)
  - Income events / dividends (future scope)
  - Market price integration or unrealized P&L (future scope)
  - Multi-currency conversion within a wallet (future scope)
  - Fees tracking on transactions (future scope, field can be added later)

## Decisions

### Data Model

- **Wallet**: `id` (UUID), `name` (required, unique), `description` (optional), `created_at`, `updated_at`
  - Rationale: minimal entity to group transactions. Name is unique to avoid confusion. No currency constraint on wallet level since a wallet can hold assets of different currencies.

- **Transaction**: `id` (UUID), `wallet_id` (FK -> wallets), `asset_id` (FK -> assets), `type` (BUY for now), `quantity` (real, > 0), `unit_price` (real, >= 0), `date` (text, ISO 8601 date format YYYY-MM-DD stored, displayed as DD/MM/YYYY), `notes` (optional), `created_at`, `updated_at`
  - Rationale: FK constraints ensure referential integrity. Date stored as ISO for sorting; UI handles DD/MM/YYYY display. `type` field included from the start (defaulting to BUY) so the schema is ready for SELL later without migration.

### Position Consolidation

- Positions are **computed on read**, not stored. A position for an asset within a wallet is derived by aggregating all BUY transactions:
  - `total_quantity = SUM(quantity)`
  - `total_cost = SUM(quantity * unit_price)`
  - `average_cost = total_cost / total_quantity`
- Rationale: avoids denormalization and keeps the source of truth in transactions. For the expected data volume (personal portfolio), this is performant enough. A materialized view or cache can be added later if needed.

### API Design

- Transactions are nested under wallets: `/api/wallets/:walletId/transactions`
  - Rationale: transactions belong to a wallet contextually. This makes the wallet detail page fetch straightforward.
- Position endpoint: `GET /api/wallets/:walletId/positions`
  - Returns aggregated positions per asset within the wallet.
- Wallet CRUD: `/api/wallets` (standard REST)

### Frontend Structure

- New route `/wallets` with master-detail layout (same pattern as assets page)
- Wallet detail shows: wallet info, list of positions (consolidated), and ability to add transactions
- Transaction form: select asset (from existing assets), enter quantity, unit price, and date
- Reuse existing layout patterns (sidebar navigation, master-detail split)

### Alternatives Considered

- **Flat transaction list (no wallets)**: simpler but loses the ability to group by brokerage account. Wallet is a lightweight wrapper that adds organizational value.
- **Stored positions table**: would require triggers or application-level sync to keep positions updated. Computed-on-read is simpler and sufficient for MVP scale.
- **Transactions nested under assets instead of wallets**: considered, but wallet-centric nesting is more natural for the user flow (open wallet -> see what I hold -> add transaction).

## Risks / Trade-offs

- **Computed positions on read**: may become slow with thousands of transactions. Mitigation: add SQLite indexes on `wallet_id` and `asset_id`; introduce materialized positions later if needed.
- **No sell transactions yet**: positions only grow. Mitigation: `type` field is already in the schema; adding SELL logic later requires service-level changes only, not schema changes.
- **Date stored as text**: SQLite limitation. Mitigation: ISO 8601 format enables proper string-based sorting and comparison.

## Open Questions

- None at this stage. The design is intentionally minimal to ship quickly and iterate.

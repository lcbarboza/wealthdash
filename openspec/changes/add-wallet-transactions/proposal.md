# Change: Add Wallets and Transaction Management

## Why

The application currently supports asset registration but has no way to record purchases, track positions, or organize holdings into wallets. Users need to create wallets (representing a brokerage account or logical grouping), record buy transactions with quantity, unit price, and purchase date against registered assets, and see consolidated positions per asset within a wallet.

## What Changes

- **New `wallets` table**: stores wallet name and optional description; each wallet groups a set of transactions
- **New `transactions` table**: records individual buy operations with asset reference, quantity, unit price, date, and wallet reference
- **New `WalletService`**: CRUD operations for wallets with validation
- **New `TransactionService`**: CRUD for transactions, validates asset and wallet existence, computes consolidated position (total quantity, average cost) per asset within a wallet
- **New API routes**: `/api/wallets` CRUD and `/api/wallets/:walletId/transactions` CRUD, plus `/api/wallets/:walletId/positions` for consolidated view
- **New frontend pages**: wallet list/detail management UI, transaction entry form within a wallet, consolidated position view per wallet
- **Updated sidebar navigation**: adds "Wallets" link

## Impact

- Affected specs: `wallet-management` (new), `transaction-management` (new), `position-consolidation` (new)
- Affected code:
  - `apps/api/src/db/schema.ts` (new tables)
  - `apps/api/src/types/` (new type files)
  - `apps/api/src/services/` (new services)
  - `apps/api/src/routes/` (new routes)
  - `apps/api/src/server.ts` (register new routes)
  - `apps/web/src/types/` (new type files)
  - `apps/web/src/services/api/` (new API clients)
  - `apps/web/src/pages/` (new pages)
  - `apps/web/src/components/` (new components)
  - `apps/web/src/components/layout/sidebar.tsx` (add Wallets nav)
  - `apps/web/src/app.tsx` (add wallet routes)
  - New Drizzle migration for `wallets` and `transactions` tables

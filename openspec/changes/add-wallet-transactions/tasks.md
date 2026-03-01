## 1. Database Schema & Migration

- [x] 1.1 Add `wallets` table to Drizzle schema (`apps/api/src/db/schema.ts`): id (text PK), name (text NOT NULL UNIQUE), description (text nullable), created_at, updated_at
- [x] 1.2 Add `transactions` table to Drizzle schema: id (text PK), wallet_id (text FK -> wallets), asset_id (text FK -> assets), type (text NOT NULL default 'BUY'), quantity (real NOT NULL), unit_price (real NOT NULL), date (text NOT NULL), notes (text nullable), created_at, updated_at
- [x] 1.3 Generate and apply Drizzle migration for both tables

## 2. Backend Types

- [x] 2.1 Create `apps/api/src/types/wallet.ts`: CreateWalletInput, UpdateWalletInput interfaces
- [x] 2.2 Create `apps/api/src/types/transaction.ts`: TransactionType const, CreateTransactionInput, UpdateTransactionInput interfaces, Position interface for consolidated view

## 3. Backend Services

- [x] 3.1 Create `apps/api/src/services/wallet-service.ts`: createWallet, getWalletById, listWallets, updateWallet, deleteWallet (cascade transactions)
- [x] 3.2 Create `apps/api/src/services/transaction-service.ts`: createTransaction (validate wallet + asset exist, validate quantity > 0 and unit_price >= 0), getTransactionById, listTransactionsByWallet, updateTransaction, deleteTransaction
- [x] 3.3 Add position consolidation logic to transaction service: getPositionsByWallet (aggregate BUY transactions per asset, compute total_quantity, total_cost, average_cost, join asset details)

## 4. Backend Routes

- [x] 4.1 Create `apps/api/src/routes/wallets.ts`: POST /api/wallets, GET /api/wallets, GET /api/wallets/:id, PUT /api/wallets/:id, DELETE /api/wallets/:id
- [x] 4.2 Create `apps/api/src/routes/transactions.ts`: POST /api/wallets/:walletId/transactions, GET /api/wallets/:walletId/transactions, GET /api/wallets/:walletId/transactions/:id, PUT /api/wallets/:walletId/transactions/:id, DELETE /api/wallets/:walletId/transactions/:id
- [x] 4.3 Add GET /api/wallets/:walletId/positions route for consolidated positions
- [x] 4.4 Register new routes in `apps/api/src/server.ts`

## 5. Frontend Types & API Clients

- [x] 5.1 Create `apps/web/src/types/wallet.ts`: Wallet interface, CreateWalletInput, UpdateWalletInput, label maps
- [x] 5.2 Create `apps/web/src/types/transaction.ts`: Transaction interface, TransactionType, CreateTransactionInput, Position interface
- [x] 5.3 Create `apps/web/src/services/api/wallets.ts`: listWallets, getWallet, createWallet, updateWallet, deleteWallet
- [x] 5.4 Create `apps/web/src/services/api/transactions.ts`: listTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction, getPositions

## 6. Frontend Pages & Components

- [x] 6.1 Create wallet list component (`apps/web/src/components/wallets/wallet-list.tsx`): searchable list with NavLinks
- [x] 6.2 Create wallet detail component (`apps/web/src/components/wallets/wallet-detail.tsx`): shows wallet info, positions tab, transactions tab
- [x] 6.3 Create wallet form component (`apps/web/src/components/wallets/wallet-form.tsx`): name + description fields
- [x] 6.4 Create wallet empty state component (`apps/web/src/components/wallets/wallet-empty.tsx`)
- [x] 6.5 Create position list component (`apps/web/src/components/wallets/position-list.tsx`): table of consolidated positions
- [x] 6.6 Create transaction list component (`apps/web/src/components/wallets/transaction-list.tsx`): table of transactions with asset info
- [x] 6.7 Create transaction form component (`apps/web/src/components/wallets/transaction-form.tsx`): asset selector, quantity, unit price, date, notes
- [x] 6.8 Create wallets page (`apps/web/src/pages/wallets-page.tsx`): master-detail layout

## 7. Frontend Routing & Navigation

- [x] 7.1 Add wallet routes to `apps/web/src/app.tsx`: /wallets, /wallets/:id
- [x] 7.2 Add "Wallets" link to sidebar (`apps/web/src/components/layout/sidebar.tsx`)

## 8. Testing

- [ ] 8.1 Write unit tests for wallet-service (create, read, update, delete, uniqueness validation)
- [ ] 8.2 Write unit tests for transaction-service (create, read, update, delete, FK validation, quantity/price validation)
- [ ] 8.3 Write unit tests for position consolidation logic (single txn, multiple txns same asset, multiple assets, empty wallet)
- [ ] 8.4 Write integration tests for wallet API routes
- [ ] 8.5 Write integration tests for transaction API routes
- [ ] 8.6 Write integration tests for positions API route

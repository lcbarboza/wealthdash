## 1. Routing and Proxy Setup

- [x] 1.1 Install `react-router-dom` in `apps/web`
- [x] 1.2 Configure Vite proxy to forward `/api` to `http://localhost:3000`
- [x] 1.3 Set up router in `app.tsx` with routes: `/` (redirect to `/assets`), `/assets`, `/assets/:id`, `/dashboard`

## 2. App Shell Layout

- [x] 2.1 Create `types/asset.ts` with frontend type definitions mirroring backend DTOs and enums
- [x] 2.2 Create `components/layout/sidebar.tsx` with nav links (Dashboard, Assets) using NavLink for active state
- [x] 2.3 Create `components/layout/layout.tsx` wrapping sidebar + `<Outlet />` for page content
- [x] 2.4 Refactor `app.tsx` to use the Layout component as the route wrapper

## 3. API Client Layer

- [x] 3.1 Create `services/api/assets.ts` with typed fetch wrappers: `listAssets`, `getAsset`, `createAsset`, `updateAsset`, `deleteAsset`

## 4. Asset List Panel (Left)

- [x] 4.1 Create `components/assets/asset-list.tsx` displaying all assets with name, ticker, type, and class
- [x] 4.2 Add a search input to filter assets by name/ticker (client-side filtering)
- [x] 4.3 Add a "New Asset" button that triggers creation mode
- [x] 4.4 Highlight the currently selected asset; link each item to `/assets/:id`

## 5. Asset Detail Panel (Right)

- [x] 5.1 Create `components/assets/asset-empty.tsx` for the empty/no-selection state
- [x] 5.2 Create `components/assets/asset-form.tsx` as a shared form for create and edit (handles all asset fields, conditional fixed-income fields)
- [x] 5.3 Create `components/assets/asset-detail.tsx` with view mode showing all asset fields and an Edit button to toggle into edit mode
- [x] 5.4 Wire up create: "New Asset" from list replaces right panel with the form; on submit, call `createAsset` and refresh the list
- [x] 5.5 Wire up edit: Edit button in detail view switches to form pre-filled with asset data; on submit, call `updateAsset` and refresh
- [x] 5.6 Wire up delete: Delete button in detail view with confirmation; call `deleteAsset`, refresh list, and clear selection

## 6. Assets Page (Split View Orchestrator)

- [x] 6.1 Create `pages/assets-page.tsx` composing the list panel and detail panel side by side
- [x] 6.2 Manage selected asset state via URL params (`useParams` for `:id`) and a `creating` state for new asset mode

## 7. Dashboard Placeholder

- [x] 7.1 Create `pages/dashboard-page.tsx` with a simple placeholder message

## 8. Verification

- [x] 8.1 Run Biome lint/format check and fix any issues
- [x] 8.2 Run TypeScript build (`npm run build -w apps/web`) and fix any type errors
- [x] 8.3 Manual verification: start both API and web dev servers, test full CRUD flow (create, list, view, edit, delete)

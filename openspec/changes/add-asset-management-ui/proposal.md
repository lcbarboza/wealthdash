# Change: Add Asset Management UI with Split View Layout

## Why

The backend already provides a complete asset CRUD API (`/api/assets`), but the frontend is a static placeholder shell with no routing, no data fetching, and no way to manage assets. Users need a functional interface to create, view, edit, and delete assets in the portfolio.

## What Changes

- Install and configure **react-router-dom** for client-side routing
- Configure **Vite proxy** to forward `/api` requests to the backend during development
- Create an **app shell layout** with a persistent navigation sidebar and a main content area
- Introduce an **API client layer** (`services/api/`) for typed communication with the backend
- Build the **Assets page** as a split view:
  - Left panel: filterable/searchable asset list
  - Right panel: asset detail with inline edit, or a creation form for new assets
- Add placeholder routes for future pages (Dashboard) so the sidebar navigation is meaningful

## Impact

- Affected specs: `frontend-tooling` (new dependency: react-router-dom), new capabilities `app-layout` and `asset-management-ui`
- Affected code: `apps/web/` (new pages, components, hooks, services, routing setup; refactored `app.tsx`)

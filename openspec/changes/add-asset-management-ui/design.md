## Context

The frontend (`apps/web`) is a bare React 19 + Vite + Tailwind CSS v4 shell with no routing, state management, or API integration. The backend already exposes a full asset CRUD API. This change introduces the first real UI: an app shell with sidebar navigation and an asset management split view.

## Goals / Non-Goals

- Goals:
  - Establish the app shell layout pattern (sidebar + main content) that all future pages will reuse
  - Build a fully functional asset CRUD interface using the existing API
  - Introduce react-router-dom for page navigation
  - Create an API client layer for typed fetch calls
  - Keep the implementation simple: plain fetch, React state, no external state management library

- Non-Goals:
  - Adding a component library (use Tailwind utility classes directly)
  - Global state management (Zustand, Redux, etc.) -- local component state and prop drilling are sufficient for this scope
  - Pagination or infinite scroll (asset list is small in MVP)
  - Dark mode
  - Mobile-optimized responsive layout (desktop-first; basic responsiveness is acceptable)
  - Form validation library (use simple inline validation matching backend rules)
  - Optimistic updates or caching layer (simple fetch-on-action pattern)

## Decisions

### Routing: react-router-dom v7

- **Decision**: Use react-router-dom for client-side routing.
- **Why**: Industry standard for React apps, well-documented, supports nested layouts out of the box.
- **Routes**:
  - `/` -- redirects to `/assets`
  - `/assets` -- asset management split view
  - `/assets/:id` -- asset management with a specific asset selected (deep-linkable)
  - `/dashboard` -- placeholder page for future dashboard

### Layout: Sidebar + Main Content

- **Decision**: Fixed-width sidebar (~240px) on the left, remaining space for page content.
- **Why**: Standard pattern for data-heavy apps; the sidebar persists across pages.
- **Implementation**: A `<Layout>` component wraps all routes; the sidebar is always visible.

### Asset Page: Split View (Master-Detail)

- **Decision**: The assets page splits into a list panel (~320px) and a detail/edit panel (remaining space).
- **Why**: Master-detail is the standard pattern for CRUD management interfaces; avoids full-page navigation for every action.
- **States**:
  - No asset selected: right panel shows an empty state prompting the user to select or create an asset.
  - Asset selected: right panel shows asset details with an edit toggle.
  - Creating: right panel shows the creation form (triggered by a "New Asset" button in the list panel).

### API Client: Plain fetch with typed wrappers

- **Decision**: Create a small `api/assets.ts` module with typed functions (`listAssets`, `getAsset`, `createAsset`, `updateAsset`, `deleteAsset`) that wrap `fetch`.
- **Why**: No need for axios or TanStack Query at this scale. Plain fetch keeps dependencies minimal.
- **Vite proxy**: Configure `vite.config.ts` to proxy `/api` requests to `http://localhost:3000` during development to avoid CORS issues.

### Component Structure

```
src/
├── app.tsx                    # Router setup
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   └── layout.tsx         # Sidebar + Outlet wrapper
│   └── assets/
│       ├── asset-list.tsx     # Left panel: list + filters + search
│       ├── asset-detail.tsx   # Right panel: view/edit mode
│       ├── asset-form.tsx     # Shared form for create/edit
│       └── asset-empty.tsx    # Empty state for right panel
├── pages/
│   ├── assets-page.tsx        # Split view orchestrator
│   └── dashboard-page.tsx     # Placeholder
├── services/
│   └── api/
│       └── assets.ts          # Typed fetch wrappers for /api/assets
├── types/
│   └── asset.ts               # Frontend type definitions (mirroring backend DTOs)
├── index.css
└── main.tsx
```

## Risks / Trade-offs

- **Duplicated types**: Frontend types will mirror backend DTOs. Acceptable for MVP; a shared `packages/types` workspace can be extracted later if drift becomes a problem.
- **No caching/stale data**: Every action refetches the list. Acceptable for a single-user app with small datasets.
- **No error boundary**: Fetch errors will be handled with inline error states per component. A global error boundary can be added later.

## Open Questions

- None at this time. The scope is well-defined and the backend API is stable.

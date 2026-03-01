## ADDED Requirements

### Requirement: Navigation Sidebar

The application SHALL display a persistent navigation sidebar on the left side of the viewport with links to all top-level pages.

#### Scenario: Sidebar displays navigation links
- **WHEN** the application is loaded at any route
- **THEN** a sidebar is visible on the left with links to "Dashboard" and "Assets"

#### Scenario: Active route is highlighted
- **WHEN** the user is on the Assets page
- **THEN** the "Assets" link in the sidebar is visually highlighted as active

### Requirement: App Shell Layout

The application SHALL use a shell layout consisting of a fixed-width sidebar and a main content area that renders the current page.

#### Scenario: Layout wraps all pages
- **WHEN** the user navigates to any route
- **THEN** the page content is rendered inside the main content area next to the sidebar

### Requirement: Client-Side Routing

The application SHALL use client-side routing to navigate between pages without full-page reloads.

#### Scenario: Route to assets page
- **WHEN** the user navigates to `/assets`
- **THEN** the assets management page is displayed

#### Scenario: Deep link to specific asset
- **WHEN** the user navigates to `/assets/:id`
- **THEN** the assets page is displayed with the specified asset selected in the detail panel

#### Scenario: Root redirect
- **WHEN** the user navigates to `/`
- **THEN** the application redirects to `/assets`

#### Scenario: Dashboard placeholder
- **WHEN** the user navigates to `/dashboard`
- **THEN** a placeholder dashboard page is displayed

### Requirement: API Proxy in Development

The frontend development server SHALL proxy requests to `/api` to the backend server to avoid CORS issues during development.

#### Scenario: API requests are proxied
- **WHEN** the frontend makes a fetch request to `/api/assets` in development mode
- **THEN** the request is forwarded to the backend server at `http://localhost:3000/api/assets`

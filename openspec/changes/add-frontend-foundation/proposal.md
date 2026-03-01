# Change: Add frontend foundation

## Why
The Wealth Dash project has no application code yet. A foundational frontend structure is required before any feature work can begin, including the monorepo workspace layout, React 19 + Vite build pipeline, Tailwind CSS styling, and a visual identity system that ensures consistency across the application.

## What Changes
- Initialize root `package.json` with npm workspaces pointing to `apps/*`
- Scaffold `apps/web` with React 19, TypeScript, and Vite
- Configure Biome for linting and formatting across the monorepo
- Install and configure Tailwind CSS v4 in `apps/web`
- Define a visual identity system (color palette, typography scale, spacing, border radii) as Tailwind theme extensions and CSS custom properties
- Create a minimal app shell (root layout, placeholder route) to verify the full pipeline works end-to-end

## Impact
- Affected specs: `monorepo-setup` (new), `frontend-tooling` (new), `visual-identity` (new)
- Affected code: root `package.json`, `biome.json`, `apps/web/**`

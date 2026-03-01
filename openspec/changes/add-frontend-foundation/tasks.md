## 1. Monorepo Setup
- [x] 1.1 Create root `package.json` with `"workspaces": ["apps/*"]`, project name, and `"private": true`
- [x] 1.2 Create root `biome.json` with 2-space indent, single quotes, and recommended lint rules
- [x] 1.3 Add root convenience scripts (`dev`, `build`, `lint`) that delegate to the web workspace

**Validation**: `npm install` succeeds at root; `biome.json` is parseable

## 2. Frontend Tooling (apps/web)
- [x] 2.1 Scaffold `apps/web/package.json` with React 19, ReactDOM 19, TypeScript, Vite, and `@vitejs/plugin-react` as dependencies
- [x] 2.2 Create `apps/web/tsconfig.json` with `strict: true`, React JSX transform, and appropriate module/target settings
- [x] 2.3 Create `apps/web/vite.config.ts` with the React plugin
- [x] 2.4 Create `apps/web/index.html` entry point that mounts the React app
- [x] 2.5 Create `apps/web/src/main.tsx` with React root render
- [x] 2.6 Create a minimal `apps/web/src/app.tsx` placeholder component

**Validation**: `npm run dev` starts the dev server; `npm run build` produces `apps/web/dist/`; `npx @biomejs/biome check apps/web/src` reports no errors

## 3. Visual Identity (Tailwind + Design Tokens)
- [x] 3.1 Install Tailwind CSS v4 and `@tailwindcss/vite` in `apps/web`
- [x] 3.2 Configure Vite to use the Tailwind CSS plugin
- [x] 3.3 Create `apps/web/src/index.css` with `@import "tailwindcss"` and `@theme` block defining: color palette (primary, neutral, success, danger, warning), font family (Inter + system fallbacks), and border-radius tokens
- [x] 3.4 Import `index.css` in `main.tsx`
- [x] 3.5 Update `app.tsx` to use Tailwind utility classes, verifying tokens render correctly

**Validation**: Dev server shows styled content; built CSS contains custom properties for defined tokens; Tailwind utilities apply expected styles

## 4. Final Verification
- [x] 4.1 Run `npm install` from root — succeeds without errors
- [x] 4.2 Run `npm run dev` — dev server starts and app renders
- [x] 4.3 Run `npm run build` — production build succeeds
- [x] 4.4 Run lint check — no errors on source files

**Dependencies**: Section 2 depends on Section 1. Section 3 depends on Section 2. Section 4 depends on all prior sections. Within each section, tasks are sequential.

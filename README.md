# Wealth Dash

Personal investment portfolio tracker. Register assets, record transactions and income events, and visualize consolidated dashboards with allocation, performance, and insights.

## Tech Stack

- **Monorepo** -- npm workspaces
- **Frontend** -- React 19, TypeScript (strict), Vite, Tailwind CSS v4
- **Backend** -- Node.js, Fastify, TypeScript _(planned)_
- **Tooling** -- Biome (lint/format)

## Project Structure

```
apps/
  web/          React frontend
  api/          Fastify backend (planned)
openspec/       Specs and change proposals
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (apps/web)
npm run dev

# Production build
npm run build

# Lint and format check
npm run lint
```

## Conventions

- TypeScript `strict: true` everywhere
- Biome for linting and formatting (2-space indent, single quotes)
- Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`)
- Spec-first workflow via OpenSpec -- meaningful changes start with a proposal

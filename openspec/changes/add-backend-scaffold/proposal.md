# Change: Add backend scaffold with health-check endpoint

## Why
The project needs the `apps/api` workspace to begin backend development. A health-check endpoint provides immediate verification that the server is running and serves as a reference for the route/service pattern.

## What Changes
- Scaffold `apps/api` workspace with Fastify, TypeScript (strict), and the directory structure defined in `project.md` (`routes/`, `services/`, `utils/`, `types/`, `config/`)
- Create a Fastify server entry point with basic configuration
- Implement a `GET /health` endpoint returning server status
- Add dev and build scripts for the api workspace
- Add root-level convenience scripts for the api workspace

## Impact
- Affected specs: `backend-setup` (new), `health-check` (new)
- Affected code: root `package.json` (scripts), `apps/api/**`

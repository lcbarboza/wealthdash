## 1. API Workspace Setup
- [x] 1.1 Create `apps/api/package.json` with Fastify, TypeScript, and `tsx` (dev runner) as dependencies
- [x] 1.2 Create `apps/api/tsconfig.json` with `strict: true`, ESNext modules, and `outDir: dist`
- [x] 1.3 Create the directory structure: `src/routes/`, `src/services/`, `src/utils/`, `src/types/`, `src/config/`

**Validation**: `npm install` succeeds; `tsconfig.json` is valid

## 2. Server Entry Point
- [x] 2.1 Create `apps/api/src/config/env.ts` with port configuration (default `3000`)
- [x] 2.2 Create `apps/api/src/server.ts` that builds and configures the Fastify instance
- [x] 2.3 Create `apps/api/src/main.ts` that imports the server, starts it, and listens on the configured port

**Validation**: `npm run dev --workspace=apps/api` starts the server; `npm run build --workspace=apps/api` compiles without errors

## 3. Health Check Endpoint
- [x] 3.1 Create `apps/api/src/routes/health.ts` with a `GET /health` route returning `{ status: 'ok', uptime: <seconds> }`
- [x] 3.2 Register the health route in the server setup

**Validation**: `curl http://localhost:3000/health` returns `200` with `{ "status": "ok", "uptime": <number> }`

## 4. Root Scripts and Final Verification
- [x] 4.1 Add `dev:api`, `build:api` scripts to root `package.json`
- [x] 4.2 Run `npm install` from root -- succeeds
- [x] 4.3 Run `npm run build:api` -- compiles without errors
- [x] 4.4 Run lint check -- no errors on `apps/api/src` files

**Dependencies**: Section 2 depends on Section 1. Section 3 depends on Section 2. Section 4 depends on all prior sections.

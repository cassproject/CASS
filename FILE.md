# FILE.md — Project File Reference

Files included in Docker container images and used for configuration. See also [CONFIGURATION.md](CONFIGURATION.md) for server configuration and [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides.

---

## Root — Copied into Containers

| File | Purpose |
|------|---------|
| `package.json` | Node.js manifest — declares dependencies, scripts (`dev`, `run`, `mochaDev`), and metadata. Copied first so Docker can cache `npm install`. |
| `ca.crt` | Certificate Authority certificate for TLS trust chain. |
| `cass.crt` | Server TLS certificate (used when `HTTPS=true`). |
| `cass.key` | Server TLS private key (used when `HTTPS=true`). |
| `copyright.txt` | Copyright notice, bundled into the image. |
| `LICENSE` | Apache 2.0 license (copied by standalone Dockerfile only). |

---

## Docker — Build & Compose

### `docker/standalone/node/` — Dockerfiles

| File | Purpose |
|------|---------|
| `Dockerfile` | **Default** — Debian `node:24-slim` base, builds FIPS OpenSSL 3.1.2, runs as UID 1000. |
| `DockerfileAlpine` | Alpine `node:24-alpine` base, dual-version FIPS OpenSSL (validated 3.1.2 provider + latest 3.5.5 runtime). |
| `DockerfileDistroless` | Multi-stage: builds in `node:24-slim`, then copies app into `gcr.io/distroless/nodejs24-debian12` for minimal attack surface. No shell, no package manager. |
| `DockerfileP1` | Platform One (Iron Bank) — `nodejs16` base from `registry1.dso.mil`, pre-built `node_modules`. |

### `docker/standalone/` — Standalone (all-in-one)

| File | Purpose |
|------|---------|
| `Dockerfile` | Bundles Elasticsearch + Node.js in a single container. Runs both CaSS and ES via entrypoint. Legacy/convenience image. |
| `docker-compose.yml` | Compose file for the pre-built standalone image (`cassproject/cass:1.6.9`). |

### Root-level Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | **Primary** — CaSS (HTTP on :80) + CaSS-TLS (HTTPS on :443) + Elasticsearch 9.x. Uses `docker/standalone/node/Dockerfile`. |
| `docker-compose-alpine.yml` | Same as above but uses `DockerfileAlpine`. |
| `docker-compose-distroless.yml` | Same as above but uses `DockerfileDistroless`. |
| `docker-compose-opensearch.yml` | Replaces Elasticsearch with OpenSearch. |
| `docker-compose-template.yml` | Minimal template for custom deployments. |

---

## `src/main/` — Application Source (copied as `src/`)

### Entry Point

| File | Purpose |
|------|---------|
| `server.js` | Express application entry point. Loads adapters, sets up middleware (CORS, body parsing, signature sheets, OpenAPI validation), mounts all routes, starts HTTP/HTTPS/HTTP2 server. |
| `swagger.json` | Base OpenAPI 3.0 spec — component schemas, parameters, and security definitions. Merged with `@openapi` JSDoc at runtime by `swagger-jsdoc`. |

### `src/main/server/` — Core Modules

| File | Purpose |
|------|---------|
| `skyId.js` | Identity management — create, commit, and login endpoints for CaSS key-based identity (`/api/sky/id/*`). Manages `skyId.secret` admin key. |
| `skyRepo.js` | SkyRepo initialization — wires up all skyRepo sub-modules below. |
| `util.js` | Admin utilities — `reindex`, `purge`, `cull`, `cullFast` endpoints. Startup initialization (Elasticsearch index creation, adapter loading). |
| `websocket.js` | WebSocket support for real-time change notifications. |

### `src/main/server/skyRepo/` — Data Layer

| File | Purpose |
|------|---------|
| `ping.js` | `GET /api/ping` — server info, SSO state, admin keys, FIPS mode, banner/MOTD. |
| `admin.js` | `GET /api/sky/admin` — returns admin public keys and config. |
| `data.js` | `GET/POST /api/data/*` — CRUD routing for JSON-LD objects by type/uid/version. |
| `get.js` | Internal `skyrepoGet` — retrieves objects from Elasticsearch by ID/version. |
| `put.js` | Internal `skyrepoPut` — stores objects to Elasticsearch, handles versioning. |
| `delete.js` | Internal `skyrepoDelete` — deletes objects from Elasticsearch. |
| `search.js` | `GET/POST /api/sky/repo/search` — Elasticsearch query proxy with signature-sheet-based access control. |
| `searchUtil.js` | Search helpers — query sanitization, index hinting. |
| `multiget.js` | `POST /api/sky/repo/multiGet` — batch retrieval of objects by ID array. |
| `multiput.js` | `POST /api/sky/repo/multiPut` — batch storage of objects. |
| `multidelete.js` | `POST /api/sky/repo/multiDelete` — batch deletion of objects. |
| `history.js` | Object version history retrieval. |
| `kbac.js` | Key-Based Access Control — signature sheet validation, owner/reader permission checks. |
| `langs.js` | Language maps — large lookup table for ISO language codes. |
| `util.js` | SkyRepo utilities — Elasticsearch HTTP helpers, index management, backup/restore. |

### `src/main/server/cartridge/adapter/` — Protocol Adapters

Adapters are conditionally loaded via `global.disabledAdapters`.

| File | Purpose |
|------|---------|
| `asn.js` | ASN (Achievement Standards Network) import/export — `GET/POST /api/asn/*`. |
| `ceasn.js` | CE/ASN and CTDL-ASN framework import/export — `GET/POST /api/ceasn/*`, `/api/ctdlasn/*`. |
| `caseAdapter.js` | IMS CASE v1p0 read API — 11 endpoints under `/api/ims/case/v1p0/*` (CFDocuments, CFItems, CFAssociations, CFPackages, etc.). |
| `caseIngest.js` | CASE harvesting — `POST /api/ims/case/harvest` (bulk import) and `GET /api/ims/case/getDocs`. |
| `jsonLd.js` | JSON-LD context resolution — `POST /api/jsonld`. |
| `ollama.js` | Ollama AI integration — `POST /api/ollama/framework` for AI-assisted framework generation. |
| `openbadges.js` | Open Badges 2.0 — `GET /api/badge/pk`, `/api/badge/profile/*`, `/api/badge/class/*`, `/api/badge/assertion/*`. |
| `pna.js` | PNA (Portable Native Assertions) — `GET/POST /api/ce/pna/*`. Supports local FS or AWS S3 via `PNA_*` env vars. |
| `replicate.js` | Server-to-server replication of data. |
| `scd.js` | SCD (Service Component Documentation) — `GET /api/scd/*`. |
| `xapi.js` | xAPI (Experience API) — `POST /api/xapi/tick`, `GET /api/xapi/pk`, `POST /api/xapi/statement(s)`, `GET /api/xapi/endpoint`. Configurable via `XAPI_*` env vars. |

### `src/main/server/profile/` — Profile Calculation

| File | Purpose |
|------|---------|
| `controller.js` | `GET /api/profile/latest` — entry point for profile calculations. |
| `coordinator.js` | Orchestrates profile calculation across frameworks, manages caching. |
| `calculator.js` | Core assertion-to-competency calculation logic. |
| `worker.js` | Worker thread for parallel profile computation. |
| `util.js` | Profile utility functions — EcIdentity helpers, confidence thresholds. |

#### `src/main/server/profile/coprocessors/`

| File | Purpose |
|------|---------|
| `default.js` | Default coprocessor — processes assertions against competencies using alignment rules. |
| `conditions.js` | Conditional logic coprocessor — evaluates roll-up rules and framework conditions. |
| `direct.js` | Direct assertion coprocessor — handles assertions that directly reference competencies. |
| `explainer.js` | Explanation coprocessor — generates human-readable explanations for profile results. |
| `template.js` | Template coprocessor — provides a template for creating custom coprocessors. |
| `timeBounding.js` | Time-bounding coprocessor — filters assertions by date range. |

### `src/main/server/shims/` — Runtime Shims

| File | Purpose |
|------|---------|
| `auditLogger.js` | Structured audit logging with severity levels and log categories. Configurable output dir via `LOG_DIR`. |
| `auth.js` | Authentication middleware — OIDC/SSO integration, signature sheet processing, P1 JWT handling. |
| `cassproject.js` | Imports from the `cassproject` npm package — EcIdentity, EcPpk, EcPk, etc. |
| `ephemeral.js` | Application-wide event bus — `global.events` for server-ready, person-ping, etc. |
| `event.js` | Event emitter shim for the event bus. |
| `jobs.js` | Background job scheduler (cron-style). |
| `levr.js` | LEVR compatibility layer — `bindWebService`, `httpGet`, file operations, Elasticsearch helpers. |
| `mailer.js` | SMTP email sending via `nodemailer`. Configured by `SMTP_*` env vars. |
| `stjs.js` | Schema.org type shim — JSON-LD type utilities. |
| `util/sharedAdminCache.js` | Caches the admin public key list for quick lookups. |

### `src/main/webapp/` — Static Frontend

The built CaSS Editor web application (HTML/CSS/JS). Served at `/` by Express. Contains ~1170 files — the compiled SPA bundle, not documented individually here.

---

## `src/test/` — Test Files (dev only, not in container)

| File | Purpose |
|------|---------|
| `0.harness.test.js` | Test harness — starts the server and waits for readiness. |
| `1.skyRepo.test.js` | SkyRepo CRUD tests. |
| `1.skyrepo.admin.test.js` | Admin endpoint tests. |
| `2.EcRepository.*.test.js` | EcRepository integration tests at various security levels (l0, l1, l2) and SSO variants. |
| `3.swagger.test.js` | OpenAPI spec validity + endpoint status code compliance (57 endpoints). |
| `3.swagger.schema.test.js` | Response body schema validation against OpenAPI spec using Ajv. |
| `8.asn.test.js` | ASN adapter tests. |
| `8.case.test.js` | CASE adapter tests. |
| `8.ceasn.test.js` | CEASN adapter tests. |
| `9.restore.test.js` | Backup/restore test. |

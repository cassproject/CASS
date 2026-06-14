# CaSS — Competency and Skills System

# System Design

# Version 1.6.27

# Document CASS-SDD-2026-001

# Eduworks Corporation

Conforms to DI-IPSC-81435A.  
Copyright © 2015–2026 Eduworks Corporation and other contributing parties. Licensed under the Apache License, Version 2.0.

**AUTHORS**

| Name | Role | Department |
| ---- | ---- | ---------- |
| Ronald "Fritz" Ray | Lead Architect / Developer | Engineering |
| Mile Divovic | Developer | Engineering |
| Debbie Brown | Developer | Engineering |
| Elaine Kelsey | Developer | Engineering |
| Kari Glover | Developer | Engineering |
| Tyler Landowski | Developer | Engineering |

**DOCUMENT HISTORY**

| Date | Version | Document Revision Description | Document Author |
| :--: | :-----: | ----------------------------- | --------------- |
| 2026-06-13 | 1.0 | Initial comprehensive system design document, generated from codebase analysis (v1.6.27), cass-npm (v5.0.15), cass-editor, and docs.cassproject.org. | Auto-generated |

**APPROVALS**

| Approval Date | Approved Version | Approver Role | Approver |
| ------------- | ---------------- | ------------- | -------- |
| | | | |

**SUPPLEMENTAL DOCUMENTS**

| Supplement Date | Supplement Version | Document File Name / Link | Document Name |
| --------------- | ------------------ | ------------------------- | ------------- |
| | | [DI-IPSC-81433A Software Requirements Specification Template.md](DI-IPSC-81433A%20Software%20Requirements%20Specification%20Template.md) | Software Requirements Specification |
| | | [DI-IPSC-81435 System Design Template.md](DI-IPSC-81435%20System%20Design%20Template.md) | System Design Template (blank) |
| | | [CONFIGURATION.md](CONFIGURATION.md) | Configuration Guide |
| | | [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment Guide |
| | | [ENVIRONMENT.md](ENVIRONMENT.md) | Environment Variable Reference |
| | | [FILE.md](FILE.md) | File Structure Reference |

---

**Table of Contents**

- [1. Scope](#1-scope)
  - [1.1 Identification](#11-identification)
  - [1.2 System Overview](#12-system-overview)
  - [1.3 Document Overview](#13-document-overview)
- [2. Referenced Documents](#2-referenced-documents)
- [3. Design Decisions](#3-design-decisions)
  - [3.1 Inputs](#31-inputs)
  - [3.2 Outputs](#32-outputs)
  - [3.3 Stimulus / Response](#33-stimulus--response)
  - [3.4 Safety](#34-safety)
  - [3.5 Security](#35-security)
  - [3.6 Privacy](#36-privacy)
  - [3.7 System States](#37-system-states)
  - [3.8 Performance](#38-performance)
  - [3.9 Algorithms](#39-algorithms)
  - [3.10 Rules](#310-rules)
  - [3.11 Error Handling](#311-error-handling)
  - [3.12 Data Storage](#312-data-storage)
  - [3.13 Flexibility](#313-flexibility)
  - [3.14 Availability](#314-availability)
  - [3.15 Maintainability](#315-maintainability)
  - [3.16 Horizontal Scaling](#316-horizontal-scaling)
  - [3.17 Vertical Scaling](#317-vertical-scaling)
- [4. Architectural Design](#4-architectural-design)
  - [4.1 Components](#41-components)
  - [4.2 Platform Requirements](#42-platform-requirements)
  - [4.3 Concept of Execution](#43-concept-of-execution)
  - [4.4 Interface Design](#44-interface-design)
- [5. Detailed Design](#5-detailed-design)
  - [5.1 Server Core (server.js)](#51-server-core-serverjs)
  - [5.2 SkyRepo Data Layer](#52-skyrepo-data-layer)
  - [5.3 Profile Calculation Engine](#53-profile-calculation-engine)
  - [5.4 Runtime Shims](#54-runtime-shims)
  - [5.5 Protocol Adapters (Cartridges)](#55-protocol-adapters-cartridges)
  - [5.6 CaSS Library (cassproject npm)](#56-cass-library-cassproject-npm)
  - [5.7 CaSS Editor (cass-editor)](#57-cass-editor-cass-editor)
  - [5.8 MCP Server](#58-mcp-server)
- [6. Requirements Traceability](#6-requirements-traceability)
- [7. Notes](#7-notes)
- [8. Appendixes](#8-appendixes)

---

# 1. Scope

## 1.1 Identification

| Attribute | Value |
| --------- | ----- |
| **System Name** | Competency and Skills System (CaSS) |
| **Project-Unique Identifier** | `cass` |
| **Version / Release** | 1.6.27 |
| **Repository** | https://github.com/cassproject/CASS |
| **NPM Package** | `cassproject` v5.0.15 |
| **License** | Apache License 2.0 |
| **Organization** | Eduworks Corporation |
| **Sponsor** | Advanced Distributed Learning (ADL) Initiative, U.S. Department of Defense |

## 1.2 System Overview

CaSS is an open-source, federated infrastructure for the **definition, management, exchange, and computation** of competency data. It addresses the fundamental challenge of creating a shared, interoperable vocabulary for human capabilities—skills, knowledge, abilities, traits, and learning objectives—across organizational and system boundaries.

**Purpose.** CaSS enables organizations to:

1. **Author and manage** competency frameworks as machine-readable, linked open data.
2. **Record assertions** about individuals' attainment of competencies, with privacy-preserving encryption.
3. **Compute learner profiles** by aggregating assertions against framework structures.
4. **Exchange competency data** with external systems via standards-based protocol adapters (xAPI, CTDL-ASN, IMS CASE, ASN, Open Badges 2.0).
5. **Federate** data across multiple CaSS instances through server-to-server replication.

**History.** Developed since 2015 under ADL sponsorship, CaSS originated as a Java web application and was re-architected as a Node.js/Express application in the 1.5.x series. The system implements W3C Linked Data principles, using JSON-LD as its native data format with Schema.org and CTDL-compatible type vocabularies.

**Operating Sites.** CaSS is deployed across DoD training organizations, academic institutions, workforce development programs, and credentialing bodies. It can be operated on-premises, in private clouds, or in containerized environments (Docker, Kubernetes).

## 1.3 Document Overview

This System Design Document (SDD) describes the complete architectural and detailed design of CaSS version 1.6.27. It covers system-wide design decisions (Section 3), architectural design including component decomposition and interface design (Section 4), detailed design of each software unit (Section 5), and requirements traceability (Section 6). Section 7 provides a glossary, acronyms, and supplementary notes. Appendixes provide reference tables for environment variables and data schemas.

---

# 2. Referenced Documents

| Document Name / Link | Version | Comment |
| :--- | :--- | :--- |
| [MIL-STD-498](https://quicksearch.dla.mil/) | 1994 (canceled 1998) | Military Standard for Software Development and Documentation; basis for DI-IPSC-81435A |
| [DI-IPSC-81435A](https://quicksearch.dla.mil/) | A | Data Item Description — System/Subsystem Design Description |
| [DI-IPSC-81433A](https://quicksearch.dla.mil/) | A | Data Item Description — Software Requirements Specification |
| [RFC 8259 — JSON](https://www.rfc-editor.org/rfc/rfc8259) | 2017 | The JavaScript Object Notation Data Interchange Format |
| [W3C JSON-LD 1.1](https://www.w3.org/TR/json-ld11/) | 2020 | JSON-based Linked Data serialization |
| [Schema.org](https://schema.org/) | Current | Shared vocabulary for structured data on the web |
| [CTDL — Credential Transparency Description Language](https://credreg.net/ctdl/terms) | Current | Credential Engine vocabulary for competencies and credentials |
| [IMS CASE v1.0](https://www.imsglobal.org/activity/case) | 1.0 | Competency and Academic Standards Exchange |
| [xAPI (Experience API) 1.0.3](https://github.com/adlnet/xAPI-Spec) | 1.0.3 | Tin Can API for learning activity statements |
| [Open Badges 2.0](https://www.imsglobal.org/sites/default/files/Badges/OBv2p0Final/index.html) | 2.0 | Open standard for digital credentials |
| [OpenAPI Specification 3.0](https://spec.openapis.org/oas/v3.0.3) | 3.0.3 | REST API description standard |
| [FIPS 140-3](https://csrc.nist.gov/publications/detail/fips/140/3/final) | 2019 | Security Requirements for Cryptographic Modules |
| [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519) | 2015 | JWT specification |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | 2014 | OIDC specification |
| [W3C SKOS](https://www.w3.org/TR/skos-reference/) | 2009 | Simple Knowledge Organization System |
| [Model Context Protocol](https://modelcontextprotocol.io/) | Current | Protocol for AI model–tool integration |
| [CASS README.md](README.md) | 1.6.27 | Installation and getting started |
| [CASS CONFIGURATION.md](CONFIGURATION.md) | 1.6.27 | Server configuration guide |
| [CASS DEPLOYMENT.md](DEPLOYMENT.md) | 1.6.27 | Local, Docker, Kubernetes deployment |
| [CASS ENVIRONMENT.md](ENVIRONMENT.md) | 1.6.27 | All 80+ environment variables |
| [CASS FILE.md](FILE.md) | 1.6.27 | Project file structure reference |
| [CASS CHANGELOG.md](CHANGELOG.md) | 1.6.27 | Release history |
| [OpenAPI Spec (swagger.json)](src/main/swagger.json) | 1.6.27 | Machine-readable API specification |

---

# 3. Design Decisions

This section documents system-wide design decisions that influence the architecture and implementation of all CaSS components.

## 3.1 Inputs

1. **HTTP/HTTPS REST Requests.** All client-server interaction uses HTTP(S) REST. Request bodies are JSON or JSON-LD. Multipart form data is accepted for file upload (import) operations via `busboy`.
2. **Signature Sheets.** Every authenticated request includes a cryptographic signature sheet—an array of time-limited, RSA-signed tokens proving the caller's identity. These are passed as a `signatureSheet` field in request headers or body.
3. **JSON-LD Objects.** Data creation and update operations accept JSON-LD documents conforming to Schema.org / CTDL vocabularies with mandatory `@context`, `@id`, and `@type` fields, and optional `@owner`, `@reader`, `@signature`, and `@signatureSha256` security fields.
4. **Elasticsearch Query Strings.** Search operations accept Elasticsearch Simple Query String syntax via the `q` parameter, with pagination (`start`, `size`), sorting (`sort`), and index hinting (`index_hint`).
5. **Standards-Format Data.** Import adapters accept data in ASN XML, CTDL-ASN JSON-LD, IMS CASE JSON, CSV, MedBiquitous XML, and tab-structured text formats.
6. **WebSocket Connections.** Clients may establish persistent WebSocket connections at `/ws/custom` to receive real-time change notifications.
7. **xAPI Statements.** The xAPI adapter ingests Experience API statements from configured Learning Record Stores.
8. **Environment Variables.** Over 80 environment variables configure server behavior, authentication, TLS, adapters, and UI. See [ENVIRONMENT.md](ENVIRONMENT.md).

## 3.2 Outputs

1. **JSON-LD Responses.** All data retrieval operations return JSON-LD objects or arrays of JSON-LD objects, with KBAC-enforced access control applied before delivery.
2. **Standards-Format Exports.** Export adapters produce data in CTDL-ASN JSON-LD, IMS CASE JSON, ASN XML/JSON, Open Badges 2.0 JSON, and CSV formats.
3. **Computed Profiles.** The profile engine returns competency attainment profiles as structured JSON, computing mastery status from aggregated assertions.
4. **WebSocket Notifications.** Real-time `@id` broadcasts of saved objects to all connected WebSocket clients.
5. **OpenAPI Specification.** A live, validated OpenAPI 3.0 specification is served at `GET /api/swagger.json` and rendered interactively at `/api/swagger`.
6. **Health/Ping Responses.** `GET /api/ping` returns server version, SSO state, FIPS mode, banner/MOTD configuration, and server readiness.
7. **Audit Logs.** Structured audit log entries with severity, category, and message content, written to stdout (and optionally to file in production mode).
8. **Email Notifications.** SMTP-based alerts for uncaught exceptions, disk space warnings, and other critical events.

## 3.3 Stimulus / Response

1. **Data CRUD.** `GET /api/data/{type}/{uid}` retrieves an object; `POST /api/data/{type}/{uid}` creates or updates it. The server validates the signature sheet, checks KBAC permissions, and stores/retrieves from Elasticsearch. Versioned access is available via `GET /api/data/{type}/{uid}/{version}`.
2. **Search.** `GET/POST /api/sky/repo/search?q=...` queries Elasticsearch with sanitized query strings. Results are filtered by KBAC access control before return.
3. **Batch Operations.** `POST /api/sky/repo/multiGet`, `multiPut`, `multiDelete` accept arrays of identifiers or objects for bulk processing.
4. **Identity Management.** `POST /api/sky/id/create` generates a key pair; `POST /api/sky/id/commit` persists identity changes; `POST /api/sky/id/login` retrieves stored identities.
5. **Profile Calculation.** `GET /api/profile/latest?frameworkId=...&subject=...` triggers a worker-thread-based profile computation. The coordinator checks the cache first; on a miss, it delegates to coprocessor pipeline workers.
6. **Standards Adapter Operations.** Each adapter responds to its own URL namespace (e.g., `/api/ceasn/*`, `/api/ims/case/v1p0/*`) with import, export, or format-translation semantics.
7. **WebSocket.** On `database.afterSave` events, the WebSocket module broadcasts the saved object's `@id` to all connected clients.
8. **Server Lifecycle.** The startup sequence emits `database.connected` → `server.listening` → `server.ready` events via the RxJS event bus, triggering adapter loading and periodic maintenance tasks.

## 3.4 Safety

1. **Graceful Failure.** Uncaught exceptions trigger an email alert (if SMTP is configured), log a `SEVERITY.EMERGENCY` audit entry, flush logs, and terminate the process with `process.exit(1)`. Container orchestrators (Docker, Kubernetes) restart the process automatically.
2. **Data Integrity.** All stored objects are cryptographically signed by their owner. The server validates `@signature` and `@signatureSha256` fields before accepting modifications from non-server actors.
3. **Fetch Allow-List.** Outgoing HTTP requests from the server can be restricted to an explicit allow-list (`FETCH_ALLOW_LIST` env var), preventing server-side request forgery (SSRF).
4. **Disk Space Monitoring.** A background job monitors disk space and sends email warnings when available space falls below threshold.

## 3.5 Security

CaSS implements a multi-layered security model:

### 3.5.1 Key-Based Access Control (KBAC)

KBAC is the foundational authorization mechanism unique to CaSS:

- Every actor (user, system, application) is identified by an **RSA public/private key pair**.
- **Signature Sheets** are time-limited, cryptographically signed tokens that prove key ownership. They are generated client-side and attached to each request.
- The server validates signature sheets in `kbac.js`, checking signature validity, timestamp freshness, and expiry.
- Objects with no `@owner` field are **public** (anyone can read and modify).
- Objects with `@owner` field restrict **write access** to listed public key holders; read access remains public.
- Objects with `@reader` field restrict **read access** to listed public key holders; data is encrypted at rest.
- SHA-256 signatures are preferred; SHA-1 is supported for backward compatibility but can be rejected via `REJECT_SHA1`.

### 3.5.2 Authentication Modes

CaSS supports four mutually exclusive authentication modes (only one active at a time):

| Mode | Implementation | Use Case |
| ---- | -------------- | -------- |
| **Key-Based (Default)** | Built-in PKI identity via `skyId.js` | Standalone deployments, no external IdP |
| **OIDC/SSO** | `express-openid-connect` (Keycloak, etc.) | Enterprise SSO integration |
| **JWT Bearer Token** | `express-jwt` | API-to-API authentication |
| **Platform One (P1)** | Custom JWT middleware with adjective/noun claims | DoD Platform One environments |

### 3.5.3 Transport Security

- **TLS/HTTPS** with HTTP/2 support (HTTP/1.1 fallback available via `HTTP2_SERVER=false`).
- **Client certificate authentication (mTLS)** via `REQUEST_CLIENT_SIDE_CERTIFICATE`.
- **Certificate Revocation List (CRL)** checking via `CRL_LISTS=true`.
- **FIPS 140-3 compliance** with OpenSSL 3.1.2 compiled into Docker images.

### 3.5.4 Additional Security Controls

- **IP Allow-listing** (`CASS_IP_ALLOW`) with configurable denied-redirect.
- **Security Headers**: HSTS, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff).
- **CORS** configuration with optional credential support.
- **Rate Limiting** via `express-rate-limit`.
- **Fetch Allow-List** to restrict outgoing HTTP calls.
- **Environment-based Admin Grants** (`AUTH_ENV_ADMIN_EMAILS`).

## 3.6 Privacy

1. **Encrypted Assertions.** Assertions about individuals' competency attainment are encrypted using `EcEncryptedValue`. The `subject` and `agent` fields of assertions are individually encrypted with the reader's public key, ensuring that only authorized parties can determine whom an assertion is about.
2. **Reader-Based Encryption.** Any JSON-LD object can be encrypted for specific readers by populating the `@reader` array with public keys. The object is encrypted at rest in Elasticsearch; only holders of corresponding private keys can decrypt it.
3. **No PII in Clear Text.** When the `@reader` field is set, all sensitive fields are encrypted before storage. The server cannot read encrypted data without the appropriate private key.
4. **P1 User Anonymization.** The Platform One authentication mode supports an `ANONYMIZE_USERS` option that obscures user identity in authentication flows.

## 3.7 System States

CaSS transitions through the following states during its lifecycle:

```
┌─────────┐    ┌────────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────┐
│ Starting │───▶│ DB Connecting  │───▶│ Server       │───▶│ Adapters     │───▶│ Ready │
│          │    │                │    │ Listening     │    │ Loading      │    │       │
└─────────┘    └────────────────┘    └──────────────┘    └──────────────┘    └───────┘
                                                                                 │
                                                                                 ▼
                                                                          ┌─────────────┐
                                                                          │  Operating   │
                                                                          │ (periodic    │
                                                                          │  60s ticks)  │
                                                                          └─────────────┘
```

| State | RxJS Event | Description |
| ----- | ---------- | ----------- |
| **Starting** | `server.init` | Express app created, middleware loaded, shims initialized |
| **DB Connecting** | `database.connected` | Elasticsearch connection established, indices verified |
| **Server Listening** | `server.listening` | HTTP/HTTPS/HTTP2 server bound to port, accepting connections |
| **Adapters Loading** | — | Protocol adapters dynamically loaded via glob from `cartridge/adapter/` |
| **Ready** | `server.ready` | All adapters loaded, system fully operational |
| **Operating** | `server.periodic` / `database.periodic` (60s) | Steady-state; periodic maintenance tasks (ephemeral cleanup, disk checks) |
| **Error/Shutdown** | — | Uncaught exception triggers alert, log flush, and `process.exit(1)` |

**Degraded Modes:**

- If Elasticsearch is unreachable, the server will not emit `database.connected` and will not start listening.
- Individual adapters can be disabled at runtime via `DISABLED_ADAPTERS` without affecting core functionality.
- The CaSS editor can be disabled via `DISABLED_EDITOR=true`, leaving the API fully functional.

## 3.8 Performance

1. **Response Compression.** All HTTP responses are compressed via the `compression` middleware.
2. **Static Asset Caching.** The CaSS editor's static files are served with a 24-hour `maxAge` cache header.
3. **Elasticsearch Proxied Search.** Search queries are passed directly to Elasticsearch with query sanitization, leveraging ES's native indexing and full-text search capabilities. Maximum result size is capped at 10,000.
4. **Worker Thread Pool.** Profile calculations are offloaded to a worker thread pool (`node-worker-threads-pool`), preventing CPU-intensive computation from blocking the event loop. Each worker's memory is configurable via `WORKER_MAX_MEMORY` (default 1024 MB).
5. **Profile Caching.** Computed profiles can be cached in-memory or in the repository with configurable TTL (`PROFILE_TTL`, default 30 days).
6. **Batch Operations.** `multiGet`, `multiPut`, and `multiDelete` endpoints reduce HTTP round-trips. `MULTIPUT_BATCH_SIZE` (default 100) controls per-batch throughput.
7. **Ephemeral Store.** TTL-based temporary data uses a dedicated Elasticsearch index with periodic cleanup via `_delete_by_query`, avoiding accumulation of stale data.
8. **HTTP/2 (SPDY).** When HTTPS is enabled, HTTP/2 is the default transport, enabling multiplexed streams and header compression.

## 3.9 Algorithms

1. **Profile Calculation Pipeline.** The profile engine uses a pluggable coprocessor architecture:
   - `default.js` — Matches assertions to competencies via alignment rules.
   - `direct.js` — Processes direct competency assertions without alignment.
   - `conditions.js` — Evaluates roll-up rules and framework conditions (graph traversal).
   - `timeBounding.js` — Filters assertions by date range and temporal validity.
   - `explainer.js` — Generates human-readable explanations of computation results.
   - `template.js` — Extensibility template for custom coprocessors.
2. **KBAC Signature Validation.** RSA signature verification using SHA-256 (preferred) or SHA-1, with timestamp freshness checking and configurable expiry windows.
3. **Object Encryption.** AES-256 symmetric encryption for object payloads, with AES keys encrypted per-reader using RSA-OAEP. Implemented via `node-forge`.
4. **Graph Traversal.** Framework competency relationships form directed graphs. The profile engine traverses these graphs to evaluate roll-up rules and dependency chains using `EcDirectedGraph` and `Hypergraph` structures.
5. **Query Sanitization.** Search queries are sanitized to prevent Elasticsearch injection, with special character escaping and index hint validation.

## 3.10 Rules

1. **JSON-LD Compliance.** All stored objects must be valid JSON-LD with `@context`, `@id`, and `@type` fields. The `@id` field serves as the globally unique, persistent URL identifier.
2. **Type Namespace Convention.** Object types follow dotted namespace conventions: `schema.cassproject.org.0.4.Framework`, `schema.cassproject.org.0.4.Competency`, etc. Elasticsearch indices are named by lowercased type namespaces.
3. **Versioning.** CaSS-created objects use timestamps as version numbers. Externally imported objects increment from 1. All versions are stored in the `permanent` index; the current version is stored in the type-specific index.
4. **Ownership Immutability.** Once an object's `@owner` field is set, only the owner(s) can modify or delete the object. Non-owners receive 401/403 errors.
5. **Server Identity.** The server maintains its own RSA key pair (`etc/skyId.pem`) and acts as an identity for server-side operations (adapter imports, replication, profile computation).
6. **Adapter Registration.** Protocol adapters are loaded dynamically via filesystem glob (`cartridge/adapter/*.js`). Each adapter self-registers its routes using the `bindWebService` LEVR compatibility function.

## 3.11 Error Handling

1. **HTTP Status Codes.** Standard HTTP status codes are returned: 200 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (internal server error).
2. **Uncaught Exception Handler.** `process.on('uncaughtException')` catches all unhandled errors, sends an email alert, logs at `EMERGENCY` severity, and terminates the process.
3. **Audit Logging.** All errors are logged via the structured audit logger with categories (`SYSTEM`, `NETWORK`, `AUTH`, `DATA`, `ADAPTER`) and severities (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `EMERGENCY`).
4. **Filterable Logging.** Log output can be filtered by category, severity, or message substring via `LOG_FILTERED_CATEGORIES`, `LOG_FILTERED_SEVERITIES`, and `LOG_FILTERED_MESSAGES` environment variables.
5. **OpenAPI Validation.** The server generates and validates its OpenAPI specification at startup. If the specification is invalid, the server fails hard (refuses to start), preventing deployment of API-incompatible builds.

## 3.12 Data Storage

1. **Primary Datastore: Elasticsearch 9.x (or OpenSearch).** All data is stored as JSON-LD documents in Elasticsearch indices. There is no SQL database and no ORM—direct HTTP calls to Elasticsearch's REST API via helper functions (`httpGet`, `httpPost`, `httpPut`, `httpDelete`).
2. **Index-per-Type.** Each JSON-LD type maps to a dedicated Elasticsearch index (e.g., `schema.cassproject.org.0.4.framework`, `schema.cassproject.org.0.4.competency`).
3. **Version History.** All object versions are stored in a `permanent` index with external version typing. The current version is also stored in the type-specific index for fast retrieval.
4. **Ephemeral Index.** TTL-based temporary data (signature sheet caches, transient computation state) is stored in an `ephemeral` index with mappings disabled. Periodic cleanup purges expired entries.
5. **Cryptographic Material.** Server keys, salts, and adapter-specific signing keys are persisted in the `etc/` directory on the local filesystem. Loss of this directory means loss of all server identity and the ability to modify owned objects.
6. **Secondary Storage: AWS S3.** The PNA (Portable Native Assertions) adapter supports reading/writing assertion data to AWS S3 buckets as an alternative to local filesystem storage.

## 3.13 Flexibility

1. **Pluggable Adapter Architecture.** New protocol adapters can be added by placing a JavaScript file in `src/main/server/cartridge/adapter/`. Adapters are dynamically discovered and loaded at startup. Adapters can be selectively disabled via `DISABLED_ADAPTERS`.
2. **Pluggable Coprocessors.** The profile calculation engine accepts custom coprocessors following the template in `coprocessors/template.js`.
3. **Multiple Authentication Modes.** The system supports four authentication backends (Key-Based, OIDC, JWT, P1) selectable via environment variables without code changes.
4. **Configurable via Environment.** Over 80 environment variables allow extensive customization without modifying code. See [ENVIRONMENT.md](ENVIRONMENT.md).
5. **Embeddable Editor.** The CaSS editor is designed to be embedded in third-party applications via `<iframe>`, with CSS inheritance and URL-parameter-based configuration.
6. **Multi-Backend Support.** Elasticsearch 9.x and OpenSearch are both supported as storage backends via separate Docker Compose configurations.
7. **MCP Integration.** The server auto-generates Model Context Protocol (MCP) tool definitions from its OpenAPI specification, enabling AI agent integration without manual tool authoring.

## 3.14 Availability

1. **Stateless Server.** The CaSS server is largely stateless—all persistent state lives in Elasticsearch and the `etc/` volume. Multiple server instances can run behind a load balancer.
2. **Health Checks.** `GET /api/ping` provides a lightweight health check endpoint used by Kubernetes readiness/liveness probes and Docker health checks.
3. **Container Restart Policy.** Docker Compose configurations use `restart: always`, and Kubernetes deployments use readiness/liveness probes with automatic pod restart.
4. **Elasticsearch Resilience.** Elasticsearch can be deployed as a multi-node cluster (recommended for production) with data replication for fault tolerance. The ECK (Elastic Cloud on Kubernetes) operator is recommended for production K8s deployments.
5. **Federation/Replication.** Server-to-server replication enables data distribution across multiple CaSS instances, supporting geographic redundancy and federated operation.

## 3.15 Maintainability

1. **Structured Module Organization.** Code is organized by functional concern: `skyRepo/` (data layer), `profile/` (computation), `shims/` (runtime infrastructure), `cartridge/adapter/` (protocol adapters).
2. **OpenAPI-First API Documentation.** API documentation is auto-generated from JSDoc annotations via `swagger-jsdoc` and validated at startup, ensuring documentation stays synchronized with code.
3. **Comprehensive Test Suite.** 19 test files covering CRUD, security levels (L0/L1/L2), SSO variants, profile calculation, adapter compliance, OpenAPI response validation, MCP tools, and backup/restore. Tests use Mocha + Chai + Sinon with NYC coverage.
4. **CI/CD Automation.** GitHub Actions workflows for build/test, Docker publish, release automation, security scanning, and dependency review.
5. **Admin Utilities.** Built-in admin endpoints for `reindex`, `purge`, and `cull` operations, protected by admin secret key.
6. **Audit Logging.** Structured, filterable audit logging for operational observability.

## 3.16 Horizontal Scaling

1. **Shared-Nothing Server Architecture.** CaSS server instances share no in-process state. All state is in Elasticsearch and the shared `etc/` volume. Multiple replicas can serve traffic behind a load balancer.
2. **Kubernetes Deployment.** CaSS scales horizontally via Kubernetes Deployment replicas. The `etc/` volume must be a ReadWriteMany (RWX) persistent volume when running multiple replicas.
3. **Elasticsearch Clustering.** Elasticsearch supports horizontal scaling via sharding and replication. Production deployments should use multi-node clusters.
4. **WebSocket Considerations.** WebSocket connections are per-server-instance. Clients connected to different instances receive notifications only for operations processed by their connected instance.

## 3.17 Vertical Scaling

1. **Worker Thread Memory.** Profile calculation worker thread memory is configurable via `WORKER_MAX_MEMORY` (default 1024 MB).
2. **V8 Heap.** The Node.js process heap can be tuned via `--max-old-space-size` (development scripts default to 512 MB).
3. **Elasticsearch JVM Heap.** Elasticsearch memory is tuned via its own `ES_JAVA_OPTS` (e.g., `-Xms512m -Xmx512m` in Docker Compose configurations).
4. **Connection Limits.** `MAX_CONNECTIONS` limits the number of simultaneous connections the server will accept.
5. **Request Body Size.** `POST_MAX_SIZE` controls maximum request body size for upload-heavy operations.

---

# 4. Architectural Design

## 4.1 Components

CaSS is composed of four major subsystems, with supporting infrastructure:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         External Clients                                │
│  (Browsers, LMS, LRS, Credential Engines, AI Agents, Partner Systems)  │
└────────────────────┬───────────────┬────────────────────────────────────┘
                     │ HTTPS/WS      │ MCP
                     ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CaSS Server (Node.js / Express 5)                │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  CaSS Editor │  │  REST API    │  │  Protocol    │  │   MCP      │  │
│  │  (Static SPA)│  │  (SkyRepo)   │  │  Adapters    │  │   Server   │  │
│  │  Vue.js 2    │  │  CRUD/Search │  │  xAPI, CASE  │  │  (AI Tools)│  │
│  │              │  │  KBAC Auth   │  │  CTDL-ASN    │  │            │  │
│  └──────────────┘  │  Identity    │  │  ASN, Badges │  └────────────┘  │
│                    │  Batch Ops   │  │  PNA, SCD    │                   │
│                    └──────┬───────┘  │  Ollama, MCP │                   │
│                           │          │  Replication  │                   │
│  ┌──────────────┐         │          └──────┬───────┘                   │
│  │   Profile    │◄────────┤                 │                           │
│  │   Engine     │         │                 │                           │
│  │  (Workers)   │         │                 │                           │
│  └──────────────┘         │                 │                           │
│                           ▼                 ▼                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Runtime Shims Layer                             │  │
│  │   auth.js │ event.js │ levr.js │ cassproject.js │ auditLogger.js  │  │
│  │   mailer.js │ jobs.js │ ephemeral.js │ http2compat.js │ stjs.js   │  │
│  └───────────────────────────────────────────────┬───────────────────┘  │
│                                                   │                     │
└───────────────────────────────────────────────────┼─────────────────────┘
                                                    │ HTTP
                                                    ▼
                                     ┌──────────────────────────┐
                                     │   Elasticsearch 9.x      │
                                     │   (or OpenSearch)         │
                                     │                          │
                                     │  ┌────────────────────┐  │
                                     │  │ Type-specific       │  │
                                     │  │ indices             │  │
                                     │  │ (framework,         │  │
                                     │  │  competency, ...)   │  │
                                     │  ├────────────────────┤  │
                                     │  │ permanent (history) │  │
                                     │  ├────────────────────┤  │
                                     │  │ ephemeral (TTL)     │  │
                                     │  └────────────────────┘  │
                                     └──────────────────────────┘
```

### Component Inventory

1. **CaSS Server (cass)**
   - **Version:** 1.6.27
   - **Purpose:** Core application server providing REST API, data storage, authentication, profile computation, and protocol adaptation.
   - **Description:** A Node.js application built on Express 5, serving as the central hub for all CaSS operations. It manages JSON-LD objects in Elasticsearch, enforces KBAC security, and hosts the CaSS editor.
   - **Relations:** Depends on Elasticsearch for data storage; depends on `cassproject` npm for data model classes; hosts `cass-editor` as static files.
   - **Development Status:** Existing, actively maintained.
   - **Documentation:** [README.md](README.md), [CONFIGURATION.md](CONFIGURATION.md), [DEPLOYMENT.md](DEPLOYMENT.md)
   - **Source:** [src/main/server.js](src/main/server.js)

2. **CaSS Library (cassproject npm)**
   - **Version:** 5.0.15
   - **Purpose:** JavaScript/Node.js SDK providing typed data model classes, CRUD operations, cryptographic identity management, and import/export utilities.
   - **Description:** Published as the `cassproject` npm package. Provides the interoperability layer between client applications and the CaSS repository. All classes are registered as global properties on `require()`. Used both server-side (by the CaSS server itself) and client-side (by the CaSS editor and third-party integrations).
   - **Relations:** Used by CaSS Server (runtime dependency); used by CaSS Editor (bundled into client).
   - **Development Status:** Existing, actively maintained.
   - **Documentation:** [npm](https://www.npmjs.com/package/cassproject), [GitHub](https://github.com/cassproject/cass-npm)
   - **Source:** `node_modules/cassproject/`

3. **CaSS Editor (cass-editor)**
   - **Version:** Included as git submodule at `src/main/webapp/`
   - **Purpose:** Web-based single-page application for authoring, managing, and browsing competency frameworks.
   - **Description:** A Vue.js 2 SPA with code-splitting per route. Provides UI for framework authoring, crosswalk alignment, import/export, concept/taxonomy management, user/group permissions, plugin management, and configuration editing. Communicates with the server via the `cassproject` SDK.
   - **Relations:** Served as static files by CaSS Server; depends on `cassproject` npm (bundled); communicates with CaSS REST API.
   - **Development Status:** Existing, actively maintained.
   - **Documentation:** [GitHub](https://github.com/cassproject/cass-editor)
   - **Source:** `src/main/webapp/` (pre-built output); source in separate repository.

4. **Elasticsearch / OpenSearch**
   - **Version:** Elasticsearch 9.4.2 (or OpenSearch 2.x)
   - **Purpose:** Primary persistent data store and full-text search engine.
   - **Description:** Stores all JSON-LD objects in type-specific indices, version history in a `permanent` index, and temporary data in an `ephemeral` index. CaSS communicates with Elasticsearch via its HTTP REST API.
   - **Relations:** Used by CaSS Server for all data operations.
   - **Development Status:** Off-the-shelf.
   - **Documentation:** [Elasticsearch Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

5. **Keycloak (optional)**
   - **Version:** 24.x (as configured in `docker-compose-oidc.yml`)
   - **Purpose:** OpenID Connect Identity Provider for SSO authentication.
   - **Description:** When OIDC is enabled, Keycloak handles user authentication and issues tokens that CaSS validates. A Keycloak initialization script is provided in `keycloak/`.
   - **Relations:** Used by CaSS Server `auth.js` shim when `CASS_OIDC_ENABLED=true`.
   - **Development Status:** Off-the-shelf.

## 4.2 Platform Requirements

### Minimum Server Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| **Runtime** | Node.js 24+ | Node.js 24 LTS |
| **CPU** | 2 cores | 4+ cores |
| **Memory** | 2 GB (1 GB Node.js + 1 GB Elasticsearch) | 8+ GB (4 GB Node.js + 4 GB Elasticsearch) |
| **Disk** | 10 GB | 50+ GB (depends on data volume) |
| **Network** | Standard TCP (ports 80, 443, 9200) | Low-latency connection between CaSS and Elasticsearch |
| **OS** | Any OS supporting Node.js 24 and Docker | Linux (Debian Bookworm, Alpine) |
| **Container Runtime** | Docker 20+ / Kubernetes 1.28+ | Docker 27+ / Kubernetes 1.30+ |
| **Search Engine** | Elasticsearch 8.x or OpenSearch 2.x | Elasticsearch 9.4.2 |

### Minimum Client Requirements (CaSS Editor)

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| **Browser** | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ | Latest Chrome, Firefox, or Edge |
| **JavaScript** | ES2020 support required | — |
| **Network** | HTTP(S) connectivity to CaSS server | — |
| **Screen** | 1024×768 | 1920×1080 |

## 4.3 Concept of Execution

### Server Startup Sequence

```
1. Load audit logger
2. Create Express app with compression, CORS
3. Initialize shims (in order):
   event.js → ephemeral.js → jobs.js → mailer.js →
   auth.js → levr.js → stjs.js → cassproject.js
4. Load core modules:
   util.js → skyRepo.js → skyId.js
5. Serve static editor webapp (unless DISABLED_EDITOR=true)
6. Generate & validate OpenAPI specification (fail hard if invalid)
7. Mount Swagger UI at /api/swagger
8. Set security headers per environment configuration
9. AWAIT: database.connected event
   → Start HTTP/HTTPS/HTTP2 server on configured port
10. AWAIT: server.listening event
    → Dynamically load cartridge adapters via glob
11. EMIT: server.ready
    → System fully operational
12. PERIODIC (60s): server.periodic, database.periodic
    → Ephemeral cleanup, disk space checks
```

### Request Processing Flow

```
Client Request
      │
      ▼
┌─────────────────┐
│ Express Middleware│
│ (compression,    │
│  CORS, headers)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auth Middleware   │
│ (OIDC/JWT/P1/    │
│  Signature Sheet) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌────────────────────┐
│ Route Handler    │────▶│ KBAC Validation    │
│ (data, search,   │     │ (owner/reader      │
│  adapter, etc.)  │     │  permission check)  │
└────────┬────────┘     └────────────────────┘
         │
         ▼
┌─────────────────┐
│ Elasticsearch    │
│ (get/put/search/ │
│  delete)          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response         │
│ (JSON-LD +       │
│  compression)    │
└─────────────────┘
```

### Event Bus (RxJS Subjects)

The application-wide event bus (`global.events`) provides reactive, decoupled communication:

| Subject | Events | Subscribers |
| ------- | ------ | ----------- |
| `events.server` | `init`, `listening`, `ready`, `periodic` (60s) | All modules |
| `events.database` | `connected`, `periodic` (60s), `afterSave` | Data layer, WebSocket, adapters |
| `events.person` | `doPing`, `arrived`, `assertionAbout` | Profile engine, identity modules |
| `events.data` | `read`, `write`, `delete`, `found`, `any` | Adapters, WebSocket, logging |

## 4.4 Interface Design

### 4.4.1 Interface Identification and Diagrams

```
┌──────────┐  REST/WS    ┌───────────┐  HTTP     ┌──────────────┐
│ CaSS     │◄───────────▶│ CaSS      │◄─────────▶│ Elasticsearch│
│ Editor   │  (IF-01)    │ Server    │  (IF-02)  │              │
└──────────┘             │           │           └──────────────┘
                          │           │
┌──────────┐  OIDC       │           │  SMTP     ┌──────────────┐
│ Keycloak │◄───────────▶│           │──────────▶│ Mail Server  │
│ (IdP)    │  (IF-03)    │           │  (IF-06)  │              │
└──────────┘             │           │           └──────────────┘
                          │           │
┌──────────┐  xAPI       │           │  S3 API   ┌──────────────┐
│ LRS      │◄───────────▶│           │──────────▶│ AWS S3       │
│          │  (IF-04)    │           │  (IF-07)  │              │
└──────────┘             │           │           └──────────────┘
                          │           │
┌──────────┐  REST       │           │  REST     ┌──────────────┐
│ Partner  │◄───────────▶│           │◄─────────▶│ Peer CaSS    │
│ Systems  │  (IF-05)    │           │  (IF-08)  │ (Replication)│
└──────────┘             │           │           └──────────────┘
                          │           │
┌──────────┐  MCP        │           │
│ AI Agent │◄───────────▶│           │
│          │  (IF-09)    │           │
└──────────┘             └───────────┘
```

| Interface ID | Name | Interfacing Entities | Status |
| ------------ | ---- | -------------------- | ------ |
| IF-01 | Editor–Server API | CaSS Editor ↔ CaSS Server | Both developing |
| IF-02 | Server–Elasticsearch | CaSS Server ↔ Elasticsearch | Elasticsearch fixed; CaSS adapts |
| IF-03 | Server–OIDC IdP | CaSS Server ↔ Keycloak/OIDC Provider | OIDC standard fixed; CaSS adapts |
| IF-04 | Server–LRS (xAPI) | CaSS Server ↔ Learning Record Store | xAPI spec fixed; CaSS adapts |
| IF-05 | Server–External (Standards) | CaSS Server ↔ Partner Systems | Standards fixed (CASE, CTDL-ASN, etc.) |
| IF-06 | Server–SMTP | CaSS Server → Mail Server | SMTP fixed; CaSS adapts |
| IF-07 | Server–S3 | CaSS Server ↔ AWS S3 | S3 API fixed; CaSS adapts |
| IF-08 | Server–Server (Replication) | CaSS Server ↔ Peer CaSS Server | CaSS protocol; both sides developing |
| IF-09 | Server–MCP (AI) | CaSS Server ↔ AI Agent | MCP standard fixed; CaSS adapts |

### 4.4.2 IF-01: Editor–Server API

**Type:** Real-time data transfer via HTTPS REST and WebSocket.

**Communication Protocol:**
- **Transport:** HTTPS (HTTP/2 preferred, HTTP/1.1 fallback)
- **Data Format:** JSON-LD (application/json, application/ld+json)
- **Authentication:** Signature sheets (KBAC), OIDC sessions, JWT bearer tokens
- **Real-time:** WebSocket at `/ws/custom` for change notifications

**Key Data Elements:**

| Element | Type | Format | Description |
| ------- | ---- | ------ | ----------- |
| `@id` | string (URI) | `https://{host}/api/data/{type}/{uid}/{version}` | Globally unique persistent identifier |
| `@type` | string | Dotted namespace (e.g., `schema.cassproject.org.0.4.Framework`) | JSON-LD type |
| `@context` | string (URI) | `https://schema.cassproject.org/0.4/` | JSON-LD context |
| `@owner` | string[] | PEM-encoded RSA public keys | Write-access holders |
| `@reader` | string[] | PEM-encoded RSA public keys | Read-access holders (data encrypted) |
| `@signature` | string | Base64-encoded RSA signature | SHA-1 integrity signature |
| `@signatureSha256` | string | Base64-encoded RSA signature | SHA-256 integrity signature |
| `signatureSheet` | string[] | Array of signed tokens | Authentication tokens per request |

**Endpoints (Core):**

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `GET` | `/api/ping` | Health check, version, SSO state |
| `GET/POST` | `/api/data/{type}/{uid}` | Object CRUD |
| `GET/POST` | `/api/data/{type}/{uid}/{version}` | Versioned object access |
| `GET/POST` | `/api/sky/repo/search` | Full-text search |
| `POST` | `/api/sky/repo/multiGet` | Batch retrieval |
| `POST` | `/api/sky/repo/multiPut` | Batch storage |
| `POST` | `/api/sky/repo/multiDelete` | Batch deletion |
| `POST` | `/api/sky/id/create` | Create identity |
| `POST` | `/api/sky/id/commit` | Commit identity changes |
| `POST` | `/api/sky/id/login` | Login |
| `GET` | `/api/sky/admin` | Admin public keys |
| `GET` | `/api/profile/latest` | Compute learner profile |
| `WS` | `/ws/custom` | Real-time change notifications |

### 4.4.3 IF-02: Server–Elasticsearch

**Type:** Storage-and-retrieval of data via HTTP REST.

**Communication Protocol:**
- **Transport:** HTTP (internal network, typically `http://elasticsearch:9200`)
- **Data Format:** JSON
- **Authentication:** Optional via `ELASTICSEARCH_AUTHORIZATION` header

**Key Operations:**

| Operation | ES API | CaSS Wrapper |
| --------- | ------ | ------------- |
| Store object | `PUT /{index}/_doc/{id}?version={v}&version_type=external` | `skyrepoPut()` |
| Retrieve object | `GET /{index}/_doc/{id}` | `skyrepoGet()` |
| Delete object | `DELETE /{index}/_doc/{id}` | `skyrepoDelete()` |
| Search | `POST /{index}/_search` (Simple Query String) | `skyrepoSearch()` |
| Index management | `PUT /{index}`, `GET /_cat/indices` | `util.js` |
| Bulk delete (ephemeral) | `POST /ephemeral/_delete_by_query` | `ephemeral.js` |

### 4.4.4 IF-05: Standards Adapter Interfaces

Each standards adapter exposes its own REST endpoint namespace:

| Adapter | Endpoint Prefix | Standard | Direction |
| ------- | --------------- | -------- | --------- |
| CTDL-ASN | `/api/ceasn/*`, `/api/ctdlasn/*` | CTDL-ASN JSON-LD | Import + Export |
| IMS CASE | `/api/ims/case/v1p0/*` | IMS CASE v1.0 | Read API (11 endpoints) + Harvest |
| ASN | `/api/asn/*` | Achievement Standards Network | Import + Export |
| Open Badges | `/api/badge/*` | Open Badges 2.0 | Read API |
| xAPI | `/api/xapi/*` | Experience API 1.0.3 | Statement ingest |
| PNA | `/api/ce/pna/*` | Portable Native Assertions | Read + Write |
| SCD | `/api/scd/*` | Service Component Documentation | Read |
| Ollama | `/api/ollama/framework` | — | AI generation |
| Replication | (internal) | CaSS protocol | Bidirectional |

### 4.4.5 IF-09: MCP (Model Context Protocol)

**Type:** AI tool integration via Streamable HTTP.

**Endpoint:** `POST /api/mcp`

**Description:** The MCP server auto-generates tool definitions from the CaSS OpenAPI specification. AI agents connecting via MCP can invoke CaSS API operations as "tools," enabling natural-language-driven competency management.

**Implementation:** The MCP adapter (`mcp.js`) uses `@modelcontextprotocol/sdk` with OpenAPI-to-tools conversion (`openapi-to-tools.js`) and JSON Schema to Zod validation (`json-schema-to-zod.js`).

---

# 5. Detailed Design

## 5.1 Server Core (server.js)

**Project-unique identifier:** `CASS-SRV-CORE`  
**Source:** [src/main/server.js](src/main/server.js) (539 lines)  
**Language:** JavaScript (Node.js 24+, Express 5)

### Design Decisions

- Express 5 is used for its improved async error handling and wildcard parameter changes over Express 4.
- The server uses an event-driven initialization sequence rather than procedural startup to support asynchronous database connection and adapter loading.
- OpenAPI specification is generated at startup and validated; the server refuses to start if the spec is invalid, enforcing API contract integrity.

### Data Flow

1. `server.js` creates the Express application and configures middleware (compression, CORS, body parsing).
2. Runtime shims are loaded in dependency order.
3. Core modules (util, skyRepo, skyId) are loaded, triggering Elasticsearch connection.
4. On `database.connected`, the HTTP/HTTPS/HTTP2 server starts listening.
5. On `server.listening`, adapter cartridges are loaded dynamically via glob.
6. On `server.ready`, the system enters steady-state operation with 60-second periodic ticks.

### Key Configuration

| Environment Variable | Purpose |
| -------------------- | ------- |
| `PORT` | Listen port (default 80/443) |
| `CASS_LOOPBACK` | Self-referencing URL |
| `ELASTICSEARCH_ENDPOINT` | Database URL |
| `HTTPS` / `HTTP2_SERVER` | Transport mode |
| `CASS_BASE` | URL prefix |

### Error Handling

- Uncaught exceptions: email alert → emergency log → flush → `process.exit(1)`.
- Fetch allow-list violations: logged as `WARNING` with `FetchBlocked` message.

## 5.2 SkyRepo Data Layer

**Project-unique identifier:** `CASS-SRV-SKYREPO`  
**Source:** [src/main/server/skyRepo/](src/main/server/skyRepo/) (15 files)  
**Language:** JavaScript

### Purpose

SkyRepo is the data persistence layer—a JSON-LD object store backed by Elasticsearch with KBAC-enforced access control, versioning, and full-text search.

### Sub-Units

| File | Identifier | Purpose |
| ---- | ---------- | ------- |
| `data.js` | `SKYREPO-DATA` | Express route handler for `GET/POST /api/data/*`. Routes requests to get, put, or delete operations based on HTTP method and body content. |
| `get.js` | `SKYREPO-GET` | Retrieves a JSON-LD object from Elasticsearch by type, UID, and optional version. Falls back to the `permanent` index for historical versions. |
| `put.js` | `SKYREPO-PUT` | Stores a JSON-LD object in its type-specific index and the `permanent` index. Uses external versioning (`version_type=external`). Emits `database.afterSave` events. |
| `delete.js` | `SKYREPO-DEL` | Deletes an object from its type-specific index (version history is preserved in `permanent`). |
| `search.js` | `SKYREPO-SEARCH` | Proxies search queries to Elasticsearch using Simple Query String, with KBAC filtering of results. |
| `searchUtil.js` | `SKYREPO-SEARCHUTIL` | Query sanitization, special character escaping, index hint resolution. |
| `multiget.js` | `SKYREPO-MULTIGET` | Batch retrieval by array of partial identifiers. |
| `multiput.js` | `SKYREPO-MULTIPUT` | Batch storage with configurable batch size (`MULTIPUT_BATCH_SIZE`). |
| `multidelete.js` | `SKYREPO-MULTIDEL` | Batch deletion by array of identifiers. |
| `kbac.js` | `SKYREPO-KBAC` | **Key-Based Access Control.** Validates signature sheets, checks `@owner`/`@reader` permissions, enforces write-access restrictions. Central to the security model. ~250 lines. |
| `history.js` | `SKYREPO-HISTORY` | Retrieves version history of an object from the `permanent` index. |
| `ping.js` | `SKYREPO-PING` | `GET /api/ping` handler returning server version, SSO state, FIPS mode, banner/MOTD, plugins, and endpoint information. |
| `admin.js` | `SKYREPO-ADMIN` | `GET /api/sky/admin` returning admin public keys. |
| `langs.js` | `SKYREPO-LANGS` | ISO language code lookup table for internationalization. |
| `util.js` | `SKYREPO-UTIL` | Elasticsearch HTTP helper functions (`httpGet`, `httpPost`, `httpPut`, `httpDelete`), index management, backup/restore utilities. |

### Logic: KBAC Permission Check (kbac.js)

```
Input: Request with signature sheet + target object
  1. Extract signature sheets from request headers/body
  2. For each signature:
     a. Verify RSA signature against public key (SHA-256, fallback SHA-1)
     b. Check timestamp freshness (not expired)
     c. Add verified public key to "proven identities" set
  3. If target object has @owner:
     a. Check if any proven identity matches an @owner → allow write
     b. If no match → deny write (401)
  4. If target object has @reader:
     a. Check if any proven identity matches a @reader → allow read
     b. If server identity matches → allow read
     c. If no match → return encrypted (unreadable) object
  5. If no @owner/@reader → public access (allow all)
Output: Authorized/denied response
```

## 5.3 Profile Calculation Engine

**Project-unique identifier:** `CASS-SRV-PROFILE`  
**Source:** [src/main/server/profile/](src/main/server/profile/) (6+ files)  
**Language:** JavaScript

### Purpose

The profile engine computes a learner's competency attainment by aggregating assertions against a framework's competency structure, using a pluggable coprocessor pipeline executed in worker threads.

### Sub-Units

| File | Identifier | Purpose |
| ---- | ---------- | ------- |
| `controller.js` | `PROF-CTRL` | Express route handler for `GET /api/profile/latest`. Parses parameters (`frameworkId`, `subject`, `flushCache`, `cache`, `targetDateTime`), delegates to coordinator. |
| `coordinator.js` | `PROF-COORD` | Orchestrates profile computation across frameworks. Manages the cache layer (checks cache TTL, stores results). Spawns worker threads when needed. |
| `calculator.js` | `PROF-CALC` | Core assertion-to-competency calculation logic (~18 KB). Resolves assertions to competencies, evaluates alignment matches, and produces raw profile data. |
| `worker.js` | `PROF-WORKER` | Worker thread entry point (~12 KB). Each worker loads `cassproject`, creates its own `EcRepository`, and executes the coprocessor pipeline. Configurable memory via `WORKER_MAX_MEMORY`. |
| `util.js` | `PROF-UTIL` | Utility functions for profile processing, confidence thresholds. |

### Coprocessor Pipeline

Coprocessors are pluggable computation modules in `profile/coprocessors/`:

| File | Stage | Description |
| ---- | ----- | ----------- |
| `default.js` | Assertion Matching | Matches assertions to competencies using alignment rules (source → target mapping) |
| `direct.js` | Direct Assertions | Handles assertions that directly reference competencies without alignment indirection |
| `conditions.js` | Roll-up Evaluation | Evaluates roll-up rules—graph traversal of framework conditions to determine derived mastery |
| `timeBounding.js` | Temporal Filtering | Filters assertions by `targetDateTime`, removing expired or not-yet-valid evidence |
| `explainer.js` | Explanation Generation | Produces human-readable narrative explanations of how each competency's status was determined |
| `template.js` | Extension Point | Template for implementing custom coprocessors |

### Execution Model

```
GET /api/profile/latest?frameworkId=...&subject=...
       │
       ▼
  controller.js
       │  Parse parameters
       ▼
  coordinator.js
       │  Check cache (TTL from PROFILE_TTL)
       │  ┌─ Cache HIT → return cached result
       │  └─ Cache MISS ↓
       ▼
  Spawn worker.js (via node-worker-threads-pool)
       │  Worker loads cassproject, creates EcRepository
       │  Fetches framework, competencies, assertions
       ▼
  Coprocessor Pipeline (sequential):
       │  default.js → direct.js → conditions.js →
       │  timeBounding.js → explainer.js
       ▼
  Return profile result
       │  Store in cache if caching enabled
       ▼
  JSON response to client
```

## 5.4 Runtime Shims

**Project-unique identifier:** `CASS-SRV-SHIMS`  
**Source:** [src/main/server/shims/](src/main/server/shims/) (10 files + `util/`)  
**Language:** JavaScript

### Purpose

Shims provide cross-cutting runtime infrastructure: authentication, event bus, backward compatibility, cryptographic identity, logging, email, and background job scheduling.

### Sub-Units

| File | Identifier | Lines | Purpose |
| ---- | ---------- | ----- | ------- |
| `auth.js` | `SHIM-AUTH` | ~858 | **Central authentication middleware.** Implements four auth modes (KBAC signature sheets, OIDC/SSO via `express-openid-connect`, JWT via `express-jwt`, Platform One). Only one mode active at a time; selection based on environment variables. Manages admin cache and identity resolution. |
| `event.js` | `SHIM-EVENT` | — | **RxJS-based event bus.** Creates `global.events` with Subjects for `server`, `database`, `person`, `data` event categories. Enables decoupled, reactive module communication. |
| `levr.js` | `SHIM-LEVR` | ~679 | **LEVR compatibility layer.** Provides `bindWebService()` for adapter route registration, `httpGet/Post/Put/Delete` helpers, file I/O operations, and request body parsing. Bridges legacy LEVR API to Express 5. |
| `cassproject.js` | `SHIM-CASS` | — | **SDK import shim.** Imports key classes from the `cassproject` npm package (`EcIdentity`, `EcPpk`, `EcPk`, `EcRepository`, etc.) and makes them available as globals. |
| `auditLogger.js` | `SHIM-AUDIT` | — | **Structured audit logging.** Provides `report(category, severity, source, message)` with filterable categories (`SYSTEM`, `NETWORK`, `AUTH`, `DATA`, `ADAPTER`) and severities (`DEBUG` through `EMERGENCY`). Supports flush and file-based logging in production mode. |
| `ephemeral.js` | `SHIM-EPHEM` | — | **Ephemeral data store.** Stores TTL-based temporary data in an Elasticsearch `ephemeral` index. Periodic cleanup via `_delete_by_query` on expired entries. Used for signature sheet caches and transient computation state. |
| `jobs.js` | `SHIM-JOBS` | — | **Background job scheduler.** Manages periodic tasks (disk space monitoring) with cron-style scheduling. |
| `mailer.js` | `SHIM-MAIL` | — | **SMTP email.** Uses `nodemailer` to send alerts for uncaught exceptions, disk warnings, and administrative events. Configurable via `SMTP_*` environment variables. |
| `http2compat.js` | `SHIM-H2` | — | **HTTP/2 compatibility shim.** Bridges HTTP/2 push-stream behavior for environments that require HTTP/1.1 compatibility. |
| `stjs.js` | `SHIM-STJS` | — | **Schema.org type utilities.** Provides type-checking and type-resolution functions for JSON-LD objects. |
| `util/sharedAdminCache.js` | `SHIM-ADMCACHE` | — | **Admin key cache.** Caches admin public keys for fast KBAC checks, reducing repeated Elasticsearch lookups. |

## 5.5 Protocol Adapters (Cartridges)

**Project-unique identifier:** `CASS-SRV-ADAPTERS`  
**Source:** [src/main/server/cartridge/adapter/](src/main/server/cartridge/adapter/) (13 files)  
**Language:** JavaScript

### Purpose

Protocol adapters enable CaSS to import from, export to, and interoperate with external standards-based systems. Each adapter is a self-contained module that registers its own Express routes using `bindWebService()`.

### Design Pattern

Adapters follow a cartridge pattern:
1. Each adapter is a standalone `.js` file in the `cartridge/adapter/` directory.
2. At startup, `server.js` uses `glob` to discover and `require()` all adapter files.
3. Each adapter calls `bindWebService()` (from `levr.js`) to register its HTTP routes.
4. Adapters can be disabled via the `DISABLED_ADAPTERS` environment variable (comma-separated list of adapter names).

### Adapter Inventory

| File | Identifier | Size | Endpoints | Description |
| ---- | ---------- | ---- | --------- | ----------- |
| `ceasn.js` | `ADAPT-CEASN` | ~89 KB | `/api/ceasn/*`, `/api/ctdlasn/*` | **CTDL-ASN adapter.** The largest adapter. Imports and exports competency frameworks in Credential Transparency Description Language format. Handles complex JSON-LD context mapping, property translation, and CTDL vocabulary conformance. |
| `caseAdapter.js` | `ADAPT-CASE` | — | `/api/ims/case/v1p0/*` | **IMS CASE v1.0 read API.** Implements 11 endpoints (CFDocuments, CFItems, CFAssociations, CFPackages, CFSubjects, etc.) for standards-compliant CASE data access. |
| `caseIngest.js` | `ADAPT-CASEIN` | — | `POST /api/ims/case/harvest` | **CASE bulk import.** Harvests competency frameworks from external CASE-compliant servers. |
| `asn.js` | `ADAPT-ASN` | — | `/api/asn/*` | **ASN adapter.** Imports/exports Achievement Standards Network XML and JSON formats. Uses `@xmldom/xmldom` for XML parsing. |
| `openbadges.js` | `ADAPT-BADGES` | — | `/api/badge/*` | **Open Badges 2.0.** Exposes badge profile, class, and assertion endpoints in OBv2 format. |
| `xapi.js` | `ADAPT-XAPI` | — | `/api/xapi/*` | **xAPI adapter.** Fetches Experience API statements from configured LRS endpoints, converts them to CaSS assertions. Supports OIDC client authentication for LRS access. |
| `pna.js` | `ADAPT-PNA` | — | `/api/ce/pna/*` | **Portable Native Assertions.** Reads/writes assertion data to local filesystem or AWS S3 buckets. Configurable via `PNA_*` environment variables. |
| `scd.js` | `ADAPT-SCD` | — | `/api/scd/*` | **Service Component Documentation.** Read-only adapter for SCD data. |
| `ollama.js` | `ADAPT-OLLAMA` | — | `POST /api/ollama/framework` | **AI-assisted framework generation.** Uses Ollama (local LLM) to generate competency frameworks from natural language prompts. |
| `replicate.js` | `ADAPT-REPL` | — | (internal) | **Server-to-server replication.** Enables data synchronization between CaSS instances. Uses dedicated replication key pair (`CASS_REPLICATION_PPK`). |
| `jsonLd.js` | `ADAPT-JSONLD` | — | `POST /api/jsonld` | **JSON-LD context resolution.** Resolves JSON-LD `@context` references. |
| `mcp.js` | `ADAPT-MCP` | — | `/api/mcp` | **Model Context Protocol.** Auto-generates MCP tools from OpenAPI spec; serves AI agent tool invocations. |
| `profile.js` | `ADAPT-PROFILE` | — | `/api/profile/*` | **Profile bridge.** Routes profile calculation requests to the profile engine subsystem. |

## 5.6 CaSS Library (cassproject npm)

**Project-unique identifier:** `CASS-LIB`  
**Source:** `node_modules/cassproject/` (installed), [GitHub](https://github.com/cassproject/cass-npm)  
**Version:** 5.0.15  
**Language:** JavaScript

### Purpose

The `cassproject` npm package is the official JavaScript SDK. It provides typed data model classes, CRUD operations, cryptographic identity management, and import/export utilities. It is used both server-side (by CaSS itself) and client-side (bundled into the CaSS editor).

### Class Hierarchy

```
EcLinkedData
  └─ EcRemoteLinkedData
       ├─ Competency → EcCompetency        (CRUD + alignment/level management)
       ├─ Framework  → EcFramework          (CRUD + competency/relation management)
       ├─ Assertion  → EcAssertion          (encrypted subject/agent)
       ├─ Relation   → EcAlignment          (source→target with type)
       ├─ Level      → EcLevel              (proficiency levels)
       ├─ RollupRule → EcRollupRule         (aggregation rules)
       ├─ Directory  → EcDirectory          (framework directories)
       ├─ GeneralFile → EcFile              (file objects)
       ├─ Concept    → EcConcept            (SKOS concepts)
       ├─ ConceptScheme → EcConceptScheme   (SKOS concept schemes)
       ├─ EncryptedValue → EcEncryptedValue (encrypted object wrapper)
       └─ ... (180+ schema.org types, 40+ Credential Engine types, S3000L types)
```

### Key Classes

| Class | Purpose | Key Methods |
| ----- | ------- | ----------- |
| `EcRepository` | Primary CRUD interface (~2,042 lines) | `.get(id)`, `.search(query)`, `.save(obj)`, `._delete(obj)`, `.getAs(id, type)`, `.searchAs(query, type)` |
| `EcIdentityManager` | Manages owned identities and contacts | `.addIdentity(identity)`, `.getSignatureSheet(server)`, `.getPpk(pk)` |
| `EcIdentity` | Single identity (key pair + display name) | `.ppk`, `.displayName` |
| `EcPpk` | Private key wrapper | `.fromPem(pem)`, `.sign(data)`, `.decrypt(data)` |
| `EcPk` | Public key wrapper | `.fromPem(pem)`, `.verify(data, signature)`, `.encrypt(data)` |
| `EcEncryptedValue` | Encrypted data wrapper | `.encryptValue(data, id, owner, reader)`, `.decryptIntoObject(ev)` |
| `EcRemote` | Low-level HTTP wrapper | `.postExpectingString(url, formData)`, `.getExpectingObject(url)` |
| `EcLinkedData` | Base JSON-LD object | `.toJson()`, `.copyFrom(obj)`, `.isA(type)`, `.getFullType()` |
| `EcRemoteLinkedData` | Remote-storable object | `.owner[]`, `.reader[]`, `.signature[]`, `.addOwner(pk)`, `.addReader(pk)` |

### Global Registration Pattern

On `require("cassproject")`, all classes are registered as `global.*` properties (via `exports.js`, 1,536 lines). No destructuring or module imports needed—classes are available globally throughout the CaSS server codebase.

### Import/Export Utilities

| Class | Format | Direction |
| ----- | ------ | --------- |
| `ASNImport` | ASN XML/JSON | Import |
| `CSVImport` / `CSVExport` | CSV | Import / Export |
| `CTDLASNCSVImport` | CTDL-ASN CSV | Import |
| `CTDLASNCSVConceptImport` | CTDL-ASN concept taxonomy CSV | Import |
| `MedbiqImport` | MedBiquitous XML | Import |
| `FrameworkImport` | Generic JSON-LD | Import |
| `TabStructuredImport` | Tab-indented text | Import |

### Dependencies

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `node-forge` | ^1.4.0 | RSA/AES cryptography |
| `jsonld` | ^9.0.0 | JSON-LD processing |
| `papaparse` | ^5.5.3 | CSV parsing |
| `base64-arraybuffer` | ^1.0.2 | Base64 encoding |
| `web-worker` / `promise-worker` | 1.3.0 / ^2.0.1 | Web Worker polyfill |

## 5.7 CaSS Editor (cass-editor)

**Project-unique identifier:** `CASS-UI-EDITOR`  
**Source:** [src/main/webapp/](src/main/webapp/) (pre-built output), [GitHub](https://github.com/cassproject/cass-editor) (source)  
**Technology:** Vue.js 2, Vue CLI, Webpack  
**Language:** JavaScript

### Purpose

The CaSS editor is the primary user-facing web application for authoring, browsing, importing, exporting, and managing competency frameworks. It is a single-page application (SPA) served as static files by the CaSS server.

### Serving Mechanism

The Express server mounts the editor at both `/` and `/cass-editor/` as static files with 24-hour cache:

```javascript
app.use(baseUrl, express.static('src/main/webapp/', { maxAge: 24*60*60*1000 }));
app.use(baseUrl + "cass-editor/", express.static('src/main/webapp/', { maxAge: 24*60*60*1000 }));
```

Can be disabled via `DISABLED_EDITOR=true`.

### Route-Level Components

The editor uses Webpack code-splitting to lazy-load route-level components:

| Route/Feature | Purpose | Description |
| ------------- | ------- | ----------- |
| **Framework** | Core editor | Create, edit, browse, delete competency frameworks with rich metadata editing |
| **Crosswalk** | Alignment tool | Align competencies across different frameworks with drag-and-drop mapping |
| **Concepts / Concept Scheme** | Taxonomy management | SKOS-compliant concept and taxonomy authoring |
| **Progression Model** | Progression authoring | Learning progression sequence modeling |
| **Directory** | Framework browser | Browse, search, and organize published frameworks |
| **Import** | Data ingestion | Import from CSV, MedBiquitous XML, JSON-LD, IMS CASE, CTDL-ASN (~2.1 MB chunk) |
| **Login** | Authentication | Login UI for key-based, OIDC, or SSO authentication |
| **Configuration Editor** | Settings manager | Customize editor properties, relationship types, resource types |
| **User Group Editor** | Permissions | Manage readers, authors, admins per framework |
| **Organizations / Organization** | Org management | Organizational structure management |
| **Plugin Manager / Plugin Container** | Extensibility | Plugin lifecycle management with iframe isolation |
| **Timeline** | Version history | Browse object version history |
| **Welcome / About** | Information | Landing page and system information |

### Client-Side Architecture

- **`cassproject` SDK** bundled into the client handles all API communication, signature sheet generation, and cryptographic operations.
- **Forge.js** (`node-forge`) provides client-side RSA/AES encryption for KBAC.
- **xml2json.js** supports XML import parsing in the browser.
- **Font Awesome 6** for icons; **Assistant** and **Roboto Condensed** for typography.

### Embeddable Mode

The editor is designed to be embedded in third-party applications via `<iframe>`:
- Supports CSS inheritance from parent page.
- Configurable via URL parameters (server endpoint, view-only mode, data type selection).
- `X-Frame-Options: SAMEORIGIN` header is controllable via `INCLUDE_SAMEORIGIN_IFRAME_HEADER`.

## 5.8 MCP Server

**Project-unique identifier:** `CASS-SRV-MCP`  
**Source:** [src/main/server/mcp/](src/main/server/mcp/) + [src/main/server/cartridge/adapter/mcp.js](src/main/server/cartridge/adapter/mcp.js)  
**Language:** JavaScript

### Purpose

The MCP (Model Context Protocol) server enables AI agents to interact with CaSS using natural-language tool invocation. It auto-generates MCP tool definitions from the CaSS OpenAPI specification.

### Sub-Units

| File | Purpose |
| ---- | ------- |
| `lib/openapi-to-tools.js` | Converts OpenAPI 3.0 endpoint definitions to MCP tool definitions (name, description, input schema) |
| `lib/json-schema-to-zod.js` | Converts JSON Schema definitions to Zod validation schemas for runtime parameter validation |
| `lib/http-client.js` | HTTP client wrapper for executing MCP tool calls against the CaSS REST API |
| `adapter/mcp.js` | Express route handler mounting MCP at `/api/mcp` using `@modelcontextprotocol/sdk` Streamable HTTP transport |

### Execution Flow

```
AI Agent → MCP Client
  → POST /api/mcp (Streamable HTTP)
  → MCP SDK routes to tool handler
  → openapi-to-tools maps tool name to API endpoint
  → json-schema-to-zod validates parameters
  → http-client executes internal API call
  → Result returned as MCP tool response
```

---

# 6. Requirements Traceability

The following table maps key system requirements to the CaSS components that implement them. Requirements are derived from the system's stated purpose, referenced standards, and the [DI-IPSC-81433A Software Requirements Specification Template](DI-IPSC-81433A%20Software%20Requirements%20Specification%20Template.md).

| Requirement | Description | Implementing Component(s) |
| ----------- | ----------- | ------------------------- |
| **REQ-DATA-01** | Store and retrieve competency frameworks as JSON-LD linked data | `CASS-SRV-SKYREPO` (data.js, get.js, put.js), `CASS-LIB` (EcFramework, EcCompetency) |
| **REQ-DATA-02** | Full-text search across all stored objects | `CASS-SRV-SKYREPO` (search.js, searchUtil.js) |
| **REQ-DATA-03** | Version history for all objects | `CASS-SRV-SKYREPO` (history.js, put.js — permanent index) |
| **REQ-DATA-04** | Batch CRUD operations | `CASS-SRV-SKYREPO` (multiget.js, multiput.js, multidelete.js) |
| **REQ-SEC-01** | Key-Based Access Control (KBAC) for all data operations | `CASS-SRV-SKYREPO` (kbac.js), `CASS-LIB` (EcIdentityManager, EcPpk, EcPk) |
| **REQ-SEC-02** | Object-level encryption for privacy-sensitive data | `CASS-LIB` (EcEncryptedValue), `CASS-SRV-SKYREPO` (kbac.js — reader check) |
| **REQ-SEC-03** | FIPS 140-3 cryptographic compliance | Docker images (OpenSSL 3.1.2), `CASS-LIB` (node-forge), `CASS-SRV-SKYREPO` (kbac.js — SHA-256) |
| **REQ-SEC-04** | OIDC/SSO authentication | `CASS-SRV-SHIMS` (auth.js — express-openid-connect) |
| **REQ-SEC-05** | TLS/HTTPS with HTTP/2 support | `CASS-SRV-CORE` (server.js — https, http2compat) |
| **REQ-SEC-06** | Audit logging | `CASS-SRV-SHIMS` (auditLogger.js) |
| **REQ-PROFILE-01** | Compute learner profiles from assertions against frameworks | `CASS-SRV-PROFILE` (controller.js, coordinator.js, calculator.js, worker.js) |
| **REQ-PROFILE-02** | Pluggable profile calculation coprocessors | `CASS-SRV-PROFILE` (coprocessors/*.js) |
| **REQ-PROFILE-03** | Profile caching with configurable TTL | `CASS-SRV-PROFILE` (coordinator.js — PROFILE_TTL, PROFILE_CACHE) |
| **REQ-INTEROP-01** | CTDL-ASN import/export | `CASS-SRV-ADAPTERS` (ceasn.js) |
| **REQ-INTEROP-02** | IMS CASE v1.0 read API compliance | `CASS-SRV-ADAPTERS` (caseAdapter.js — 11 endpoints) |
| **REQ-INTEROP-03** | xAPI statement ingestion | `CASS-SRV-ADAPTERS` (xapi.js) |
| **REQ-INTEROP-04** | Open Badges 2.0 endpoints | `CASS-SRV-ADAPTERS` (openbadges.js) |
| **REQ-INTEROP-05** | ASN import/export | `CASS-SRV-ADAPTERS` (asn.js) |
| **REQ-INTEROP-06** | Server-to-server data replication | `CASS-SRV-ADAPTERS` (replicate.js) |
| **REQ-INTEROP-07** | MCP (AI agent) integration | `CASS-SRV-MCP` (mcp.js, openapi-to-tools.js) |
| **REQ-UI-01** | Web-based framework authoring and management | `CASS-UI-EDITOR` (Framework, Crosswalk, Import routes) |
| **REQ-UI-02** | Framework import from CSV, XML, JSON-LD formats | `CASS-UI-EDITOR` (Import route), `CASS-LIB` (importers) |
| **REQ-UI-03** | SKOS concept/taxonomy management | `CASS-UI-EDITOR` (Concepts, ConceptScheme routes) |
| **REQ-UI-04** | User/group permission management | `CASS-UI-EDITOR` (UserGroupEditor route) |
| **REQ-UI-05** | Embeddable via iframe | `CASS-UI-EDITOR` (iframe mode, URL parameter config) |
| **REQ-DEPLOY-01** | Docker containerized deployment | Docker images (4 variants), Docker Compose (7 configs) |
| **REQ-DEPLOY-02** | Kubernetes deployment | K8s manifests (StatefulSet, Deployment, PVC, Ingress) |
| **REQ-DEPLOY-03** | Environment-variable-based configuration | `CASS-SRV-CORE` (80+ env vars per ENVIRONMENT.md) |
| **REQ-API-01** | OpenAPI 3.0 documented REST API | `CASS-SRV-CORE` (swagger.json, swagger-jsdoc), `/api/swagger` |
| **REQ-API-02** | WebSocket real-time change notifications | `CASS-SRV-CORE` (websocket.js — /ws/custom) |
| **REQ-AVAIL-01** | Health check endpoint | `CASS-SRV-SKYREPO` (ping.js — GET /api/ping) |
| **REQ-AVAIL-02** | Horizontal scalability | Stateless server + shared Elasticsearch + shared etc/ volume |

---

# 7. Notes

## 7.1 General Information

This document was generated from automated analysis of the CaSS codebase (version 1.6.27), the `cassproject` npm package (version 5.0.15), the pre-built CaSS editor output, and publicly available documentation at [docs.cassproject.org](https://docs.cassproject.org) and [devs.cassproject.org](https://devs.cassproject.org).

The system was originally developed in Java and was re-architectured to Node.js in the 1.5.x series. Some design patterns (e.g., the `levr.js` compatibility shim, the `bindWebService` function, and the class inheritance hierarchy in `cassproject`) reflect this heritage.

## 7.2 Acronyms and Abbreviations

| Acronym | Meaning |
| ------- | ------- |
| ADL | Advanced Distributed Learning Initiative |
| AES | Advanced Encryption Standard |
| ASN | Achievement Standards Network |
| CASE | Competency and Academic Standards Exchange |
| CaSS | Competency and Skills System |
| CORS | Cross-Origin Resource Sharing |
| CRL | Certificate Revocation List |
| CRUD | Create, Read, Update, Delete |
| CSCI | Computer Software Configuration Item |
| CTDL | Credential Transparency Description Language |
| CTDL-ASN | CTDL — Achievement Standards Network extension |
| DID | Data Item Description |
| ECK | Elastic Cloud on Kubernetes |
| ES | Elasticsearch |
| FIPS | Federal Information Processing Standards |
| HSTS | HTTP Strict Transport Security |
| HTTP/2 | Hypertext Transfer Protocol version 2 |
| HWCI | Hardware Configuration Item |
| IDD | Interface Design Description |
| IdP | Identity Provider |
| JSON-LD | JavaScript Object Notation for Linked Data |
| JWT | JSON Web Token |
| KBAC | Key-Based Access Control |
| K8s | Kubernetes |
| LEVR | Linked Expert Virtual Reality (legacy platform) |
| LMS | Learning Management System |
| LRS | Learning Record Store |
| MCP | Model Context Protocol |
| mTLS | Mutual TLS (client certificate authentication) |
| OBv2 | Open Badges version 2.0 |
| OIDC | OpenID Connect |
| P1 | Platform One (DoD DevSecOps platform) |
| PEM | Privacy-Enhanced Mail (key encoding format) |
| PII | Personally Identifiable Information |
| PKI | Public Key Infrastructure |
| PNA | Portable Native Assertions |
| PVC | Persistent Volume Claim (Kubernetes) |
| REST | Representational State Transfer |
| RSA | Rivest–Shamir–Adleman (asymmetric cryptosystem) |
| RSA-OAEP | RSA Optimal Asymmetric Encryption Padding |
| RWX | ReadWriteMany (Kubernetes volume access mode) |
| RxJS | Reactive Extensions for JavaScript |
| S3 | Amazon Simple Storage Service |
| SCD | Service Component Documentation |
| SKOS | Simple Knowledge Organization System |
| SPA | Single-Page Application |
| SPDY | HTTP/2 predecessor protocol |
| SRS | Software Requirements Specification |
| SSDD | System/Subsystem Design Description |
| SSO | Single Sign-On |
| TLS | Transport Layer Security |
| TTL | Time-To-Live |
| URI | Uniform Resource Identifier |
| W3C | World Wide Web Consortium |
| WS | WebSocket |
| xAPI | Experience API (Tin Can API) |

## 7.3 Terms and Definitions

| Term | Definition |
| ---- | ---------- |
| **Assertion** | A claim or piece of evidence about an individual's attainment of a competency at a certain performance level. Assertions can be encrypted to protect privacy. |
| **Cartridge** | A dynamically-loadable protocol adapter module placed in the `cartridge/adapter/` directory. |
| **Competency** | A human-readable and machine-actionable object representing a skill, knowledge area, ability, trait, or learning outcome. |
| **Competency Framework** | A structured collection of competencies organized as a directed graph, with relationships (edges) and metadata. |
| **Coprocessor** | A pluggable computation module in the profile calculation pipeline that processes assertions to determine competency attainment. |
| **Crosswalk** | An alignment mapping between competencies in different frameworks, establishing equivalency or hierarchical relationships. |
| **Ephemeral Store** | A TTL-based temporary data store backed by a dedicated Elasticsearch index, used for transient computation state. |
| **Framework** | See *Competency Framework*. |
| **Identity** | An RSA key pair (public + private key) that represents an actor in the CaSS system. Identities sign requests and own objects. |
| **JSON-LD** | JavaScript Object Notation for Linked Data; the native data serialization format for all CaSS objects. |
| **KBAC** | Key-Based Access Control; CaSS's foundational authorization mechanism based on RSA cryptographic signatures rather than traditional role-based access. |
| **Level** | A performance or proficiency level associated with a competency (e.g., "Novice," "Proficient," "Expert"). |
| **Profile** | A computed summary of an individual's competency attainment across a framework, derived from aggregated assertions. |
| **Relation** | A typed, directed link between two competencies (e.g., "narrows," "requires," "isEquivalentTo"). |
| **Roll-up Rule** | A rule that defines how mastery of one competency is computed from mastery of related competencies (graph-based aggregation). |
| **Signature Sheet** | A time-limited, RSA-signed token array that proves key ownership. Attached to each authenticated CaSS request. |
| **SkyRepo** | The internal name for CaSS's data persistence layer (JSON-LD object store over Elasticsearch). |

---

# 8. Appendixes

## Appendix A: Environment Variable Reference

See [ENVIRONMENT.md](ENVIRONMENT.md) for the complete reference of 80+ environment variables, organized by functional category:

- Core Server (PORT, CASS_LOOPBACK, ELASTICSEARCH_ENDPOINT, etc.)
- CORS (CORS_ORIGINS, CORS_CREDENTIALS)
- Security Headers (INCLUDE_SAMEORIGIN_IFRAME_HEADER, etc.)
- TLS / Client Certificates (REQUEST_CLIENT_SIDE_CERTIFICATE, etc.)
- OIDC (CASS_OIDC_ENABLED, CASS_OIDC_ISSUER_BASE_URL, etc.)
- JWT (CASS_JWT_ENABLED, CASS_JWT_SECRET, etc.)
- Platform One (CASS_PLATFORM_ONE_AUTH_ENABLED, etc.)
- Access Control (AUTH_ALLOW_ENV_ADMINS, CASS_IP_ALLOW, etc.)
- UI (CASS_BANNER_MESSAGE, MOTD_TITLE, DISABLED_EDITOR, etc.)
- SMTP (SMTP_HOST, SMTP_PORT, SMTP_RECIPIENTS, etc.)
- Logging (LOG_HEADERS, LOG_FILTERED_CATEGORIES, etc.)
- Profile (PROFILE_PPK, PROFILE_CACHE, WORKER_MAX_MEMORY, etc.)
- xAPI (XAPI_ENDPOINT, XAPI_AUTH, XAPI_ENABLED, etc.)
- Replication (CASS_REPLICATION_PPK, CASS_REPLICATION_ENDPOINT)
- PNA (PNA_DIRECTORY, PNA_AWS_REGION, PNA_AWS_BUCKET, etc.)
- Batch Processing (MULTIPUT_BATCH_SIZE)

## Appendix B: Elasticsearch Index Schema

| Index Name Pattern | Content | Versioning |
| ------------------ | ------- | ---------- |
| `schema.cassproject.org.0.4.framework` | Current version of Framework objects | External (timestamp-based) |
| `schema.cassproject.org.0.4.competency` | Current version of Competency objects | External |
| `schema.cassproject.org.0.4.assertion` | Current version of Assertion objects | External |
| `schema.cassproject.org.kbac.0.2.encryptedvalue` | Encrypted value wrappers | External |
| `schema.org.person` | Person objects | External |
| `permanent` | All historical versions of all objects | External |
| `ephemeral` | TTL-based temporary data (mappings disabled) | Internal |

*Index names are derived by lowercasing and dot-delimiting the JSON-LD `@type` value.*

## Appendix C: Docker Image Variants

| Variant | Base Image | Dockerfile | Compose File | Notes |
| ------- | ---------- | ---------- | ------------ | ----- |
| **Default** | `node:24-slim` (Debian Bookworm) | `docker/standalone/node/Dockerfile` | `docker-compose.yml` | FIPS OpenSSL 3.1.2; recommended for production |
| **Alpine** | `node:24-alpine` | `DockerfileAlpine` | `docker-compose-alpine.yml` | ~40% smaller image |
| **Distroless** | `gcr.io/distroless/nodejs24-debian12` | `DockerfileDistroless` | `docker-compose-distroless.yml` | Minimal attack surface; no shell |
| **OpenSearch** | `node:24-slim` | Same as default | `docker-compose-opensearch.yml` | OpenSearch instead of Elasticsearch |
| **OIDC** | Same as default | Same as default | `docker-compose-oidc.yml` | Includes Keycloak for SSO |
| **Platform One** | Iron Bank `nodejs16` | `DockerfileP1` | — | DoD Iron Bank hardened image |

## Appendix D: OpenAPI Specification

The complete, machine-readable OpenAPI 3.0 specification is maintained at [src/main/swagger.json](src/main/swagger.json) and served live at `GET /api/swagger.json`. Interactive documentation is available at `/api/swagger/`.

The specification covers 57+ endpoints validated by the automated test suite (`4.swagger.test.js`, `4.swagger.schema.test.js`).

## Appendix E: Test Suite Coverage

| Test File | Scope | Description |
| --------- | ----- | ----------- |
| `0.harness.test.js` | Infrastructure | Starts server, waits for readiness |
| `1.skyRepo.test.js` | Data Layer | SkyRepo CRUD operations |
| `1.skyrepo.admin.test.js` | Data Layer | Admin endpoint tests |
| `2.EcRepository.l0.test.js` | SDK + Security | EcRepository at security level 0 (public) |
| `2.EcRepository.l1.test.js` | SDK + Security | EcRepository at level 1 (owned) |
| `2.EcRepository.l2.test.js` | SDK + Security | EcRepository at level 2 (encrypted) |
| `2.EcRepository.sso.l0.test.js` | SDK + SSO | EcRepository SSO variant, level 0 |
| `2.EcRepository.sso.l1.test.js` | SDK + SSO | EcRepository SSO variant, level 1 |
| `2.EcRepository.sso.l2.test.js` | SDK + SSO | EcRepository SSO variant, level 2 |
| `3.profile.test.js` | Profile Engine | Profile calculation tests |
| `3.xapi.test.js` | Adapter | xAPI adapter integration |
| `4.swagger.test.js` | API Compliance | OpenAPI endpoint validation (57+ endpoints) |
| `4.swagger.schema.test.js` | API Compliance | Response schema validation (Ajv) |
| `5.mcp.*.test.js` | MCP | JSON-schema-to-zod + openapi-to-tools |
| `8.asn.test.js` | Adapter | ASN import/export |
| `8.case.test.js` | Adapter | IMS CASE adapter |
| `8.ceasn.test.js` | Adapter | CTDL-ASN adapter |
| `9.restore.test.js` | Admin | Backup/restore functionality |

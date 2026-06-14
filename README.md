# CaSS

**Competency and Skills System** — Open-source competency framework management, assertion tracking, and learner profile computation.

## Overview

CaSS enables organizations across education, training, and workforce development to author competency frameworks, record assertions of individual competency attainment, compute learner profiles, and exchange competency data with external systems via standards-based protocol adapters.

The system is composed of:

- **CaSS Server** — A Node.js/Express application providing the REST API, data persistence (via Elasticsearch), and protocol adapters.
- **CaSS Library** — A JavaScript SDK ([`cassproject`](https://www.npmjs.com/package/cassproject)) providing data models, cryptographic identity management, and an interoperability layer for web applications.
- **CaSS Editor** — A Vue.js single-page application for framework authoring, crosswalks, import/export, and user management.
- **Protocol Adapters** — Pluggable cartridges providing standards-based interoperability (xAPI, CTDL-ASN, IMS CASE, Open Badges 2.0, ASN, MCP, and more).

## Quick Start

### Docker (Recommended)

Docker images for standalone and distributed deployments are available on Docker Hub:

> https://hub.docker.com/r/cassproject/cass

Use the provided Docker Compose files for common configurations:

```bash
docker compose up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Docker, Kubernetes, and production deployment guidance.

### Local Development

```bash
git clone --recurse-submodules https://github.com/cassproject/CASS
cd CASS
npm install
npm run dev        # Starts server with auto-restart on save
```

**Prerequisites:** Docker (pulls and runs Elasticsearch on port 9200).

### Running Tests

```bash
npm test           # Runs the full test suite (do not run alongside npm run dev)
```

### Generating API Documentation

```bash
npm run docs       # Output deposited in /docs
```

### Production

Use containerized builds. See the Docker Compose files in the repository root for examples.

## Post-Installation

To support open linked data, objects created in CaSS should have public, reliable URLs:

1. Assign the server a domain name.
2. Enable HTTPS (see [CONFIGURATION.md](CONFIGURATION.md)).
3. *(Optional)* Use a reverse proxy to control the endpoint.

## FIPS 140-3 Support

FIPS is supported both client-side and server-side. It is recommended to use the Docker container builds for FIPS compliance.

| → Server → | Legacy (pre-FIPS) | OpenSSL with `--force-fips` | OpenSSL with `--force-fips` and `REJECT_SHA1=true` |
| --- | --- | --- | --- |
| **Client / Library** | | | |
| Legacy (pre-FIPS) | SHA-1 (no FIPS) | SHA-1 (verify only) | Incompatible |
| Legacy + OpenSSL FIPS module | SHA-1 (partial FIPS) | SHA-1 (verify only) | Incompatible |
| Current | SHA-1 (no FIPS) | SHA-1 (verify only\*), SHA-256 (FIPS) | SHA-256 (FIPS) |
| Current + `FIPS=true` | SHA-1 (partial FIPS) | SHA-1 (verify only\*), SHA-256 (FIPS) | SHA-256 (FIPS) |
| Current + `--force-fips` | Incompatible | SHA-256 (FIPS) | SHA-256 (FIPS) |

> **Partial FIPS** — SHA-1 hashing is still used; all other cryptographic operations use the FIPS module.  
> **Verify only** — Uses the exception permitting SHA-1 verification but not generation.  
> **Verify only\*** — May fall back to SHA-1 verification if SHA-256 negotiation failed, but typically will not use SHA-1.

Source: [OpenSSL FIPS 140-3 Announcement](https://openssl-library.org/post/2025-03-11-fips-140-3/)

## Documentation

| Document | Description |
| -------- | ----------- |
| [REQUIREMENTS.md](REQUIREMENTS.md) | Software Requirements Specification (DI-IPSC-81433A) |
| [DESIGN.md](DESIGN.md) | System Design Document (DI-IPSC-81435A) |
| [DATABASE.md](DATABASE.md) | Database Design Description (DI-IPSC-81437A) |
| [CONFIGURATION.md](CONFIGURATION.md) | Server configuration guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment guide (Docker, Kubernetes, bare metal) |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Environment variable reference |
| [FILE.md](FILE.md) | Repository file structure reference |
| [RELEASE.md](RELEASE.md) | Release process and automation |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Code of conduct |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |

### External Documentation

| Resource | URL |
| -------- | --- |
| User & Administrator Docs | https://docs.cassproject.org |
| Developer Docs | https://devs.cassproject.org |
| CaSS Library (GitHub) | https://github.com/cassproject/cass-npm |
| CaSS Library (npm) | https://www.npmjs.com/package/cassproject |
| Docker Images | https://hub.docker.com/r/cassproject/cass |

## License

[Apache License 2.0](LICENSE)

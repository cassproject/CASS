# CONFIGURATION.md — Server Configuration Guide

Complete configuration reference for CaSS. See also [FILE.md](FILE.md) for file/directory structure and [ENVIRONMENT.md](ENVIRONMENT.md) for the full environment variable reference.

---

## Quick Start

The minimum configuration for a working CaSS deployment:

```yaml
environment:
  - CASS_LOOPBACK=http://cass/api/
  - ELASTICSEARCH_ENDPOINT=http://elasticsearch:9200
  - PORT=80
```

Everything else has sensible defaults. See the [docker-compose.yml](docker-compose.yml) for a complete example.

---

## Configuration Surfaces

CaSS is configured through three mechanisms:

| Mechanism | Location | Purpose |
|-----------|----------|---------|
| **Environment Variables** | Docker Compose `environment:` block | All runtime configuration — see [ENVIRONMENT.md](ENVIRONMENT.md) |
| **Persistent Volume (`etc/`)** | `/app/etc` (mapped as Docker volume) | Auto-generated keys, salts, and secrets — do not edit manually |
| **TLS Certificate Files** | `/app/ca.crt`, `/app/cass.crt`, `/app/cass.key` | TLS certificates — baked into image, replace via volume mounts |

---

## Persistent Volume — `etc/`

The `etc/` directory is mounted as a Docker volume and stores auto-generated cryptographic material. **These files are created on first startup** and should be preserved across container restarts.

| File | Purpose |
|------|---------|
| `skyId.pem` | Server identity private key — used for signing operations and admin authentication. |
| `skyId.secret` | Secret key for administrative endpoints (`/api/util/purge`, `/api/util/reindex`, etc.). |
| `skyId.salt` | Salt for cryptographic operations. |
| `skyId.username.public.salt` | Salt for username hashing in the identity system. |
| `skyId.password.public.salt` | Salt for password hashing in the identity system. |
| `skyId.secret.public.salt` | Salt for secret hashing. |
| `skyAdmin2.pem` | Secondary admin key. |
| `adapter.xapi.json` | xAPI adapter configuration (endpoint and auth). Overridden by `XAPI_ENDPOINT` / `XAPI_AUTH` env vars. |
| `adapter.case.private.pem` | Private key for IMS CASE adapter signatures. |
| `adapter.openbadges.private.pem` | Private key for Open Badges adapter signatures. |
| `xapiAdapter.pem` | xAPI adapter identity key. |
| `replicateAdapter.pem` | Replication adapter identity key. Overridden by `CASS_REPLICATION_PPK` env var. |

Any of these keys can instead be supplied as an environment variable named after the file without `.pem`, containing the PEM text: `skyAdmin2`, `xapiAdapter`, `replicateAdapter`, `adapter.asn.private`, `adapter.case.private`, `adapter.ceasn.private`, `adapter.openbadges.private`, `adapter.skos.private`. The variable takes precedence over the file.

> [!CAUTION]
> Losing the `etc/` volume means losing all server keys. Users will lose access to encrypted data and admin operations will require reconfiguration.

---

## Docker Deployments

### Available Images

| Compose File | Dockerfile | Base Image | Notes |
|---|---|---|---|
| [docker-compose.yml](docker-compose.yml) | [Dockerfile](docker/standalone/node/Dockerfile) | `node:24-slim` (Debian) | Default — FIPS OpenSSL 3.1.2 |
| [docker-compose-alpine.yml](docker-compose-alpine.yml) | [DockerfileAlpine](docker/standalone/node/DockerfileAlpine) | `node:24-alpine` | Smaller image, dual-version FIPS OpenSSL |
| [docker-compose-distroless.yml](docker-compose-distroless.yml) | [DockerfileDistroless](docker/standalone/node/DockerfileDistroless) | `gcr.io/distroless/nodejs24-debian12` | Minimal attack surface — no shell |
| [docker-compose-opensearch.yml](docker-compose-opensearch.yml) | Same as default | `node:24-slim` | Uses OpenSearch instead of Elasticsearch |

See [FILE.md](FILE.md#docker--build--compose) for detailed file descriptions.

### Volumes

| Volume | Container Path | Purpose |
|--------|---------------|---------|
| `etc` | `/app/etc` | Persistent server keys, salts, and adapter config |
| `esdata1` | `/usr/share/elasticsearch/data` | Elasticsearch data |

### Ports

| Port | Protocol | Service |
|------|----------|---------|
| `80` | HTTP | CaSS API + Editor UI |
| `443` | HTTPS | CaSS API + Editor UI (TLS-enabled service) |
| `9200` | HTTP | Elasticsearch (internal, not externally required) |

---

## Server

| Variable | Default | Purpose |
|----------|---------|---------|
| `CASS_LOOPBACK` | `http://localhost/api/` (`https://` when `HTTPS=true`) | URL CaSS uses to call its own API, and the server part of the IDs it generates. |
| `CASS_LOOPBACK_PROXY` | *(none)* | Externally visible endpoint to use instead of `CASS_LOOPBACK` when generating IDs, when CaSS sits behind a reverse proxy. |
| `CASS_EXTERNAL_ENDPOINT` | `CASS_LOOPBACK` | Endpoint used for the IDs of objects created during CTDL-ASN imports. |
| `CASS_BASE` | `""` | Path prefix for all routes (e.g. `/cass`). |
| `PORT` | `80` (`443` when `HTTPS=true`) | Port to listen on. |
| `MAX_CONNECTIONS` | *(unlimited)* | Maximum simultaneous connections. |
| `POST_MAX_SIZE` | `52428800` (50 MB) | Maximum POST body size, in bytes. |
| `VERSION` | *(package version)* | Version reported by `GET /api/ping`. |
| `DEFAULT_PLUGINS` | *(none)* | Plugins the editor should offer by default, reported by `GET /api/ping`. |
| `EPHEMERAL_CLEANUP_INTERVAL` | `60000` | Milliseconds between purges of expired ephemeral data. |
| `STATIC_NOAUTH` | *(none)* | `true` serves the static files (the editor) before the authentication middleware runs, so they load without authentication. |

### CORS

```yaml
environment:
  - CORS_ORIGINS=https://example.com,https://app.example.com   # Default: all origins
  - CORS_CREDENTIALS=true                                      # Send Access-Control-Allow-Credentials
```

`CORS_CREDENTIALS=true` also sets the OIDC session cookie to `SameSite=None` (otherwise `Lax`), so a page on another origin can use the session.

### Security Headers

```yaml
environment:
  - INCLUDE_SAMEORIGIN_IFRAME_HEADER=true          # X-Frame-Options: SAMEORIGIN
  - INCLUDE_STRICT_TRANSPORT_SECURITY_HEADER=true  # Strict-Transport-Security: max-age=31536000 (HTTPS or X-Forwarded-Proto: https only)
  - INCLUDE_MIME_NOSNIFF_HEADER=true               # X-Content-Type-Options: nosniff
```

### Outgoing Requests

```yaml
environment:
  - FETCH_ALLOW_LIST=https://credreg.net/*,https://lrs.example.com/xapi/statements
```

When set, CaSS only makes outgoing HTTP requests to these comma-separated URLs; an entry ending in `*` allows any URL that starts with it. Other requests fail and are logged as `FetchBlocked`. Include `CASS_LOOPBACK`, Elasticsearch, and every adapter's endpoint.

---

## TLS / HTTPS Configuration

Enable HTTPS by setting these environment variables:

```yaml
environment:
  - HTTPS=true
  - HTTP2_SERVER=true          # Optional, defaults to true
  - NODE_EXTRA_CA_CERTS=ca.crt # Trust custom CA
```

The server expects these files in the working directory (`/app/`):

| File | Purpose |
|------|---------|
| `cass.key` | Server private key |
| `cass.crt` | Server certificate |
| `ca.crt` | Certificate authority certificate |

To use custom certificates, mount them as volumes:

```yaml
volumes:
  - ./my-certs/server.key:/app/cass.key:ro
  - ./my-certs/server.crt:/app/cass.crt:ro
  - ./my-certs/ca.crt:/app/ca.crt:ro
```

### Client Certificate Authentication

```yaml
environment:
  - HTTPS=true
  - REQUEST_CLIENT_SIDE_CERTIFICATE=true   # Request client certs
  - CLIENT_SIDE_CERTIFICATE_ONLY=false     # true = reject without cert
  - CRL_LISTS=true                         # Enable CRL checking
```

CRL files go in `src/main/server/crl/*.pem`.

---

## Authentication Modes

CaSS supports multiple authentication backends. Only one should be active at a time.

### Key-Based (Default)

No configuration needed. Uses CaSS's built-in key-based identity system via signature sheets. Managed through [skyId.js](FILE.md#srcmainserver--core-modules).

### OIDC / SSO (Keycloak, etc.)

```yaml
environment:
  - CASS_OIDC_ENABLED=true
  - CASS_OIDC_ISSUER_BASE_URL=http://keycloak:8080/auth/realms/master/
  - CASS_OIDC_CLIENT_ID=cass
  - CASS_OIDC_SECRET=your-client-secret
  - CASS_OIDC_BASE_URL=http://localhost/
  - CASS_SESSION_MAX_AGE=3600
  - CASS_SESSION_VALIDATION_INTERVAL=300
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `CASS_OIDC_CLIENT_SECRET` | *(none)* | Client secret for confidential clients. When set, the authorization code flow is used by default. |
| `CASS_OIDC_SECRET` | *(built-in)* | Signs the session cookie (and validates HS256 bearer tokens). Not the client secret. |
| `CASS_OIDC_RESPONSE_TYPE` | `id_token` (`code` with a client secret) | `id_token`, `code`, or `code id_token`. |
| `CASS_OIDC_SCOPE` | `openid profile email` | Space-separated scopes to request. |
| `CASS_OIDC_AUDIENCE` | `account` | Audience required of bearer tokens. |
| `CASS_OIDC_ALG` | `HS256` | Signing algorithm expected of bearer tokens. |
| `CASS_OIDC_EXTERNAL_ISSUER_URL` | *(none)* | Issuer URL as browsers and API clients see it, when it differs from `CASS_OIDC_ISSUER_BASE_URL` (e.g. Keycloak reached by an internal hostname). Discovery URLs are rewritten to it and tokens from either issuer are accepted. |
| `CASS_SESSION_MAX_AGE` | *(library default, 1 day)* | Seconds a session stays valid without activity; each request extends it (rolling duration). |
| `CASS_SESSION_VALIDATION_INTERVAL` | *(none)* | Seconds between checks of the session against the provider's userinfo endpoint; a failed check logs the user out. Applies when `CASS_IP_ALLOW` or `CASS_SSO_ACCOUNT_REQUIRED` is set. |

### JWT Bearer Token

```yaml
environment:
  - CASS_JWT_ENABLED=true
  - CASS_JWT_SECRET=your-signing-secret
  - CASS_JWT_ALGORITHM=HS256
  - CASS_JWT_SESSION_ENABLED=true   # Optional: keep a 2-hour in-memory session per client
```

### Platform One (P1)

```yaml
environment:
  - CASS_PLATFORM_ONE_AUTH_ENABLED=true
  - CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER=true
  - CASS_PLATFORM_ONE_ISSUER=https://login.dso.mil/auth/realms/baby-yoda
```

| Variable | Purpose |
|----------|---------|
| `CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT` / `CASS_PLATFORM_ONE_CLIENT` | `true` requires the token's `azp` to equal `CASS_PLATFORM_ONE_CLIENT`. |
| `CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME` | `true` skips the token issue-time check. |
| `CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS` | `true` replaces user names with generated adjective-noun names. |
| `CASS_PLATFORM_ONE_AUTH_ADJECTIVES` / `CASS_PLATFORM_ONE_AUTH_NOUNS` | Comma-separated word lists for those generated names. |

See [ENVIRONMENT.md](ENVIRONMENT.md#platform-one-authentication) for details.

---

## Adapter Configuration

Adapters provide interoperability with external standards. They are loaded by default and can be disabled:

```yaml
environment:
  - DISABLED_ADAPTERS=ollama,pna,scd
```

### xAPI

```yaml
environment:
  - XAPI_ENABLED=true
  - XAPI_ENDPOINT=https://lrs.example.com/xapi
  - XAPI_AUTH=Basic dXNlcjpwYXNz
```

Or configure via the file `etc/adapter.xapi.json`:

```json
{
  "xapiEndpoint": "https://lrs.example.com/xapi",
  "xapiAuth": "Basic dXNlcjpwYXNz"
}
```

Environment variables override the config file. See [xapi.js](FILE.md#srcmainservercartridgeadapter--protocol-adapters) for details.

To read statements from other LRSs as well, add one `XAPI_CONFIG_<name>` variable per LRS (any suffix), each a JSON object:

```yaml
environment:
  - XAPI_CONFIG_LMS={"xapiEndpoint":"https://lms.example.com/xapi/","xapiHostname":"lms.example.com","xapiAuth":"Basic dXNlcjpwYXNz"}
  - XAPI_STATEMENT_COUNT=10        # Statements fetched per request (default 10)
```

When the LRSs require OIDC tokens instead of a fixed `xapiAuth`, CaSS obtains one and uses it for every `XAPI_CONFIG_*` LRS:

| Variable | Default | Purpose |
|----------|---------|---------|
| `OIDC_CLIENT_ENDPOINT` | *(none)* | OIDC issuer to discover. Enables token authentication. |
| `OIDC_CLIENT_CLIENT_ID` | *(none)* | Client ID. |
| `OIDC_CLIENT_CLIENT_SECRET` | *(none)* | Client secret. |
| `OIDC_CLIENT_REDIRECT_URI` | *(none)* | Redirect URI registered for the client. |
| `OIDC_CLIENT_RESPONSE_TYPE` | `code` | Response type. |

### PNA (AWS S3)

```yaml
environment:
  - PNA_DIRECTORY=directory-id
  - PNA_DIRECTORY_NAME=My Directory
  - PNA_AWS_REGION=us-east-1
  - PNA_AWS_BUCKET=my-pna-bucket
  - PNA_AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
  - PNA_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  - PNA_PROVIDER_META_MODEL=...   # Optional: providerMetaModel in published PNA records
  - PNA_REGISTRY_RIGHTS=...       # Optional: registryRights in published PNA records
```

### Replication

```yaml
environment:
  - CASS_REPLICATION_ENDPOINT=https://remote-cass.example.com/api/
  - CASS_REPLICATION_PPK=-----BEGIN RSA PRIVATE KEY-----...
```

---

## UI Customization

### Banner

```yaml
environment:
  - CASS_BANNER_MESSAGE=CUI
  - CASS_BANNER_TEXT_COLOR=white
  - CASS_BANNER_BACKGROUND_COLOR=red
```

### Message of the Day

```yaml
environment:
  - MOTD_TITLE=System Notice
  - MOTD_MESSAGE=Scheduled maintenance this weekend.
```

### Disable Editor

```yaml
environment:
  - DISABLED_EDITOR=true
```

---

## Profile Computation

```yaml
environment:
  - PROFILE_PPK=-----BEGIN RSA PRIVATE KEY-----...
  - PROFILE_CACHE=true
  - PROFILE_TTL=2592000000          # 30 days in ms
  - WORKER_MAX_MEMORY=1024          # MB per worker
  - AUTO_CALCULATE_PROFILES=true    # Recompute profiles of active people in the background
  - PROFILE_AVOID_OUTSIDE_FRAMEWORKS=true   # Don't pull in frameworks related to the one being computed
  - PROFILE_REPOSITORY_CACHE=true   # Cache repository lookups during computation
```

See [ENVIRONMENT.md](ENVIRONMENT.md#profile-processor) for all profile options.

---

## Logging & Monitoring

### Audit Logging

```yaml
environment:
  - LOG_HEADERS=true                                # Include HTTP headers in logs
  - LOG_FILTERED_CATEGORIES=NETWORK                 # Suppress categories
  - LOG_FILTERED_SEVERITIES=DEBUG,INFO              # Suppress severities
  - LOG_FILTERED_MESSAGES=CassHttpGetSuccess        # Suppress message codes
  - PRODUCTION=true                                 # Write logs to file
```

### Email Alerts

```yaml
environment:
  - SMTP_HOST=smtp.example.com
  - SMTP_PORT=587
  - SMTP_USER=alerts@example.com
  - SMTP_PASS=password
  - SMTP_RECIPIENTS=admin@example.com,ops@example.com
```

When configured, CaSS sends email alerts for disk space warnings and critical errors.

---

## Access Control

### IP Allowlisting

```yaml
environment:
  - CASS_IP_ALLOW=10.0.0.0/8,192.168.1.0/24
  - CASS_IP_DENIED_REDIRECT=https://example.com/access-denied
```

### Requiring a Signed-In Account

```yaml
environment:
  - CASS_SSO_ACCOUNT_REQUIRED=1
```

Only requests from users with at least this many identities (normally an SSO login gives one) get through; others are denied like requests from outside `CASS_IP_ALLOW`. It can be combined with `CASS_IP_ALLOW`: a request passes if either allows it. Login, logout, the SSO callback, `GET /api/ping` and the OAuth discovery documents stay open, and OAuth bearer tokens from the configured issuer are accepted.

| Variable | Purpose |
|----------|---------|
| `CASS_API_KEY` | A request whose `Authorization` header equals this value passes the IP / account checks (for server-to-server clients). |

### Refusing Anonymous Changes

```yaml
environment:
  - NO_PUBLIC=true
```

Refuses (401) any request that would create, change or delete data without a signature sheet, i.e. from an anonymous or signed-out user: `POST`/`DELETE` `/api/data/…`, `/api/sky/repo/multiPut`, `/api/sky/repo/multiDelete`, and the CTDL-ASN, ASN and CASE imports. Reads are unaffected, and so is account creation (`/api/sky/id/…`). In the editor, signed-out users can browse but not save.

### Rate Limiting

```yaml
environment:
  - CASS_RATE_LIMIT=true
  - CASS_RATE_LIMIT_WINDOW_MS=900000   # Default 15 minutes
  - CASS_RATE_LIMIT_MAX=100            # Requests per IP per window (default 100)
```

Limits requests per client IP through the authentication middleware, against brute-force token attempts.

### Signatures and Replay

| Variable | Purpose |
|----------|---------|
| `REJECT_SHA1` | If set, rejects requests signed only with SHA-1 signatures (SHA-256 required). |
| `ALLOW_SANCTIONED_REPLAY` | `true` lets replication / log replays marked as sanctioned use expired signature sheets, and stops CaSS re-saving them as a newer version when their version is already taken. |
| `INSECURE_SERVER_IS_ADMIN` | If set, the server's own `skyAdmin2` key is an admin and profile computation runs as it, so it can read and change all data. For isolated testing only. |

### Environment-Based Admin Grants

```yaml
environment:
  - AUTH_ALLOW_ENV_ADMINS=true
  - AUTH_ENV_ADMIN_EMAILS=admin@example.com,ops@example.com
```

### Federated Identity (Elastic Keystore)

```yaml
environment:
  - CASS_ELASTIC_KEYSTORE=true
  - CASS_ELASTIC_KEYSTORE_ENDPOINT=http://identity-server/api/
```

---

## Elasticsearch

CaSS requires Elasticsearch 8.x+ or OpenSearch. The compose files bundle an Elasticsearch instance.

```yaml
environment:
  - ELASTICSEARCH_ENDPOINT=http://elasticsearch:9200
  - ELASTICSEARCH_AUTHORIZATION=Basic dXNlcjpwYXNz   # Optional
  - MULTIPUT_BATCH_SIZE=100                          # Objects per bulk write in multiPut (default 100)
  - PERMANENT_MIGRATION_BATCH=100                    # Documents per batch when the startup migration reindexes `permanent`
  - PERMANENT_MIGRATION_TIMEOUT=36000                # Seconds that migration may run before CaSS starts without it
```

### Recommended ES Settings (set in compose)

```yaml
environment:
  - bootstrap.memory_lock=true
  - discovery.type=single-node
  - xpack.security.enabled=false
  - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
```

---

## Testing / Development Only

| Variable | Purpose |
|----------|---------|
| `KILL` | Exposes `GET /api/kill` to terminate the server |
| `AUTH_OVERRIDE` | JSON user object injected into all requests |
| `AUTH_OVERRIDE_KEY` | PEM private key for the override user |
| `VALIDATE_RESPONSES` | Enables `express-openapi-validator` middleware for response schema validation |
| `SKYREPO_DEBUG` | Verbose SkyRepo data layer logging |
| `HTTPS_REJECT_UNAUTHORIZED` | `false` accepts self-signed certificates on outgoing requests (when `HTTPS=true`); CaSS then sets Node's `NODE_TLS_REJECT_UNAUTHORIZED=0` |
| `NODEV` | Skip server startup in test harness (server already running) |

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
```

### JWT Bearer Token

```yaml
environment:
  - CASS_JWT_ENABLED=true
  - CASS_JWT_SECRET=your-signing-secret
  - CASS_JWT_ALGORITHM=HS256
```

### Platform One (P1)

```yaml
environment:
  - CASS_PLATFORM_ONE_AUTH_ENABLED=true
  - CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER=true
  - CASS_PLATFORM_ONE_ISSUER=https://login.dso.mil/auth/realms/baby-yoda
```

See the full list of P1 variables in [ENVIRONMENT.md](ENVIRONMENT.md#platform-one-authentication).

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

### PNA (AWS S3)

```yaml
environment:
  - PNA_DIRECTORY=directory-id
  - PNA_DIRECTORY_NAME=My Directory
  - PNA_AWS_REGION=us-east-1
  - PNA_AWS_BUCKET=my-pna-bucket
  - PNA_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
  - PNA_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
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
| `HTTPS_REJECT_UNAUTHORIZED` | Accept self-signed certs on outgoing requests |
| `NODEV` | Skip server startup in test harness (server already running) |

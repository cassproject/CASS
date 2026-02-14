# CaSS Environment Variables

This document describes every environment variable used by CaSS.

---

## Core Server

| Variable | Default | Description |
|---|---|---|
| `PORT` | `80` (HTTP) / `443` (HTTPS) | Port the server listens on. |
| `CASS_LOOPBACK` | `http://localhost/api/` | The URL CaSS uses to talk to itself. Must include the trailing `/api/`. |
| `CASS_LOOPBACK_PROXY` | `null` | If set, CaSS treats this as its externally-visible endpoint (used when behind a reverse proxy). |
| `CASS_BASE` | `""` | Base URL prefix for all routes (e.g. `/cass`). |
| `CASS_EXTERNAL_ENDPOINT` | Value of `CASS_LOOPBACK` | External endpoint used when generating IDs for new objects (e.g. in CEASN exports). |
| `ELASTICSEARCH_ENDPOINT` | `http://localhost:9200` | Elasticsearch endpoint URL. |
| `ELASTICSEARCH_AUTHORIZATION` | *(none)* | If set, sent as the `Authorization` header on all requests to Elasticsearch. |
| `HTTPS` | `false` | Set to `true` to enable HTTPS mode. Expects `cass.key`, `cass.crt`, and `ca.crt` files. |
| `HTTP2_SERVER` | `true` | Set to `false` to use HTTPS/1.1 instead of HTTP/2 (SPDY) when `HTTPS=true`. |
| `MAX_CONNECTIONS` | *(unlimited)* | Maximum simultaneous connections the server will accept. |
| `KILL` | *(none)* | If set, exposes a `GET /api/kill` endpoint that terminates the server process. Used for testing. |
| `POST_MAX_SIZE` | *(default)* | Maximum request body size in bytes for POST requests. |
| `SKYREPO_DEBUG` | `false` | Enables debug logging for the SkyRepo data layer. |
| `PRODUCTION` | *(none)* | Set to `true` to enable production-mode logging (writes to file in addition to stdout). |

---

## CORS

| Variable | Default | Description |
|---|---|---|
| `CORS_ORIGINS` | *(none — all origins allowed)* | Comma-separated list of allowed CORS origins (e.g. `https://example.com,https://app.example.com`). |
| `CORS_CREDENTIALS` | *(none)* | Set to `true` to include `Access-Control-Allow-Credentials` in CORS responses. Also affects OIDC cookie `SameSite` policy. |

---

## Security Headers

| Variable | Default | Description |
|---|---|---|
| `INCLUDE_SAMEORIGIN_IFRAME_HEADER` | *(none)* | Set to `true` to add `X-Frame-Options: SAMEORIGIN` to all responses. |
| `INCLUDE_STRICT_TRANSPORT_SECURITY_HEADER` | *(none)* | Set to `true` to add `Strict-Transport-Security: max-age=31536000` to HTTPS responses. |
| `INCLUDE_MIME_NOSNIFF_HEADER` | *(none)* | Set to `true` to add `X-Content-Type-Options: nosniff` to all responses. |

---

## TLS / Client Certificates

These only apply when `HTTPS=true`.

| Variable | Default | Description |
|---|---|---|
| `REQUEST_CLIENT_SIDE_CERTIFICATE` | `false` | Set to `true` to request client certificates during TLS handshake. |
| `CLIENT_SIDE_CERTIFICATE_ONLY` | `false` | Set to `true` to reject connections that don't provide a valid client certificate. |
| `CRL_LISTS` | *(none)* | Set to `true` to load Certificate Revocation Lists from `src/main/server/crl/*.pem`. |
| `HTTPS_REJECT_UNAUTHORIZED` | *(none)* | Set to `false` to accept self-signed certificates on outgoing HTTPS requests. **Testing only.** |

---

## OIDC (OpenID Connect / SSO)

| Variable | Default | Description |
|---|---|---|
| `CASS_OIDC_ENABLED` | `false` | Set to any truthy value to enable OpenID Connect authentication. |
| `CASS_OIDC_ISSUER_BASE_URL` | `https://dev.keycloak.eduworks.com/auth/realms/test-realm/` | The OIDC issuer/realm URL (e.g. your Keycloak realm URL). |
| `CASS_OIDC_BASE_URL` | `http://localhost/` | The base URL of the CaSS application (used for login/logout redirects). |
| `CASS_OIDC_CLIENT_ID` | `cass` | The OIDC client ID. |
| `CASS_OIDC_SECRET` | *(built-in default)* | The OIDC client secret. |
| `CASS_OIDC_SCOPE` | `openid profile email` | Space-separated OIDC scopes to request. |

---

## JWT Authentication

| Variable | Default | Description |
|---|---|---|
| `CASS_JWT_ENABLED` | *(none)* | Set to any truthy value to enable JWT bearer token authentication. |
| `CASS_JWT_SECRET` | `cass` | Secret used to verify JWT signatures. |
| `CASS_JWT_ALGORITHM` | `HS256` | JWT signing algorithm. |

---

## Platform One Authentication

| Variable | Default | Description |
|---|---|---|
| `CASS_PLATFORM_ONE_AUTH_ENABLED` | *(none)* | Set to any truthy value to enable Platform One (P1) auth middleware. |
| `CASS_PLATFORM_ONE_AUTH_ADJECTIVES` | *(none)* | Comma-separated list of adjective claim values for P1 authorization. |
| `CASS_PLATFORM_ONE_AUTH_NOUNS` | *(none)* | Comma-separated list of noun claim values for P1 authorization. |
| `CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER` | *(none)* | Set to `true` to validate the JWT issuer claim. |
| `CASS_PLATFORM_ONE_ISSUER` | *(none)* | Expected issuer value when `CHECK_ISSUER` is enabled. |
| `CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT` | *(none)* | Set to `true` to validate the JWT client/audience claim. |
| `CASS_PLATFORM_ONE_CLIENT` | *(none)* | Expected client value when `CHECK_CLIENT` is enabled. |
| `CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME` | *(none)* | Set to `true` to skip JWT `iat`/`nbf` time validation. |
| `CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS` | *(none)* | Set to `true` to anonymize user identity in P1 auth. |

---

## Access Control

| Variable | Default | Description |
|---|---|---|
| `AUTH_ALLOW_ENV_ADMINS` | *(none)* | Set to `true` to allow admin privileges for emails specified via environment variables (instead of only database-stored admins). |
| `AUTH_ENV_ADMIN_EMAILS` | *(none)* | Comma-separated list of email addresses granted admin privileges when `AUTH_ALLOW_ENV_ADMINS=true`. |
| `AUTH_OVERRIDE` | *(none)* | JSON string representing a user object to inject into all requests. **Testing/development only.** |
| `AUTH_OVERRIDE_KEY` | *(none)* | PEM-encoded private key associated with the `AUTH_OVERRIDE` user. |
| `CASS_IP_ALLOW` | *(none)* | Comma-separated list of allowed IP addresses/ranges. Requests from other IPs are denied. |
| `CASS_IP_DENIED_REDIRECT` | *(none)* | URL to redirect to when an IP is denied access. |
| `CASS_SSO_ACCOUNT_REQUIRED` | *(none)* | Minimum number of SSO identity records a user must have to be permitted access. |
| `STATIC_NOAUTH` | *(none)* | Set to `true` to serve static files without requiring authentication. Changes the auth module load order. |
| `ALLOW_SANCTIONED_REPLAY` | *(none)* | Set to `true` to allow sanctioned replay of data operations (for replication/migration). |
| `REJECT_SHA1` | *(none)* | If set, rejects cryptographic operations that use SHA-1 signatures. |

---

## Elastic Keystore (Federated Identity)

| Variable | Default | Description |
|---|---|---|
| `CASS_ELASTIC_KEYSTORE` | *(none)* | Set to `true` to enable federated identity key storage via a remote CaSS instance. |
| `CASS_ELASTIC_KEYSTORE_ENDPOINT` | `http://identity/api/` | Endpoint of the remote CaSS identity server. |

---

## UI Configuration

### Banner

| Variable | Default | Description |
|---|---|---|
| `CASS_BANNER_MESSAGE` | *(none)* | Text displayed in a persistent banner at the top and bottom of the UI. |
| `CASS_BANNER_TEXT_COLOR` | *(none)* | CSS color value for banner text (e.g. `red`, `#ff0000`). |
| `CASS_BANNER_BACKGROUND_COLOR` | *(none)* | CSS color value for banner background (e.g. `yellow`, `#ffff00`). |

### Message of the Day

| Variable | Default | Description |
|---|---|---|
| `MOTD_TITLE` | *(none)* | Title displayed in the MOTD modal dialog. |
| `MOTD_MESSAGE` | *(none)* | Body text/HTML displayed in the MOTD modal dialog. Requires `MOTD_TITLE`. |

### Other UI

| Variable | Default | Description |
|---|---|---|
| `DISABLED_EDITOR` | *(none)* | Set to `true` to disable serving the built-in CaSS editor webapp. |
| `DISABLED_ADAPTERS` | *(none)* | Comma-separated list of adapter names to disable (e.g. `ceasn,asn,case`). |
| `DEFAULT_PLUGINS` | *(none)* | Default plugins to advertise via the `/api/` ping endpoint. |

---

## SMTP (Email Notifications)

| Variable | Default | Description |
|---|---|---|
| `SMTP_HOST` | *(none)* | SMTP server hostname. Required to enable email notifications. |
| `SMTP_PORT` | `587` | SMTP server port. |
| `SMTP_USER` | *(none)* | SMTP authentication username. |
| `SMTP_PASS` | *(none)* | SMTP authentication password. |
| `SMTP_RECIPIENTS` | *(none)* | Comma-separated list of email addresses to receive server notifications (errors, disk warnings). |

---

## Logging

| Variable | Default | Description |
|---|---|---|
| `LOG_HEADERS` | *(none)* | If set, includes HTTP request headers in audit log entries. |
| `LOG_FILTERED_CATEGORIES` | *(none)* | Comma-separated list of log categories to suppress (e.g. `NETWORK,SYSTEM`). |
| `LOG_FILTERED_SEVERITIES` | *(none)* | Comma-separated list of log severities to suppress (e.g. `DEBUG,INFO`). |
| `LOG_FILTERED_MESSAGES` | *(none)* | Comma-separated list of log message substrings to suppress. |

---

## Profile Processor

| Variable | Default | Description |
|---|---|---|
| `PROFILE_PPK` | *(none)* | PEM-encoded private key used by the profile computation agent. |
| `PROFILE_CACHE` | *(none)* | Set to `true` to enable in-memory caching of computed profiles. |
| `PROFILE_TTL` | `2592000000` (30 days in ms) | Time-to-live for cached profiles in milliseconds. |
| `PROFILE_REPOSITORY_CACHE` | `false` | Enables repository-level caching during profile computation. |
| `WORKER_MAX_MEMORY` | `1024` | Maximum memory (in MB) allocated to each profile computation worker thread. |

---

## xAPI Adapter

| Variable | Default | Description |
|---|---|---|
| `XAPI_ENDPOINT` | *(config file)* | xAPI Learning Record Store endpoint URL. |
| `XAPI_AUTH` | *(config file)* | Authorization header value for xAPI LRS requests. |
| `XAPI_ENABLED` | *(none)* | Set to any truthy value to enable the xAPI adapter. |
| `XAPI_DEBUG` | *(none)* | If set, enables verbose debug logging for xAPI operations. |
| `XAPI_STATEMENT_COUNT` | `10` | Number of xAPI statements to fetch per request. |

### xAPI OIDC Client

| Variable | Default | Description |
|---|---|---|
| `OIDC_CLIENT_ENDPOINT` | *(none)* | OIDC discovery endpoint for xAPI client authentication. |
| `OIDC_CLIENT_CLIENT_ID` | *(none)* | Client ID for xAPI OIDC authentication. |
| `OIDC_CLIENT_CLIENT_SECRET` | *(none)* | Client secret for xAPI OIDC authentication. |
| `OIDC_CLIENT_REDIRECT_URI` | *(none)* | Redirect URI for xAPI OIDC authentication. |
| `OIDC_CLIENT_RESPONSE_TYPE` | `code` | OIDC response type for xAPI client. |

---

## Replication

| Variable | Default | Description |
|---|---|---|
| `CASS_REPLICATION_PPK` | *(auto-generated)* | PEM-encoded private key used for authenticating replication operations. |
| `CASS_REPLICATION_ENDPOINT` | *(none)* | Endpoint of the remote CaSS server to replicate data to/from. |

---

## PNA (Provider Network Adapter)

| Variable | Default | Description |
|---|---|---|
| `PNA_DIRECTORY` | `""` | PNA directory ID. |
| `PNA_DIRECTORY_NAME` | `""` | PNA directory display name. |
| `PNA_PROVIDER_META_MODEL` | `""` | PNA provider meta model identifier. |
| `PNA_REGISTRY_RIGHTS` | `""` | PNA registry rights information. |
| `PNA_AWS_REGION` | `""` | AWS region for PNA S3 operations. |
| `PNA_AWS_BUCKET` | `""` | AWS S3 bucket name for PNA. |
| `PNA_AWS_ACCESS_KEY_ID` | `""` | AWS access key ID for PNA S3. |
| `PNA_AWS_SECRET_ACCESS_KEY` | `""` | AWS secret access key for PNA S3. |

---

## Batch Processing

| Variable | Default | Description |
|---|---|---|
| `MULTIPUT_BATCH_SIZE` | `100` | Number of records to process per batch during bulk put operations. |

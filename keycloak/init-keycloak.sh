#!/bin/sh
# ------------------------------------------------------------------
# Keycloak Initialization Script for CaSS MCP OAuth
#
# This script runs after Keycloak starts and idempotently configures:
#   1. Access token lifespan (1 hour)
#   2. Admin user email (required for signature sheet creation)
#   3. The 'cass' OIDC client
#   4. MCP-compatible client registration policies
#
# Dependencies: curl, sed (available in curlimages/curl)
# ------------------------------------------------------------------

KC_URL="${KEYCLOAK_URL:-http://localhost:8080}"
KC_ADMIN="${KEYCLOAK_ADMIN:-admin}"
KC_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-password}"
REALM="master"

echo "[init-keycloak] Waiting for Keycloak to be ready..."
TRIES=0
until curl -sf "${KC_URL}/realms/${REALM}" > /dev/null 2>&1; do
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -gt 60 ]; then
    echo "[init-keycloak] ERROR: Keycloak did not become ready within 120s."
    exit 1
  fi
  sleep 2
done
echo "[init-keycloak] Keycloak is ready."

# Helper: extract a JSON string value by key (basic, no jq needed)
json_value() {
  echo "$1" | sed -n "s/.*\"$2\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1
}

# Get admin token
TOKEN_RESPONSE=$(curl -sf -X POST "${KC_URL}/realms/${REALM}/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=${KC_ADMIN}" \
  -d "password=${KC_PASSWORD}" \
  -d "grant_type=password")

TOKEN=$(json_value "$TOKEN_RESPONSE" "access_token")

if [ -z "$TOKEN" ]; then
  echo "[init-keycloak] ERROR: Could not obtain admin token."
  exit 1
fi
echo "[init-keycloak] Obtained admin token."

# -------------------------------------------------------------------
# 1. Set access token lifespan to 1 hour (3600s)
# -------------------------------------------------------------------
echo "[init-keycloak] Setting access token lifespan to 3600s..."
HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" -X PUT "${KC_URL}/admin/realms/${REALM}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"accessTokenLifespan": 3600}')
echo "[init-keycloak]   -> HTTP ${HTTP_CODE}"

# -------------------------------------------------------------------
# 2. Set admin user email (needed for CaSS signature sheet creation)
# -------------------------------------------------------------------
echo "[init-keycloak] Setting admin user email..."
USERS_JSON=$(curl -sf "${KC_URL}/admin/realms/${REALM}/users?username=${KC_ADMIN}&exact=true" \
  -H "Authorization: Bearer ${TOKEN}")

# Extract first user ID
ADMIN_USER_ID=$(echo "$USERS_JSON" | sed -n 's/.*\[{[^}]*"id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

if [ -n "$ADMIN_USER_ID" ]; then
  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" -X PUT "${KC_URL}/admin/realms/${REALM}/users/${ADMIN_USER_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@admin.com", "emailVerified": true, "firstName": "Admin", "lastName": "Account"}')
  echo "[init-keycloak]   -> HTTP ${HTTP_CODE} (user: ${ADMIN_USER_ID})"
else
  echo "[init-keycloak]   SKIP (admin user not found)"
fi

# -------------------------------------------------------------------
# 3. Create or update the 'cass' OIDC client
# -------------------------------------------------------------------
echo "[init-keycloak] Checking for 'cass' client..."
CLIENTS_JSON=$(curl -sf "${KC_URL}/admin/realms/${REALM}/clients?clientId=cass" \
  -H "Authorization: Bearer ${TOKEN}")

CASS_CLIENT_UUID=$(echo "$CLIENTS_JSON" | sed -n 's/.*\[{[^}]*"id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

CASS_CLIENT_JSON='{
  "clientId": "cass",
  "name": "CaSS Application",
  "enabled": true,
  "publicClient": true,
  "directAccessGrantsEnabled": true,
  "standardFlowEnabled": true,
  "implicitFlowEnabled": true,
  "rootUrl": "http://localhost",
  "baseUrl": "/",
  "redirectUris": ["http://localhost/*", "http://localhost:80/*"],
  "webOrigins": ["http://localhost"],
  "protocol": "openid-connect",
  "fullScopeAllowed": true
}'

if [ -z "$CASS_CLIENT_UUID" ]; then
  echo "[init-keycloak]   Creating 'cass' client..."
  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" -X POST "${KC_URL}/admin/realms/${REALM}/clients" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "${CASS_CLIENT_JSON}")
  echo "[init-keycloak]   -> HTTP ${HTTP_CODE} (created)"
else
  echo "[init-keycloak]   Updating 'cass' client (uuid: ${CASS_CLIENT_UUID})..."
  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" -X PUT "${KC_URL}/admin/realms/${REALM}/clients/${CASS_CLIENT_UUID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "${CASS_CLIENT_JSON}")
  echo "[init-keycloak]   -> HTTP ${HTTP_CODE} (updated)"
fi

# -------------------------------------------------------------------
# 4. Update client registration policies for MCP dynamic registration
# -------------------------------------------------------------------
echo "[init-keycloak] Configuring client registration policies..."

COMPONENTS=$(curl -sf "${KC_URL}/admin/realms/${REALM}/components?type=org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy" \
  -H "Authorization: Bearer ${TOKEN}")

# -- 4a. Update "Allowed Client Scopes" policy for anonymous registrations
# Find the component ID by matching name + subType
ALLOWED_SCOPES_ID=""
# Parse components line-by-line looking for the right one
TEMP_FILE=$(mktemp)
echo "$COMPONENTS" > "$TEMP_FILE"

# Use a simple approach: iterate through components by splitting on {"id"
COMPONENT_IDS=""
CURRENT_ID=""
CURRENT_NAME=""
CURRENT_SUBTYPE=""

# Extract all anonymous Allowed Client Scopes component IDs
# We use grep + sed since we don't have jq
for id in $(echo "$COMPONENTS" | grep -o '"id":"[^"]*"' | sed 's/"id":"//;s/"//g'); do
  BLOCK=$(echo "$COMPONENTS" | grep -o "{[^}]*\"id\":\"${id}\"[^}]*}")
  NAME_MATCH=$(echo "$BLOCK" | grep -o '"name":"Allowed Client Scopes"' || true)
  SUBTYPE_MATCH=$(echo "$BLOCK" | grep -o '"subType":"anonymous"' || true)
  if [ -n "$NAME_MATCH" ] && [ -n "$SUBTYPE_MATCH" ]; then
    ALLOWED_SCOPES_ID="$id"
    break
  fi
done

if [ -n "$ALLOWED_SCOPES_ID" ]; then
  echo "[init-keycloak]   Updating Allowed Client Scopes (${ALLOWED_SCOPES_ID})..."
  EXISTING=$(curl -sf "${KC_URL}/admin/realms/${REALM}/components/${ALLOWED_SCOPES_ID}" \
    -H "Authorization: Bearer ${TOKEN}")
  # Replace the config values using sed
  UPDATED=$(echo "$EXISTING" | sed \
    -e 's/"allowed-client-scopes":\[[^]]*\]/"allowed-client-scopes":["profile","email","offline_access","address","phone"]/' \
    -e 's/"allow-default-scopes":\[[^]]*\]/"allow-default-scopes":["true"]/')
  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" -X PUT "${KC_URL}/admin/realms/${REALM}/components/${ALLOWED_SCOPES_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "${UPDATED}")
  echo "[init-keycloak]   -> HTTP ${HTTP_CODE}"
else
  echo "[init-keycloak]   SKIP (Allowed Client Scopes policy not found)"
fi

# -- 4b. Update "Trusted Hosts" policy for anonymous registrations
TRUSTED_HOSTS_ID=""
for id in $(echo "$COMPONENTS" | grep -o '"id":"[^"]*"' | sed 's/"id":"//;s/"//g'); do
  BLOCK=$(echo "$COMPONENTS" | grep -o "{[^}]*\"id\":\"${id}\"[^}]*}")
  NAME_MATCH=$(echo "$BLOCK" | grep -o '"name":"Trusted Hosts"' || true)
  SUBTYPE_MATCH=$(echo "$BLOCK" | grep -o '"subType":"anonymous"' || true)
  if [ -n "$NAME_MATCH" ] && [ -n "$SUBTYPE_MATCH" ]; then
    TRUSTED_HOSTS_ID="$id"
    break
  fi
done

if [ -n "$TRUSTED_HOSTS_ID" ]; then
  echo "[init-keycloak]   Updating Trusted Hosts (${TRUSTED_HOSTS_ID})..."
  EXISTING=$(curl -sf "${KC_URL}/admin/realms/${REALM}/components/${TRUSTED_HOSTS_ID}" \
    -H "Authorization: Bearer ${TOKEN}")
  UPDATED=$(echo "$EXISTING" | sed \
    -e 's/"trusted-hosts":\[[^]]*\]/"trusted-hosts":["localhost","127.0.0.1","host.docker.internal"]/' \
    -e 's/"host-sending-registration-request-must-match":\[[^]]*\]/"host-sending-registration-request-must-match":["false"]/' \
    -e 's/"client-uris-must-match":\[[^]]*\]/"client-uris-must-match":["true"]/')
  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" -X PUT "${KC_URL}/admin/realms/${REALM}/components/${TRUSTED_HOSTS_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "${UPDATED}")
  echo "[init-keycloak]   -> HTTP ${HTTP_CODE}"
else
  echo "[init-keycloak]   SKIP (Trusted Hosts policy not found)"
fi

rm -f "$TEMP_FILE"
echo "[init-keycloak] Keycloak initialization complete."

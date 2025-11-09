#!/bin/sh
set -e

CONFIG_PATH="/usr/share/nginx/html/config.js"

escape_js_string() {
    # Escape backslashes and double quotes to keep the JS assignment valid.
    printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

cat > "$CONFIG_PATH" <<EOF
window.__APP_CONFIG__ = {
    keycloakUrl: "$(escape_js_string "${KEYCLOAK_URL:-}")",
    keycloakRealm: "$(escape_js_string "${KEYCLOAK_REALM:-}")",
    keycloakClientId: "$(escape_js_string "${KEYCLOAK_CLIENT_ID:-}")",
    apiBaseUrl: "$(escape_js_string "${API_BASE_URL:-}")"
};
EOF

echo "Runtime config generated at ${CONFIG_PATH}"

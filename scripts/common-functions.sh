#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}
export -f print_info

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}
export -f print_success

print_fail() {
    echo -e "${RED}❌ $1${NC}"
}
export -f print_fail

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}
export -f print_warning

print_section() {
    echo -e "${BLUE}🔧 $1${NC}"
    echo "$(printf '=%.0s' {1..60})"
}
export -f print_section

checkEnvironmentVariables() {
    local REQUIRED_ENV_VARS=$1
    for var in "${REQUIRED_ENV_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        print_fail "Environment variable '$var' is not set." 
        exit 1
    fi
    done
}

getKeycloakAdminAccessToken() {

    # Check that environment variable KC_BOOSTRAP_ADMIN_USERNAME, KC_BOOTSTRAP_ADMIN_PASSWORD and KC_BASE_URL are set
    if [ -z "$KC_BASE_URL" ] || [ -z "$KC_BOOTSTRAP_ADMIN_USERNAME" ] || [ -z "$KC_BOOTSTRAP_ADMIN_PASSWORD" ]; then
        echo "Ensure environment variables have been loaded via 'load-env-vars.sh' before invoking this function"
        exit 1
    fi

	# Variables
	CLIENT_ID=admin-cli
	GRANT_TYPE=password
	RETRIEVE_TOKEN_URL="$KC_BASE_URL/realms/master/protocol/openid-connect/token"

	ACCESS_TOKEN=$(curl -s -L -X POST "$RETRIEVE_TOKEN_URL" \
	-H 'Content-Type: application/x-www-form-urlencoded' \
	--data-urlencode "client_id=$CLIENT_ID" \
	--data-urlencode "username=$KC_BOOTSTRAP_ADMIN_USERNAME" \
	--data-urlencode "password=$KC_BOOTSTRAP_ADMIN_PASSWORD" \
	--data-urlencode "grant_type=$GRANT_TYPE" \
	| jq -r '.access_token')

	echo $ACCESS_TOKEN
}
export -f getKeycloakAdminAccessToken

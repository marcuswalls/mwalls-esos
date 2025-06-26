#!/bin/bash
#############################################################################################################
#   Update Keycloak with various settings that make development easier.
#############################################################################################################

# Load environment variables and common functions
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/load-env-vars.sh"
source "$SCRIPT_DIR/common-functions.sh"

# Check that required environment variables are set
REQUIRED_ENV_VARS=(
    "KC_BASE_URL" 
    "API_KEYCLOAK_REALM"
    "KC_BOOTSTRAP_ADMIN_USERNAME" 
    "KC_BOOTSTRAP_ADMIN_PASSWORD" 
)
checkEnvironmentVariables $REQUIRED_ENV_VARS

source "$SCRIPT_DIR/update-keycloak-urls.sh"
source "$SCRIPT_DIR/update-keycloak-tokens.sh"

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

# Initialize logging
LOG_NAMESPACE="keycloak"
init_log_counters "${LOG_NAMESPACE}"

print_banner "Keycloak Development Configuration Update"

# Source and execute update-keycloak-urls.sh
source "$SCRIPT_DIR/update-keycloak-urls.sh"
if ! run_keycloak_urls_update; then
    print_error "Client URL configuration failed" "${LOG_NAMESPACE}"
fi

# Source and execute update-keycloak-tokens.sh  
source "$SCRIPT_DIR/update-keycloak-tokens.sh"
if ! run_keycloak_tokens_update; then
    print_error "Token configuration failed" "${LOG_NAMESPACE}"
fi


# Print summary
print_log_summary "${LOG_NAMESPACE}"

# Overall status
errors=$(get_log_count "error" "${LOG_NAMESPACE}")
if [ $errors -gt 0 ]; then
    print_error "Some Keycloak configurations failed. Please check the errors above."
    exit 1
fi
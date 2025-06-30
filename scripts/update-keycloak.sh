#!/bin/bash
#############################################################################################################
#   Update Keycloak with various settings that make development easier.
#############################################################################################################

# Load environment variables and common functions
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/common-functions.sh"
load_environment_variables

# Check that required environment variables are set
REQUIRED_ENV_VARS=(
    "KC_BASE_URL" 
    "API_KEYCLOAK_REALM"
    "KC_BOOTSTRAP_ADMIN_USERNAME" 
    "KC_BOOTSTRAP_ADMIN_PASSWORD" 
)
check_environment_variables REQUIRED_ENV_VARS

# Initialize logging
LOG_NAMESPACE="${LOG_NAMESPACE:-keycloak}"
init_log_counters "${LOG_NAMESPACE}"

print_banner "Keycloak Development Configuration Update"

# Source and execute update-keycloak-urls.sh
source "$SCRIPT_DIR/update-keycloak-urls.sh"
if ! run_keycloak_urls_update; then
    log_error "Client URL configuration failed"
fi

# Source and execute update-keycloak-tokens.sh  
source "$SCRIPT_DIR/update-keycloak-tokens.sh"
if ! run_keycloak_tokens_update; then
    log_error "Token configuration failed"
fi


# Print summary
print_count_summary

# Overall status
errors=$(get_counter "ERROR")
if [ $errors -gt 0 ]; then
    log_error "Some Keycloak configurations failed. Please check the errors above."
    exit 1
fi
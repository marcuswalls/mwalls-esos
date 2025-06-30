#!/bin/bash
#############################################################################################################
#   Update Keycloak with various settings that make development easier.
#############################################################################################################

# Load environment variables and common functions
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/load-env-vars.sh"
source "$SCRIPT_DIR/common-functions.sh"

# Initialize logging
LOG_NAMESPACE="${LOG_NAMESPACE:-keycloak}"
init_log_counters "${LOG_NAMESPACE}"

# Function to check environment variables for tokens script
check_tokens_environment() {
    # Check that required environment variables are set
    REQUIRED_ENV_VARS=(
        "KC_BASE_URL" 
        "API_KEYCLOAK_REALM"
        "KC_BOOTSTRAP_ADMIN_USERNAME" 
        "KC_BOOTSTRAP_ADMIN_PASSWORD" 
    )
    checkEnvironmentVariables REQUIRED_ENV_VARS
}

# Main function for token updates
run_keycloak_tokens_update() {
    print_section "Updating Keycloak Token Settings"

    # Obtain an access token for Keycloak admin operations
    log_info "Getting Keycloak admin access token..."
    KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
    if [ -z "$KEYCLOAK_ADMIN_ACCESS_TOKEN" ]; then
        log_error "Failed to obtain Keycloak admin access token"
        return 1
    fi
    log_success "Successfully obtained admin token"
    echo ""

    # Get current realm configuration
    log_info "Getting current realm settings..."
    CURRENT_CONFIG=$(curl -s -X GET "${KC_BASE_URL}/admin/realms/${API_KEYCLOAK_REALM}" \
      -H "Authorization: Bearer ${KEYCLOAK_ADMIN_ACCESS_TOKEN}" \
      -H "Content-Type: application/json")

    if [ -z "$CURRENT_CONFIG" ]; then
        log_error "Failed to get realm configuration"
        return 1
    fi

    log_success "Retrieved current realm settings"
    echo ""

    # Extract current values
    CURRENT_ACCESS_TOKEN_LIFESPAN=$(echo "$CURRENT_CONFIG" | jq -r '.accessTokenLifespan // "null"')
    CURRENT_SSO_SESSION_IDLE=$(echo "$CURRENT_CONFIG" | jq -r '.ssoSessionIdleTimeout // "null"')
    CURRENT_SSO_SESSION_MAX=$(echo "$CURRENT_CONFIG" | jq -r '.ssoSessionMaxLifespan // "null"')
    CURRENT_OFFLINE_SESSION_IDLE=$(echo "$CURRENT_CONFIG" | jq -r '.offlineSessionIdleTimeout // "null"')
    CURRENT_REFRESH_TOKEN_MAX_REUSE=$(echo "$CURRENT_CONFIG" | jq -r '.refreshTokenMaxReuse // "null"')

    log_note "Current Settings:"
    log_note "  Access Token Lifespan: $CURRENT_ACCESS_TOKEN_LIFESPAN seconds"
    log_note "  SSO Session Idle: $CURRENT_SSO_SESSION_IDLE seconds"
    log_note "  SSO Session Max: $CURRENT_SSO_SESSION_MAX seconds"
    log_note "  Offline Session Idle: $CURRENT_OFFLINE_SESSION_IDLE seconds"
    log_note "  Refresh Token Max Reuse: $CURRENT_REFRESH_TOKEN_MAX_REUSE"
    log_note ""

    # Recommended development values (in seconds)
    ACCESS_TOKEN_LIFESPAN=14400        # 4 hours (4 * 60 * 60)
    SSO_SESSION_IDLE=28800             # 8 hours (8 * 60 * 60)  
    SSO_SESSION_MAX=43200              # 12 hours (12 * 60 * 60)
    OFFLINE_SESSION_IDLE=2592000       # 30 days (30 * 24 * 60 * 60)
    REFRESH_TOKEN_MAX_REUSE=0          # 0 = unlimited reuse

    log_note "New Settings:"
    log_note "  Access Token Lifespan: $ACCESS_TOKEN_LIFESPAN seconds (4 hours)"
    log_note "  SSO Session Idle: $SSO_SESSION_IDLE seconds (8 hours)"
    log_note "  SSO Session Max: $SSO_SESSION_MAX seconds (12 hours)"
    log_note "  Offline Session Idle: $OFFLINE_SESSION_IDLE seconds (30 days)"
    log_note "  Refresh Token Max Reuse: $REFRESH_TOKEN_MAX_REUSE (unlimited)"
    log_note ""

    # Create updated configuration
    UPDATED_CONFIG=$(echo "$CURRENT_CONFIG" | jq \
      --arg accessTokenLifespan "$ACCESS_TOKEN_LIFESPAN" \
      --arg ssoSessionIdleTimeout "$SSO_SESSION_IDLE" \
      --arg ssoSessionMaxLifespan "$SSO_SESSION_MAX" \
      --arg offlineSessionIdleTimeout "$OFFLINE_SESSION_IDLE" \
      --arg refreshTokenMaxReuse "$REFRESH_TOKEN_MAX_REUSE" \
      '.accessTokenLifespan = ($accessTokenLifespan | tonumber) |
       .ssoSessionIdleTimeout = ($ssoSessionIdleTimeout | tonumber) |
       .ssoSessionMaxLifespan = ($ssoSessionMaxLifespan | tonumber) |
       .offlineSessionIdleTimeout = ($offlineSessionIdleTimeout | tonumber) |
       .refreshTokenMaxReuse = ($refreshTokenMaxReuse | tonumber)')

    log_info "Changing token settings to developer friendly settings..."
    UPDATE_RESPONSE=$(curl -s -w "%{http_code}" -X PUT "${KC_BASE_URL}/admin/realms/${API_KEYCLOAK_REALM}" \
      -H "Authorization: Bearer ${KEYCLOAK_ADMIN_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$UPDATED_CONFIG")

    HTTP_CODE="${UPDATE_RESPONSE: -3}"
    if [ "$HTTP_CODE" != "204" ]; then
        log_error "Failed to update realm settings (HTTP $HTTP_CODE)"
        log_note "Response: ${UPDATE_RESPONSE%???}"
        return 1
    fi

    log_success "Successfully updated realm token lifespans!"
    echo ""
}

# Only run main function if script is executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_tokens_environment
    run_keycloak_tokens_update "$@"
fi

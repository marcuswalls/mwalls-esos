#!/bin/bash
#############################################################################################################
#   Update Keycloak client URLs, and CORS settings to make development easier.
#############################################################################################################

# Load environment variables and common functions
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/common-functions.sh"
load_environment_variables

# Initialize logging
LOG_NAMESPACE="${LOG_NAMESPACE:-keycloak}"
init_log_counters "${LOG_NAMESPACE}"

# Function to check environment variables for URLs script
check_urls_environment() {
    # Check that required environment variables are set
    REQUIRED_ENV_VARS=(
        "KC_BASE_URL" 
        "API_KEYCLOAK_REALM"
        "KC_BOOTSTRAP_ADMIN_USERNAME" 
        "KC_BOOTSTRAP_ADMIN_PASSWORD" 
    )
    check_environment_variables REQUIRED_ENV_VARS
}

get_client_config() {
    local realm="$1"
    local client_id="$2"
    
    curl -s -X GET "${KC_BASE_URL}/admin/realms/${realm}/clients?clientId=${client_id}" \
      -H "Authorization: Bearer ${KEYCLOAK_ADMIN_ACCESS_TOKEN}" | \
      jq '.[0]'
}

# Update client configuration
update_client_config() {
    local realm="$1"
    local client_uuid="$2"
    local updated_config="$3"
    
    local response=$(curl -s -w "%{http_code}" -X PUT "${KC_BASE_URL}/admin/realms/${realm}/clients/${client_uuid}" \
      -H "Authorization: Bearer ${KEYCLOAK_ADMIN_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$updated_config")
    
    local http_code="${response: -3}"
    if [ "$http_code" = "204" ]; then
        return 0
    else
        echo "HTTP $http_code: ${response%???}" >&2
        return 1
    fi
}

# Add URLs to array if not present (deduplication)
add_urls_to_array() {
    local current_array="$1"
    shift
    local new_urls=("$@")
    
    # Create a combined JSON array directly without bash array expansion
    local combined_json=$(jq -n \
        --argjson existing "$current_array" \
        --argjson new "$(printf '%s\n' "${new_urls[@]}" | jq -R . | jq -s .)" \
        '$existing + $new | unique | sort')
    
    echo "$combined_json"
}

# Update UK ESOS API client
update_uk_esos_api_client() {
    log_info "Updating uk-esos-app-api client in uk-esos realm..."
    
    local client_id="uk-esos-app-api"
    local realm="uk-esos"
    
    log_info "Fetching current client configuration..."
    local client_config=$(get_client_config "$realm" "$client_id")
    
    if [ "$client_config" = "null" ] || [ -z "$client_config" ]; then
        log_error "Client '$client_id' not found in realm '$realm'"
        return 1
    fi
    
    local client_uuid=$(echo "$client_config" | jq -r '.id')
    local client_name=$(echo "$client_config" | jq -r '.clientId')
    
    log_note "Found client: $client_name (UUID: $client_uuid)"
    
    # Current URLs
    local current_redirect_uris=$(echo "$client_config" | jq '.redirectUris // []')
    local current_web_origins=$(echo "$client_config" | jq '.webOrigins // []')
    
    log_note "Current redirect URIs: $(echo "$current_redirect_uris" | jq -c .)"
    log_note "Current web origins: $(echo "$current_web_origins" | jq -c .)"
    
    # Define new URLs to add
    local new_redirect_uris=(
        "http://localhost:8080/*"
        "http://localhost/*"
        "http://host.docker.internal/*"
        "https://host.docker.internal/*"
    )
    
    local new_web_origins=(
        "http://localhost:8080"
        "http://localhost:4200"
        "http://host.docker.internal"
        "https://host.docker.internal"
    )
    
    # Merge and deduplicate URLs
    local updated_redirect_uris=$(add_urls_to_array "$current_redirect_uris" "${new_redirect_uris[@]}")
    local updated_web_origins=$(add_urls_to_array "$current_web_origins" "${new_web_origins[@]}")
    
    log_note "Updated redirect URIs: $(echo "$updated_redirect_uris" | jq -c .)"
    log_note "Updated web origins: $(echo "$updated_web_origins" | jq -c .)"
    
    # Create updated client configuration
    local updated_config=$(echo "$client_config" | jq \
        --argjson redirectUris "$updated_redirect_uris" \
        --argjson webOrigins "$updated_web_origins" \
        '.redirectUris = $redirectUris | .webOrigins = $webOrigins')
    
    # Update the client
    log_info "Updating client configuration..."
    if update_client_config "$realm" "$client_uuid" "$updated_config"; then
        log_success "Successfully updated $client_id client"
    else
        log_error "Failed to update $client_id client"
        return 1
    fi
    
    echo ""
}

# Update Camunda Identity Service client
update_camunda_identity_client() {
    log_info "Updating camunda-identity-service client in master realm..."
    
    local client_id="camunda-identity-service"
    local realm="master"
    
    log_info "Fetching current client configuration..."
    local client_config=$(get_client_config "$realm" "$client_id")
    
    if [ "$client_config" = "null" ] || [ -z "$client_config" ]; then
        log_error "Client '$client_id' not found in realm '$realm'"
        return 1
    fi
    
    local client_uuid=$(echo "$client_config" | jq -r '.id')
    local client_name=$(echo "$client_config" | jq -r '.clientId')
    
    log_note "Found client: $client_name (UUID: $client_uuid)"
    
    # Current URLs
    local current_redirect_uris=$(echo "$client_config" | jq '.redirectUris // []')
    local current_web_origins=$(echo "$client_config" | jq '.webOrigins // []')
    
    log_note "Current redirect URIs: $(echo "$current_redirect_uris" | jq -c .)"
    log_note "Current web origins: $(echo "$current_web_origins" | jq -c .)"
    
    # Define new URLs to add
    local new_redirect_uris=(
        "http://localhost/*"
        "http://localhost:8080/*"
        "http://localhost:4200/*"
        "http://host.docker.internal/*"
        "https://host.docker.internal/*"
    )
    
    local new_web_origins=(
        "http://localhost:8080"
        "http://host.docker.internal"
        "https://host.docker.internal"
    )
    
    # Merge and deduplicate URLs
    local updated_redirect_uris=$(add_urls_to_array "$current_redirect_uris" "${new_redirect_uris[@]}")
    local updated_web_origins=$(add_urls_to_array "$current_web_origins" "${new_web_origins[@]}")
    
    log_note "Updated redirect URIs: $(echo "$updated_redirect_uris" | jq -c .)"
    log_note "Updated web origins: $(echo "$updated_web_origins" | jq -c .)"
    
    # Create updated client configuration
    local updated_config=$(echo "$client_config" | jq \
        --argjson redirectUris "$updated_redirect_uris" \
        --argjson webOrigins "$updated_web_origins" \
        '.redirectUris = $redirectUris | .webOrigins = $webOrigins')
    
    # Update the client
    log_info "Updating client configuration..."
    if update_client_config "$realm" "$client_uuid" "$updated_config"; then
        log_success "Successfully updated $client_id client"
    else
        log_error "Failed to update $client_id client"
        return 1
    fi
    
    echo ""
}

# Verify updates
verify_updates() {
    print_section "Verifying client updates"
    
    # Verify UK ESOS API client
    log_info "Verifying uk-esos-app-api client..."
    local uk_esos_config=$(get_client_config "uk-esos" "uk-esos-app-api")
    local uk_esos_redirects=$(echo "$uk_esos_config" | jq -r '.redirectUris[]?' | sort)
    local uk_esos_origins=$(echo "$uk_esos_config" | jq -r '.webOrigins[]?' | sort)
    
    echo "  📍 Redirect URIs:"
    echo "$uk_esos_redirects" | sed 's/^/       /'
    echo "  🌐 Web Origins:"
    echo "$uk_esos_origins" | sed 's/^/       /'
    echo ""
    
    # Verify Camunda client
    log_info "Verifying camunda-identity-service client..."
    local camunda_config=$(get_client_config "master" "camunda-identity-service")
    local camunda_redirects=$(echo "$camunda_config" | jq -r '.redirectUris[]?' | sort)
    local camunda_origins=$(echo "$camunda_config" | jq -r '.webOrigins[]?' | sort)
    
    echo "  📍 Redirect URIs:"
    echo "$camunda_redirects" | sed 's/^/       /'
    echo "  🌐 Web Origins:"
    echo "$camunda_origins" | sed 's/^/       /'
    echo ""
}

# Main function for URL updates
run_keycloak_urls_update() {
    print_section "Updating Keycloak Client URLs and CORS settings"

    # Obtain an access token for Keycloak admin operations
    log_info "Getting Keycloak admin access token..."
    KEYCLOAK_ADMIN_ACCESS_TOKEN=$(get_keycloak_admin_access_token)
    if [ -z "$KEYCLOAK_ADMIN_ACCESS_TOKEN" ]; then
        log_error "Failed to obtain Keycloak admin access token"
        return 1
    fi
    log_success "Successfully obtained admin token"
    echo ""

    update_uk_esos_api_client
    update_camunda_identity_client
}

# Only run main function if script is executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    set -e
    check_urls_environment
    run_keycloak_urls_update "$@"
fi
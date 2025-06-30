#!/bin/bash

#############################################################################################################
# Common functions for use in other scripts
#############################################################################################################

# Prevent multiple sourcing of this file
if [[ -n "${COMMON_FUNCTIONS_LOADED:-}" ]]; then
    return 0
fi
readonly COMMON_FUNCTIONS_LOADED=1


#############################################################################################################
# LOGGING FUNCTIONS
#############################################################################################################
# Include the new logging functions
source "$SCRIPT_DIR/common-logging-functions.sh"


#############################################################################################################
# ENVIRONMENT VARIABLE FUNCTIONS
#############################################################################################################

# Load environment variables from .env and .env.local files
# This functionality was previously in load-env-vars.sh
load_environment_variables() {
    local script_path="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd -P)"
    local script_parent_path="$(dirname "$script_path")"
    local current_path="$(pwd -P)"
    local search_path="$script_parent_path"
    
    # If there is an .env file or an .env.local file in the current directory then we use that
    # Does not support inheritance - i.e. it will either load from the current directory or the project directory, not both.
    if [[ "$current_path" != "$script_parent_path" ]]; then
        if [[ -f "$current_path/.env" || -f "$current_path/.env.local" ]]; then
            log_debug "Using local environment definitions from current directory"
            search_path="$current_path"
        fi
    fi
    
    # Make sure we have an .env or .env.local file in the search path
    if [[ ! -f "$search_path/.env" && ! -f "$search_path/.env.local" ]]; then
        log_error "Neither .env nor .env.local found in $search_path"
        exit 1
    fi
    
    # Helper function to validate env file
    validate_env_file() {
        local file="$1"
        if ! grep -q "^[a-zA-Z_][a-zA-Z0-9_]*=" "$file" 2>/dev/null; then
            if [[ -s "$file" ]]; then
                log_warn "$file does not contain valid environment variable definitions"
            fi
        fi
    }
    
    # Helper function to load env file
    load_env_file() {
        local file="$1"
        validate_env_file "$file"
        if ! source "$file"; then
            log_error "Failed to load environment variables from $file"
            exit 1
        fi
        log_debug "Loaded environment variables from $file"
    }
    
    # Enable automatic export of variables
    set -o allexport
    
    # Load .env file if it exists
    if [ -f "$search_path/.env" ]; then
        load_env_file "$search_path/.env"
    fi
    
    # Load .env.local file if it exists (overrides .env)
    if [ -f "$search_path/.env.local" ]; then
        load_env_file "$search_path/.env.local"
    fi
    
    # Disable automatic export
    set +o allexport
    
    log_debug "Environment variable loading completed"
}
export -f load_environment_variables

# Check that required environment variables are set
check_environment_variables() {
    local -n required_vars_ref=$1
    for var in "${required_vars_ref[@]}"; do
        # Use indirect expansion safely under set -u
        local var_value
        if [[ -v $var ]]; then
            var_value="${!var}"
        else
            var_value=""
        fi
        
        if [[ -z "$var_value" ]]; then
            log_error "Environment variable '$var' is not set."
            exit 1
        fi
    done
}
export -f check_environment_variables

#############################################################################################################
# KEYCLOAK FUNCTIONS
#############################################################################################################
get_keycloak_admin_access_token() {

    # Check that environment variable KC_BOOSTRAP_ADMIN_USERNAME, KC_BOOTSTRAP_ADMIN_PASSWORD and KC_BASE_URL are set
    if [ -z "$KC_BASE_URL" ] || [ -z "$KC_BOOTSTRAP_ADMIN_USERNAME" ] || [ -z "$KC_BOOTSTRAP_ADMIN_PASSWORD" ]; then
        echo "Ensure environment variables have been loaded via 'load_environment_variables' function before invoking this function"
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
export -f get_keycloak_admin_access_token

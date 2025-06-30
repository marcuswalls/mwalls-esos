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

checkEnvironmentVariables() {
    local -n required_vars_ref=$1
    for var in "${required_vars_ref[@]}"; do
        if [[ -z "${!var}" ]]; then
            print_error "Environment variable '$var' is not set."
            exit 1
        fi
    done
}
export -f checkEnvironmentVariables

#############################################################################################################
# KEYCLOAK FUNCTIONS
#############################################################################################################

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

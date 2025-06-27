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


# Color codes for output formatting
readonly LOG_RED='\033[0;31m'
readonly LOG_GREEN='\033[0;32m'
readonly LOG_YELLOW='\033[1;33m'
readonly LOG_BLUE='\033[0;34m'
readonly LOG_NC='\033[0m' # No Color
readonly LOG_LINEWIDTH=72

# Global counter variables (can be namespaced)
declare -A LOG_COUNTERS

# Initialize counters for a given namespace (defaults to 'default')
# Only initializes if the namespace hasn't been initialized before
init_log_counters() {
    local namespace="${1:-default}"
    
    # Check if namespace is already initialized by testing if any counter exists
    if [[ -z "${LOG_COUNTERS["${namespace}_error"]}" ]]; then
        LOG_COUNTERS["${namespace}_error"]=0
        LOG_COUNTERS["${namespace}_warning"]=0
        LOG_COUNTERS["${namespace}_success"]=0
        LOG_COUNTERS["${namespace}_info"]=0
    fi
}

# Reset counters for a given namespace
reset_log_counters() {
    local namespace="${1:-default}"
    init_log_counters "$namespace"
}

# Get counter value
get_log_count() {
    local type="$1"
    local namespace="${2:-default}"
    echo "${LOG_COUNTERS["${namespace}_${type}"]:-0}"
}

# Internal function to increment counter
_increment_counter() {
    local type="$1"
    local namespace="${2:-default}"
    local key="${namespace}_${type}"
    LOG_COUNTERS["$key"]=$((${LOG_COUNTERS["$key"]:-0} + 1))
}

# Print error message and increment error counter
print_error() {
    local message="$1"
    local namespace="${2:-default}"
   
    echo -e "${LOG_RED}❌ ${message}${LOG_NC}" >&2
    _increment_counter "error" "$namespace"
}

# Print warning message and increment warning counter
print_warning() {
    local message="$1"
    local namespace="${2:-default}"

    echo -e "${LOG_YELLOW}⚠️ ${message}${LOG_NC}" >&2
    _increment_counter "warning" "$namespace"
}

# Print success message and increment success counter
print_success() {
    local message="$1"
    local namespace="${2:-default}"

    echo -e "${LOG_GREEN}✅ ${message}${LOG_NC}"
    _increment_counter "success" "$namespace"
}


# Print info message - no counter increment
print_info() {
    local message="$1"
    echo -e "${LOG_BLUE}ℹ️ ${message}${LOG_NC}"
}

# Print note - no counter increment
print_note() {
    local message="$1"
    echo -e "${LOG_NC}   ${message}${LOG_NC}"
}

# Print note - no counter increment
print_section() {
    local message="$1"
    echo -e "${LOG_BLUE}🔧 ${message}${LOG_NC}"
    echo "$(printf -- '-%.0s' {1..72})"
}

print_banner() {
    local message="$1"
    print_separator "=" "${LOG_LINEWIDTH}" "${LOG_BLUE}"
    echo -e "${LOG_BLUE}   ${message}${LOG_NC}"
    print_separator "=" "${LOG_LINEWIDTH}" "${LOG_BLUE}"
    echo ""
}

print_separator() {
    local char="${1:--}"
    local length="${2:-${LOG_LINEWIDTH}}"
    local color="${3:-${LOG_NC}}"
    printf "${color}"
    printf "%${length}s" '' | tr ' ' "$char"
    printf "${LOG_NC}\n"
}

pad_right() {
    local string="$1"
    local width="${2:-${LOG_LINEWIDTH}}"
    local pad_char="${3:- }"
    local string_len=${#string}
    
    if [[ $string_len -ge $width ]]; then
        printf "%s" "$string"
    else
        local pad_len=$((width - string_len))
        local padding=$(printf "%*s" "$pad_len" "" | tr ' ' "$pad_char")
        printf "%s%s" "$string" "$padding"
    fi
}

# Print summary of all counters for a namespace
print_log_summary() {
    local namespace="${1:-default}"
    local linewidth="${2:-40}"
    local errors=$(get_log_count "error" "$namespace")
    local warnings=$(get_log_count "warning" "$namespace")
    local successes=$(get_log_count "success" "$namespace")
    
    echo ""
    echo $(pad_right "== Summary of results " "$linewidth" "=")
    printf "${LOG_RED}❌ Errors:${LOG_NC}    %2d\n" "$errors"
    printf "${LOG_YELLOW}⚠️ Warnings:${LOG_NC}  %2d\n" "$warnings"
    printf "${LOG_GREEN}✅ Successes:${LOG_NC} %2d\n" "$successes"
    echo $(pad_right "==" "$linewidth" "=")
}

# Export functions so they're available in sourcing scripts
export -f init_log_counters
export -f reset_log_counters
export -f get_log_count
export -f print_error
export -f print_warning
export -f print_success
export -f print_info
export -f print_note
export -f print_section
export -f print_banner
export -f print_log_summary
export -f print_separator

# Initialize default namespace
init_log_counters "default"

# Function to set up a new namespace (convenience function)
setup_log_namespace() {
    local namespace="$1"
    if [[ -z "$namespace" ]]; then
        echo "Usage: setup_log_namespace <namespace_name>" >&2
        return 1
    fi
    init_log_counters "$namespace"
    echo "Log namespace '$namespace' initialized"
}

export -f setup_log_namespace


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

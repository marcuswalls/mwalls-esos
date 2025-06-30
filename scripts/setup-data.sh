#!/bin/bash

##################################################################################################################
# Setup ESOS Data Script
#
# This script sets up initial data records in the ESOS application database.
# Currently it handles:
# - Creating a terms record in the TERMS table if one doesn't exist
#
# Required environment variables:
# - API_DB_NAME: Database name
# - API_DB_USERNAME: Database username  
# - API_DB_PASSWORD: Database password
# - API_TERMS_URL: URL for the terms of service
# - API_DB_HOST: Database host (optional, defaults to localhost)
# - API_DB_PORT: Database port (optional, defaults to 5433)
##################################################################################################################

# Load environment variables and common functions
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/common-functions.sh"
load_environment_variables

# Initialize logging
LOG_NAMESPACE="${LOG_NAMESPACE:-setup}"
init_log_counters "${LOG_NAMESPACE}"

# Function to check for required environment variables
check_environment() {
    local REQUIRED_ENV_VARS=(
        "API_DB_NAME"
        "API_DB_USERNAME"
        "API_DB_PASSWORD"
        "API_TERMS_URL"
        "API_DB_HOST"
        "API_DB_PORT"
    )
    check_environment_variables REQUIRED_ENV_VARS
}

main() {
    print_banner "Setting up ESOS Data"
    
    # Check environment variables
    check_environment
    
    print_section "Checking TERMS table"
    
    # Check if a row already exists in the TERMS table
    log_debug "Checking for existing terms record in database"
    local existing_terms=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
        "SELECT COUNT(*) FROM terms" 2>/dev/null | xargs)
    
    if [[ "$existing_terms" -gt 0 ]]; then
        log_success "Terms record already exists in database"
        log_debug "Found $existing_terms existing terms records"
        print_count_summary
        return 0
    fi
    
    log_info "No terms record found. Creating new terms record..."
    log_debug "Using terms URL: $API_TERMS_URL"
    
    # Create terms record in database
    local terms_sql="
        INSERT INTO terms (id, url, version)
        VALUES (nextval('terms_seq'), '$API_TERMS_URL', 1)
        RETURNING id;
    "
    
    local terms_id=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -q -c "$terms_sql" 2>/dev/null | xargs)
    
    if [[ -z "$terms_id" || "$terms_id" == "" ]]; then
        log_error "Failed to create terms record in database"
        print_count_summary
        exit 1
    fi
    
    log_success "Successfully created terms record with ID: $terms_id"
    log_debug "Terms URL: $API_TERMS_URL"
    log_debug "Version: 1"
    
    print_count_summary
}

# Conditional execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

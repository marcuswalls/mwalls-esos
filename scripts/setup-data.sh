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

# Function to setup terms table
setup_terms() {
    print_section "Setting up terms table"
    
    log_debug "Checking for existing terms record in database"
    local db_host=$(wsl_translate_hostname "${API_DB_HOST:-localhost}")
    local existing_terms=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "$db_host" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
        "SELECT COUNT(*) FROM terms" 2>/dev/null | xargs)
    
    if [[ "$existing_terms" -gt 0 ]]; then
        log_success "Terms record already exists in database"
        log_debug "Found $existing_terms existing terms records"
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
    
    local terms_id=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "$db_host" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -q -c "$terms_sql" 2>/dev/null | xargs)
    
    if [[ -z "$terms_id" || "$terms_id" == "" ]]; then
        log_error "Failed to create terms record in database"
        return 1
    fi
    
    log_success "Successfully created terms record with ID: $terms_id"
    log_debug "Terms URL: $API_TERMS_URL"
    log_debug "Version: 1"
    
    return 0
}

# Function to setup audit triggers
setup_audit_triggers() {
    print_section "Setting up audit triggers"
    
    log_info "Adding audit triggers to all database tables"
    local db_host=$(wsl_translate_hostname "${API_DB_HOST:-localhost}")
    
    # Call the add_audit_triggers function
    local result=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "$db_host" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
        "SELECT add_audit_triggers();" 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        log_success "Audit triggers successfully added to all tables"
        log_debug "All database changes will now be logged to the change_log table"
        return 0
    else
        log_error "Failed to add audit triggers to database tables"
        log_debug "Audit logging may not be available"
        return 1
    fi
}

# Main orchestration function
main() {
    print_banner "Setting up ESOS Data"

    # Check environment variables
    check_environment

    # Setup audit triggers
    if ! setup_audit_triggers; then
        log_error "Audit triggers setup failed"
        return 1;
    fi
    
    # Setup terms table
    if ! setup_terms; then
        log_error "Terms setup failed"
        return 1;
    fi
    
  
    # Print summary and exit
    print_count_summary
    return 0;    
}

# Conditional execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

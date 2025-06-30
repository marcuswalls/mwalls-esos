#!/bin/bash

##################################################################################################################
# ESOS Development Environment Setup Script
#
# This script sets up a complete ESOS development environment by running all necessary 
# setup scripts in the correct order. It will stop execution if any script fails.
#
# Required environment variables:
# - All variables required by the individual scripts (loaded from .env/.env.local)
##################################################################################################################

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/common-functions.sh"
load_environment_variables

# Initialize logging
LOG_NAMESPACE="${LOG_NAMESPACE:-setup}"
init_log_counters "${LOG_NAMESPACE}"


main() {
    # Step 1: Check environment is valid
    if ! "$SCRIPT_DIR/check-env.sh"; then
        log_error "Environment validation failed"
        exit 1
    fi
    
    # Step 2: Keycloak development settings
    if ! "$SCRIPT_DIR/update-keycloak.sh"; then
        log_error "Keycloak configuration failed"
        exit 1
    fi
    
    # Step 3: Database data setup
    if ! "$SCRIPT_DIR/setup-data.sh"; then
        log_error "Database data setup failed"
        exit 1
    fi
    
    # Step 4: Create test users
    if ! "$SCRIPT_DIR/create-user.sh" REGULATOR ca_super_user ENGLAND ea@example.com "RottenTomatoes" "Environment" "Agency" "Super Admin" 44 1234567890; then
        log_error "Failed to create regulator super user"
        exit 1
    fi
    
    # Note: Verifier user creation is currently disabled because verifier role data 
    # is commented out in liquibase files and not properly implemented yet
    # if ! "$SCRIPT_DIR/create-user.sh" VERIFIER verifier_admin ENGLAND verifier@example.com "RottenTomatoes" "Fred" "Bloggs" "Verification Lead" 44 1234567890; then
    #     log_error "Failed to create verifier admin user"
    #     exit 1
    # fi
    
    if ! "$SCRIPT_DIR/create-user.sh" OPERATOR operator_admin ENGLAND company1@example.com "RottenTomatoes" "Test" "User" "Manager (Company1)" 44 1234567890; then
        log_error "Failed to create operator admin user (company1)"
        exit 1
    fi
    
    if ! "$SCRIPT_DIR/create-user.sh" OPERATOR operator_admin ENGLAND company2@example.com "RottenTomatoes" "Test" "User" "Manager (Company2)" 44 1234567890; then
        log_error "Failed to create operator admin user (company2)"
        exit 1
    fi
    
    if ! "$SCRIPT_DIR/create-user.sh" OPERATOR operator_admin ENGLAND company3@example.com "RottenTomatoes" "Test" "User" "Manager (Company3)" 44 1234567890; then
        log_error "Failed to create operator admin user (company3)"
        exit 1
    fi
}

# Conditional execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

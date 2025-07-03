#!/usr/bin/env bats

# BATS test suite for common-functions.sh
# 
# To run these tests:
#   bats common-functions.bats
#
# To run specific tests:
#   bats -f "test_name" common-functions.bats
#
# Prerequisites:
#   - BATS installed (https://github.com/bats-core/bats-core)
#   - common-functions.sh in the same directory

# Setup function runs before each test
setup() {
    # Disable strict mode for tests to avoid unbound variable issues
    set +u
    
    # Source the common functions
    source "${BATS_TEST_DIRNAME}/common-functions.sh"
    
    # Set predictable environment for tests
    export COMMON_LOG_STD_LEVEL="ERROR"  # Suppress log output in tests
    export COMMON_LOG_FILE_ENABLED=0
}

# Teardown function runs after each test
teardown() {
    # Clean up any test artifacts
    unset COMMON_LOG_STD_LEVEL
    unset COMMON_LOG_FILE_ENABLED
    unset TEST_VAR1
    unset TEST_VAR2
    unset KC_BASE_URL
    unset KC_BOOTSTRAP_ADMIN_USERNAME
    unset KC_BOOTSTRAP_ADMIN_PASSWORD
}

#=============================================================================
# WSL TRANSLATION FUNCTION TESTS
#=============================================================================

@test "wsl_translate_url translates host.docker.internal to localhost" {
    run wsl_translate_url "https://host.docker.internal/api/endpoint"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost/api/endpoint" ]
}

@test "wsl_translate_url handles URLs with ports" {
    run wsl_translate_url "https://host.docker.internal:443/api/endpoint"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost/api/endpoint" ]
}

@test "wsl_translate_url handles HTTP URLs" {
    run wsl_translate_url "http://host.docker.internal:80/api/endpoint"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost/api/endpoint" ]
}

@test "wsl_translate_url leaves other URLs unchanged" {
    run wsl_translate_url "https://example.com/api/endpoint"
    [ "$status" -eq 0 ]
    [ "$output" = "https://example.com/api/endpoint" ]
}

@test "wsl_translate_url requires URL parameter" {
    run bash -c 'source common-functions.sh; wsl_translate_url "" 2>&1'
    [ "$status" -eq 1 ]
    [[ "$output" == *"URL parameter is required"* ]]
}

@test "wsl_translate_url handles complex URLs with query parameters" {
    run wsl_translate_url "https://host.docker.internal:443/api/v1/users?page=1&limit=10"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost/api/v1/users?page=1&limit=10" ]
}

@test "wsl_translate_hostname translates host.docker.internal to localhost" {
    run wsl_translate_hostname "host.docker.internal"
    [ "$status" -eq 0 ]
    [ "$output" = "localhost" ]
}

@test "wsl_translate_hostname leaves other hostnames unchanged" {
    run wsl_translate_hostname "example.com"
    [ "$status" -eq 0 ]
    [ "$output" = "example.com" ]
}

@test "wsl_translate_hostname requires hostname parameter" {
    run bash -c 'source common-functions.sh; wsl_translate_hostname "" 2>&1'
    [ "$status" -eq 1 ]
    [[ "$output" == *"hostname parameter is required"* ]]
}

@test "wsl_translate_hostname handles localhost passthrough" {
    run wsl_translate_hostname "localhost"
    [ "$status" -eq 0 ]
    [ "$output" = "localhost" ]
}

#=============================================================================
# ENVIRONMENT VARIABLE FUNCTION TESTS
#=============================================================================

@test "check_environment_variables passes with all required vars set" {
    export TEST_VAR1="value1"
    export TEST_VAR2="value2"
    
    # Create array and pass by reference
    local required_vars=("TEST_VAR1" "TEST_VAR2")
    run check_environment_variables required_vars
    [ "$status" -eq 0 ]
}

@test "check_environment_variables fails with missing var" {
    run bash -c 'source common-functions.sh; export TEST_VAR1="value1"; unset TEST_VAR2; required_vars=("TEST_VAR1" "TEST_VAR2"); check_environment_variables required_vars 2>&1'
    [ "$status" -eq 1 ]
    [[ "$output" == *"Environment variable 'TEST_VAR2' is not set"* ]]
}

@test "check_environment_variables fails with empty var" {
    run bash -c 'source common-functions.sh; export TEST_VAR1="value1"; export TEST_VAR2=""; required_vars=("TEST_VAR1" "TEST_VAR2"); check_environment_variables required_vars 2>&1'
    [ "$status" -eq 1 ]
    [[ "$output" == *"Environment variable 'TEST_VAR2' is not set"* ]]
}

@test "check_environment_variables handles single variable" {
    export TEST_VAR1="value1"
    
    local required_vars=("TEST_VAR1")
    run check_environment_variables required_vars
    [ "$status" -eq 0 ]
}

#=============================================================================
# KEYCLOAK FUNCTION TESTS
#=============================================================================

@test "get_keycloak_admin_access_token requires environment variables" {
    # Ensure required vars are not set
    unset KC_BASE_URL
    unset KC_BOOTSTRAP_ADMIN_USERNAME  
    unset KC_BOOTSTRAP_ADMIN_PASSWORD
    
    run get_keycloak_admin_access_token
    [ "$status" -eq 1 ]
    [[ "$output" == *"environment variables have been loaded"* ]]
}

@test "get_keycloak_admin_access_token fails with partial environment" {
    export KC_BASE_URL="https://example.com"
    # Missing username and password
    
    run get_keycloak_admin_access_token
    [ "$status" -eq 1 ]
}

#=============================================================================
# INTEGRATION TESTS
#=============================================================================

@test "WSL translation functions work together" {
    # Test that hostname and URL translation are consistent
    hostname_result=$(wsl_translate_hostname "host.docker.internal")
    url_result=$(wsl_translate_url "https://host.docker.internal:5432/db")
    
    [[ "$hostname_result" == "localhost" ]]
    [[ "$url_result" == "http://localhost/db" ]]
}

@test "functions handle special characters in input" {
    run wsl_translate_url "https://host.docker.internal/api/endpoint?param=value%20with%20spaces&other=123"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost/api/endpoint?param=value%20with%20spaces&other=123" ]
}

@test "functions work with edge case inputs" {
    # Test with just the hostname
    run wsl_translate_url "https://host.docker.internal"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost" ]
    
    # Test with path but no trailing slash
    run wsl_translate_url "https://host.docker.internal/api"
    [ "$status" -eq 0 ]
    [ "$output" = "http://localhost/api" ]
}

#=============================================================================
# ERROR HANDLING TESTS
#=============================================================================

@test "functions handle unset variables gracefully" {
    # Test that functions don't crash when optional variables are unset
    # This specifically tests the pattern that was causing issues in create-user.sh
    
    unset COMMON_LOG_STD_LEVEL
    run bash -c 'set -u; source common-functions.sh; wsl_translate_url "https://example.com/test"'
    [ "$status" -eq 0 ]
    [ "$output" = "https://example.com/test" ]
}
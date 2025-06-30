#!/usr/bin/env bats

# BATS test suite for common-logging-functions.sh
# 
# To run these tests:
#   bats common-logging-functions-test.sh
#
# To run specific tests:
#   bats -f "test_name" common-logging-functions-test.sh
#
# Prerequisites:
#   - BATS installed (https://github.com/bats-core/bats-core)
#   - common-logging-functions.sh in the same directory

# Setup function runs before each test
setup() {
    # Disable strict mode for tests to avoid unbound variable issues
    set +u
    
    # Source the logging functions
    source "${BATS_TEST_DIRNAME}/common-logging-functions.sh"
    
    # Initialize clean state for each test
    init_log_counters "test"
    reset_log_counters "test"
    
    # Set predictable environment
    export COMMON_LOG_STD_LEVEL="DEBUG"
    export COMMON_LOG_FILE_ENABLED=0
    export COMMON_LOG_COUNTER_NAMESPACE="test"
}

# Teardown function runs after each test
teardown() {
    # Clean up any test artifacts
    unset COMMON_LOG_STD_LEVEL
    unset COMMON_LOG_FILE_ENABLED
    unset COMMON_LOG_COUNTER_NAMESPACE
}

#=============================================================================
# INDENTATION TESTS
#=============================================================================

@test "get_indent returns 0 initially" {
    result=$(get_indent)
    [ "$result" -eq 0 ]
}

@test "push_indent increases indentation by default amount (2)" {
    push_indent
    result=$(get_indent)
    [ "$result" -eq 2 ]
}

@test "push_indent with custom amount" {
    push_indent 5
    result=$(get_indent)
    [ "$result" -eq 5 ]
}

@test "multiple push_indent calls accumulate" {
    push_indent 3
    push_indent 4
    result=$(get_indent)
    [ "$result" -eq 7 ]
}

@test "pop_indent decreases indentation by default amount (2)" {
    push_indent 5
    pop_indent
    result=$(get_indent)
    [ "$result" -eq 3 ]
}

@test "pop_indent with custom amount" {
    push_indent 10
    pop_indent 3
    result=$(get_indent)
    [ "$result" -eq 7 ]
}

@test "pop_indent prevents negative indentation" {
    push_indent 2
    pop_indent 5
    result=$(get_indent)
    [ "$result" -eq 0 ]
}

@test "push_indent validates positive integer input" {
    run push_indent "abc"
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be a positive integer"* ]]
}

@test "pop_indent validates positive integer input" {
    run pop_indent "-5"
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be a positive integer"* ]]
}

#=============================================================================
# LINE WIDTH TESTS
#=============================================================================

@test "get_line_width returns default (110)" {
    result=$(get_line_width)
    [ "$result" -eq 110 ]
}

@test "set_line_width changes line width" {
    set_line_width 80
    result=$(get_line_width)
    [ "$result" -eq 80 ]
}

@test "set_line_width with no parameter fails" {
    run set_line_width
    [ "$status" -eq 1 ]
    [[ "$output" == *"requires a width parameter"* ]]
}

@test "set_line_width validates integer" {
    run set_line_width "abc"
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be an integer"* ]]
}

@test "set_line_width with zero resets to default" {
    set_line_width 50
    set_line_width 0
    result=$(get_line_width)
    [ "$result" -eq 110 ]
}

@test "set_line_width rejects negative values" {
    run set_line_width -5
    [ "$status" -eq 1 ]
    [[ "$output" == *"cannot be negative"* ]]
}

#=============================================================================
# COUNTER TESTS
#=============================================================================

@test "init_log_counters initializes counters to zero" {
    init_log_counters "test"
    success=$(get_counter "SUCCESS" "test")
    warn=$(get_counter "WARN" "test")
    error=$(get_counter "ERROR" "test")
    [ "$success" -eq 0 ]
    [ "$warn" -eq 0 ]
    [ "$error" -eq 0 ]
}

@test "increment_counter increases specific counter" {
    # Test in isolated environment
    run bash -c 'source common-logging-functions.sh; 
        init_log_counters "testns"; 
        increment_counter "SUCCESS" "testns"; 
        increment_counter "SUCCESS" "testns"; 
        increment_counter "WARN" "testns"; 
        echo "SUCCESS:$(get_counter "SUCCESS" "testns") WARN:$(get_counter "WARN" "testns") ERROR:$(get_counter "ERROR" "testns")"'
    
    [ "$status" -eq 0 ]
    [[ "$output" == *"SUCCESS:2"* ]]
    [[ "$output" == *"WARN:1"* ]]
    [[ "$output" == *"ERROR:0"* ]]
}

@test "reset_log_counters resets all counters to zero" {
    local test_ns="reset_test_$$"
    init_log_counters "$test_ns"
    
    increment_counter "SUCCESS" "$test_ns"
    increment_counter "WARN" "$test_ns"
    increment_counter "ERROR" "$test_ns"
    
    reset_log_counters "$test_ns"
    
    success=$(get_counter "SUCCESS" "$test_ns")
    warn=$(get_counter "WARN" "$test_ns")
    error=$(get_counter "ERROR" "$test_ns")
    
    [ "$success" -eq 0 ]
    [ "$warn" -eq 0 ]
    [ "$error" -eq 0 ]
}

@test "get_counter validates counter type" {
    run get_counter "INVALID" "test"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid counter type"* ]]
}

@test "get_counter requires type parameter" {
    run get_counter "" "test"
    [ "$status" -eq 1 ]
    [[ "$output" == *"requires a type parameter"* ]]
}

@test "increment_counter validates counter type" {
    run increment_counter "INVALID" "test"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid counter type"* ]]
}

#=============================================================================
# LOGGING FUNCTION TESTS
#=============================================================================

@test "log_raw validates parameter count" {
    run log_raw "INFO"
    [ "$status" -eq 1 ]
    [[ "$output" == *"requires at least"* ]]
}

@test "log_raw validates log level" {
    run bash -c 'source common-logging-functions.sh; log_raw "INVALID" "NONE" "NONE" 0 "test message"'
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid level"* ]]
}

@test "log_raw validates color parameter" {
    run bash -c 'source common-logging-functions.sh; log_raw "INFO" "INVALID" "NONE" 0 "test message"'
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid color"* ]]
}

@test "log_raw validates indent parameter" {
    run bash -c 'source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" "abc" "test message"'
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid indent value"* ]]
}

@test "log_raw accepts empty message" {
    run bash -c 'source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" 0 ""'
    [ "$status" -eq 0 ]
}

@test "log_raw accepts custom icon text" {
    run bash -c 'source common-logging-functions.sh; log_raw "INFO" "NONE" "CUSTOM_ICON" 0 "test message"'
    [ "$status" -eq 0 ]
}

@test "log_success increments SUCCESS counter" {
    run bash -c 'source common-logging-functions.sh; init_log_counters "test"; initial=$(get_counter "SUCCESS" "test"); log_success "Test success message" >/dev/null 2>&1; final=$(get_counter "SUCCESS" "test"); echo "$((final - initial))"'
    [ "$status" -eq 0 ]
    [ "$output" -eq 1 ]
}

@test "log_warn increments WARN counter" {
    run bash -c 'source common-logging-functions.sh; init_log_counters "test"; initial=$(get_counter "WARN" "test"); log_warn "Test warning message" >/dev/null 2>&1; final=$(get_counter "WARN" "test"); echo "$((final - initial))"'
    [ "$status" -eq 0 ]
    [ "$output" -eq 1 ]
}

@test "log_error increments ERROR counter" {
    run bash -c 'source common-logging-functions.sh; init_log_counters "test"; initial=$(get_counter "ERROR" "test"); log_error "Test error message" >/dev/null 2>&1; final=$(get_counter "ERROR" "test"); echo "$((final - initial))"'
    [ "$status" -eq 0 ]
    [ "$output" -eq 1 ]
}

#=============================================================================
# FORMATTING FUNCTION TESTS
#=============================================================================

@test "print_separator validates width parameter" {
    run print_separator "NOTE" "NONE" "=" "abc"
    [ "$status" -eq 1 ]
    [[ "$output" == *"width must be a positive integer"* ]]
}

@test "print_separator rejects zero width" {
    run print_separator "NOTE" "NONE" "=" 0
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be greater than zero"* ]]
}

@test "pad_right validates width parameter" {
    run pad_right "test" "abc"
    [ "$status" -eq 1 ]
    [[ "$output" == *"width must be a positive integer"* ]]
}

@test "pad_right rejects zero width" {
    run pad_right "test" 0
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be greater than zero"* ]]
}

@test "pad_right pads string correctly" {
    result=$(pad_right "test" 10)
    [ "$result" = "test      " ]
}

@test "pad_right with custom padding character" {
    result=$(pad_right "test" 10 "x")
    [ "$result" = "testxxxxxx" ]
}

@test "pad_right doesn't truncate long strings" {
    result=$(pad_right "verylongstring" 5)
    [ "$result" = "verylongstring" ]
}

#=============================================================================
# INTEGRATION TESTS
#=============================================================================

@test "logging functions work with indentation" {
    run bash -c 'source common-logging-functions.sh; push_indent 4; log_info "Indented message"'
    [ "$status" -eq 0 ]
}

@test "print_count_summary shows correct counts" {
    run bash -c 'source common-logging-functions.sh; init_log_counters "test"; increment_counter "SUCCESS" "test"; increment_counter "SUCCESS" "test"; increment_counter "WARN" "test"; print_count_summary "INFO" 50'
    [ "$status" -eq 0 ]
    # Check that output contains the expected counts
    [[ "$output" == *"Total successes:  2"* ]]
    [[ "$output" == *"Total warnings:   1"* ]]
    [[ "$output" == *"Total errors:     0"* ]]
}

@test "environment variables are respected" {
    run bash -c 'export COMMON_LOG_STD_LEVEL="ERROR"; source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" 0 "test message"'
    [ "$status" -eq 0 ]
}

@test "invalid environment variables are caught" {
    run bash -c 'export COMMON_LOG_STD_LEVEL="INVALID"; source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" 0 "test message"'
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid COMMON_LOG_STD_LEVEL"* ]]
}

#=============================================================================
# EDGE CASE TESTS
#=============================================================================

@test "functions handle large numbers correctly" {
    push_indent 1000
    result=$(get_indent)
    [ "$result" -eq 1000 ]
    pop_indent 1000
}

@test "counters handle many increments" {
    for i in {1..100}; do
        increment_counter "SUCCESS" "test"
    done
    result=$(get_counter "SUCCESS" "test")
    [ "$result" -eq 100 ]
}

@test "multiple namespaces work independently" {
    run bash -c 'source common-logging-functions.sh; 
        init_log_counters "ns1"; 
        init_log_counters "ns2"; 
        increment_counter "SUCCESS" "ns1"; 
        increment_counter "SUCCESS" "ns1"; 
        increment_counter "SUCCESS" "ns2"; 
        echo "NS1:$(get_counter "SUCCESS" "ns1") NS2:$(get_counter "SUCCESS" "ns2")"'
    
    [ "$status" -eq 0 ]
    [[ "$output" == *"NS1:2"* ]]
    [[ "$output" == *"NS2:1"* ]]
}

@test "functions work with special characters in messages" {
    run bash -c 'source common-logging-functions.sh; log_info "Message with special chars: !@#$%^&*()[]{}|;:,.<>?"'
    [ "$status" -eq 0 ]
}

@test "functions work with unicode characters" {
    run bash -c 'source common-logging-functions.sh; log_info "Unicode test: ✅ ⚠️ ❌ 🔧"'
    [ "$status" -eq 0 ]
}

#=============================================================================
# INTEGRATION TESTS (Real-world usage patterns)
#=============================================================================


@test "real-world workflow: init -> log -> summary" {
    run bash -c 'source common-logging-functions.sh; init_log_counters "app"; log_success "OK"; log_warn "Warning"; print_count_summary'
    [ "$status" -eq 0 ]
    [[ "$output" == *"Total successes:  1"* ]]
    [[ "$output" == *"Total warnings:   1"* ]]
}

#=============================================================================
# NEW FEATURE TESTS
#=============================================================================

@test "log levels are case-insensitive" {
    run bash -c 'source common-logging-functions.sh; log_raw "info" "none" "none" 0 "test message"'
    [ "$status" -eq 0 ]
    run bash -c 'source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" 0 "test message"'
    [ "$status" -eq 0 ]
    run bash -c 'source common-logging-functions.sh; log_raw "Info" "None" "None" 0 "test message"'
    [ "$status" -eq 0 ]
}

@test "environment log levels are case-insensitive" {
    run bash -c 'export COMMON_LOG_STD_LEVEL="info"; source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" 0 "test message"'
    [ "$status" -eq 0 ]
    
    run bash -c 'export COMMON_LOG_FILE_LEVEL="debug"; source common-logging-functions.sh; log_raw "INFO" "NONE" "NONE" 0 "test message"'
    [ "$status" -eq 0 ]
}

@test "log_note function works" {
    run bash -c 'source common-logging-functions.sh; log_note "Test note message"'
    [ "$status" -eq 0 ]
}

@test "SUCCESS log level works" {
    run bash -c 'source common-logging-functions.sh; log_raw "SUCCESS" "GREEN" "SUCCESS" 0 "test success"'
    [ "$status" -eq 0 ]
}

@test "NOTE log level works" {
    run bash -c 'source common-logging-functions.sh; log_raw "NOTE" "NONE" "NONE" 0 "test note"'
    [ "$status" -eq 0 ]
}
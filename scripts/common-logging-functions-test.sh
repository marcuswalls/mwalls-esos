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

@test "set_line_width with no parameter resets to default" {
    set_line_width 50
    set_line_width
    result=$(get_line_width)
    [ "$result" -eq 110 ]
}

@test "set_line_width validates positive integer" {
    run set_line_width "abc"
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be a positive integer"* ]]
}

@test "set_line_width rejects zero" {
    run set_line_width 0
    [ "$status" -eq 1 ]
    [[ "$output" == *"must be greater than zero"* ]]
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
    increment_counter "SUCCESS" "test"
    increment_counter "SUCCESS" "test"
    increment_counter "WARN" "test"
    
    success=$(get_counter "SUCCESS" "test")
    warn=$(get_counter "WARN" "test")
    error=$(get_counter "ERROR" "test")
    
    [ "$success" -eq 2 ]
    [ "$warn" -eq 1 ]
    [ "$error" -eq 0 ]
}

@test "reset_log_counters resets all counters to zero" {
    increment_counter "SUCCESS" "test"
    increment_counter "WARN" "test"
    increment_counter "ERROR" "test"
    
    reset_log_counters "test"
    
    success=$(get_counter "SUCCESS" "test")
    warn=$(get_counter "WARN" "test")
    error=$(get_counter "ERROR" "test")
    
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
    run log_raw "INVALID" "NONE" "NONE" 0 "test message"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid level"* ]]
}

@test "log_raw validates color parameter" {
    run log_raw "INFO" "INVALID" "NONE" 0 "test message"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid color"* ]]
}

@test "log_raw validates indent parameter" {
    run log_raw "INFO" "NONE" "NONE" "abc" "test message"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid indent value"* ]]
}

@test "log_raw validates non-empty message" {
    run log_raw "INFO" "NONE" "NONE" 0 ""
    [ "$status" -eq 1 ]
    [[ "$output" == *"Message cannot be empty"* ]]
}

@test "log_raw accepts custom icon text" {
    run log_raw "INFO" "NONE" "CUSTOM_ICON" 0 "test message"
    [ "$status" -eq 0 ]
}

@test "log_success increments SUCCESS counter" {
    initial=$(get_counter "SUCCESS" "test")
    log_success "Test success message" >/dev/null 2>&1
    final=$(get_counter "SUCCESS" "test")
    [ "$final" -eq $((initial + 1)) ]
}

@test "log_warn increments WARN counter" {
    initial=$(get_counter "WARN" "test")
    log_warn "Test warning message" >/dev/null 2>&1
    final=$(get_counter "WARN" "test")
    [ "$final" -eq $((initial + 1)) ]
}

@test "log_error increments ERROR counter" {
    initial=$(get_counter "ERROR" "test")
    log_error "Test error message" >/dev/null 2>&1
    final=$(get_counter "ERROR" "test")
    [ "$final" -eq $((initial + 1)) ]
}

#=============================================================================
# FORMATTING FUNCTION TESTS
#=============================================================================

@test "print_separator validates width parameter" {
    run print_separator "NONE" "=" "abc"
    [ "$status" -eq 1 ]
    [[ "$output" == *"width must be a positive integer"* ]]
}

@test "print_separator rejects zero width" {
    run print_separator "NONE" "=" 0
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
    push_indent 4
    # Test that functions run without error when indented
    run log_info "Indented message"
    [ "$status" -eq 0 ]
    pop_indent 4
}

@test "print_count_summary shows correct counts" {
    increment_counter "SUCCESS" "test"
    increment_counter "SUCCESS" "test"
    increment_counter "WARN" "test"
    
    # Capture output (redirect to avoid cluttering test output)
    run print_count_summary 50
    [ "$status" -eq 0 ]
    # Check that output contains the expected counts
    [[ "$output" == *"Total successes:  2"* ]]
    [[ "$output" == *"Total warnings:   1"* ]]
    [[ "$output" == *"Total errors:     0"* ]]
}

@test "environment variables are respected" {
    export COMMON_LOG_STD_LEVEL="ERROR"
    # This should validate the environment variable
    run log_raw "INFO" "NONE" "NONE" 0 "test message"
    [ "$status" -eq 0 ]
    unset COMMON_LOG_STD_LEVEL
}

@test "invalid environment variables are caught" {
    export COMMON_LOG_STD_LEVEL="INVALID"
    run log_raw "INFO" "NONE" "NONE" 0 "test message"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Invalid COMMON_LOG_STD_LEVEL"* ]]
    unset COMMON_LOG_STD_LEVEL
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
    init_log_counters "namespace1"
    init_log_counters "namespace2"
    
    increment_counter "SUCCESS" "namespace1"
    increment_counter "SUCCESS" "namespace1"
    increment_counter "SUCCESS" "namespace2"
    
    count1=$(get_counter "SUCCESS" "namespace1")
    count2=$(get_counter "SUCCESS" "namespace2")
    
    [ "$count1" -eq 2 ]
    [ "$count2" -eq 1 ]
}

@test "functions work with special characters in messages" {
    run log_info "Message with special chars: !@#$%^&*()[]{}|;:,.<>?"
    [ "$status" -eq 0 ]
}

@test "functions work with unicode characters" {
    run log_info "Unicode test: ✅ ⚠️ ❌ 🔧"
    [ "$status" -eq 0 ]
}
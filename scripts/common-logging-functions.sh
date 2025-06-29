#!/bin/bash
#############################################################################################################
#   COMMON LOGGING FUNCTIONS
#############################################################################################################
#   Features:
#  
#   - Log levels: DEBUG, INFO, WARN, ERROR
#   - Outputs colours and icons to ANSI console, and optionally to a file 
#   - Additional methods to log success and notes, and to print banners, and sections
#   - Log counters: SUCCESS, WARN, ERROR can be counted and summarised via print_count_summary()
#   - Indentation controlled by push_indent() and pop_indent()
#   - Customizable line width
#
#   Customization via environment variables:
#
#   - COMMON_LOG_STD_LEVEL: Default log level for console output (default: INFO)
#   - COMMON_LOG_FILE_LEVEL: Default log level for file output (default: DEBUG)
#   - COMMON_LOG_FILE_ENABLED: Enable file logging (1 for enabled, 0 for disabled, default: 0)
#   - COMMON_LOG_FILE_PATH: Path to the log file (default: /tmp/<script_name>.log)
#   - COMMON_LOG_DATE_FORMAT: Date format for log entries (default: +%F %T)
#   - COMMON_LOG_LINE_WIDTH: Width of the log lines (default: 110)
#   - COMMON_LOG_COUNTER_NAMESPACE: Namespace for log counters (default: "default")
#############################################################################################################
set -uo pipefail;

# Prevent multiple sourcing of this file
if [[ -n "${COMMON_LOGGING_FUNCTIONS_LOADED:-}" ]]; then
    return 0
fi
readonly COMMON_LOGGING_FUNCTIONS_LOADED=1

# Global associative array declaration - private arrays
declare -A __COMMON_LOG_LEVELS__=(
    [DEBUG]=40
    [INFO]=30
    [WARN]=20
    [ERROR]=10
)

declare -A __COMMON_LOG_ICONS__=(
    [SUCCESS]='✅'
    [SPANNER]='🔧'
    [HOURGLASS]='⏳'
    [GLOBE]='🌍'
    [INFO]='ℹ️'
    [WARN]='⚠️'
    [ERROR]='❌'
    [NONE]='  '
)

declare -A __COMMON_LOG_COLORS__=(
    [BLACK]='\033[0;30m'
    [RED]='\033[0;31m'
    [GREEN]='\033[0;32m'
    [YELLOW]='\033[0;33m'
    [BLUE]='\033[0;34m'
    [MAGENTA]='\033[0;35m'
    [CYAN]='\033[0;36m'
    [WHITE]='\033[0;37m'
    [NONE]='\033[0m'
)

declare -A __COMMON_LOG_INDENT__=0
declare -A __COMMON_LOG_LINE_WIDTH__=110
readonly __COMMON_LOG_LINE_WIDTH_DEFAULT__=110

declare -A __COMMON_LOG_COUNTERS__;
declare -A __COMMON_LOG_COUNTER_NAMESPACE__;
readonly __COMMON_LOG_COUNTER_NAMESPACE_DEFAULT__="default";


get_indent() {
    echo "${__COMMON_LOG_INDENT__:-0}"
}

push_indent() {
    local amount="${1:-2}"
    __COMMON_LOG_INDENT__=$((__COMMON_LOG_INDENT__ + amount))
}

pop_indent() {
    local amount="${1:-2}"
    if [[ ${__COMMON_LOG_INDENT__:-0} -ge ${amount} ]]; then
        __COMMON_LOG_INDENT__=$((__COMMON_LOG_INDENT__ - amount))
    else
        __COMMON_LOG_INDENT__=0
    fi
}

get_line_width() {
    echo "${__COMMON_LOG_LINE_WIDTH__:-__COMMON_LOG_LINE_WIDTH_DEFAULT__}"
}   

set_line_width() {
    local width="${1}"
    
    # If no parameter specified, use default
    if [[ $# -eq 0 || -z "${width}" ]]; then
        __COMMON_LOG_LINE_WIDTH__="${__COMMON_LOG_LINE_WIDTH_DEFAULT__}"
        return 0
    fi
    
    # Validate that the parameter is a positive integer
    if [[ ! "${width}" =~ ^[0-9]+$ ]]; then
        echo "ERROR: Line width must be a positive integer, got: '${width}'" >&2
        return 1
    fi
    
    # Ensure it's not zero
    if [[ "${width}" -eq 0 ]]; then
        echo "ERROR: Line width must be greater than zero" >&2
        return 1
    fi
    
    # Save the validated width
    __COMMON_LOG_LINE_WIDTH__="${width}"
}   


# Initialize counters for a given namespace
# Only initializes if the namespace hasn't been initialized before
init_log_counters() {

    # Only initialize if the namespace is not already set
    local namespace="${1:-$(get_counter_namespace)}"
    __COMMON_LOG_COUNTER_NAMESPACE__="${namespace}"

    if [[ ! -v __COMMON_LOG_COUNTERS__["${namespace}_ERROR"] ]]; then
        __COMMON_LOG_COUNTERS__["${namespace}_ERROR"]=0
        __COMMON_LOG_COUNTERS__["${namespace}_WARN"]=0
        __COMMON_LOG_COUNTERS__["${namespace}_SUCCESS"]=0
    fi
}


# Reset counters for a given namespace
reset_log_counters() {

    local namespace="${1:-$(get_counter_namespace)}"

    init_log_counters "$namespace"

    # Make sure the counters are reset
    __COMMON_LOG_COUNTERS__["${namespace}_ERROR"]=0
    __COMMON_LOG_COUNTERS__["${namespace}_WARN"]=0
    __COMMON_LOG_COUNTERS__["${namespace}_SUCCESS"]=0

}


get_counter_namespace() {
    local namespace="${COMMON_LOG_COUNTER_NAMESPACE:-${__COMMON_LOG_COUNTER_NAMESPACE_DEFAULT__}}"
    echo "${namespace}"
}


get_counter() {
    local type="$1"
    local namespace="${2:-$(get_counter_namespace)}"
    echo "${__COMMON_LOG_COUNTERS__["${namespace}_${type}"]:-0}"
}


increment_counter() {
    local type="$1"
    local namespace="${2:-${COMMON_LOG_COUNTER_NAMESPACE:-${__COMMON_LOG_COUNTER_NAMESPACE_DEFAULT__}}}"
    local key="${namespace}_${type}"
    __COMMON_LOG_COUNTERS__["$key"]=$((${__COMMON_LOG_COUNTERS__["$key"]:-0} + 1))
}



log_raw() {
    # Validate that the function is called with at least 5 parameters
    # $1 - log level (DEBUG, INFO, WARN, ERROR)
    # $2 - color name (BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, NONE)
    # $3 - icon name (SUCCESS, INFO, WARN, ERROR, NONE)
    # $4 - number of spaces to indent
    # $5 - message to log

    # Validate parameter count
    if [[ $# -lt 5 ]]; then
        echo "ERROR: log_raw requires at least 4 parameters: level, color, icon, indent, message" >&2
        return 1
    fi

    local level_name="${1}";
    local color_name="${2}";
    local icon_name="${3}";
    local indent_value="${4}";

    # Validate level parameter
    if [[ ! -v __COMMON_LOG_LEVELS__["${level_name}"] ]]; then
        echo "ERROR: Invalid level '${level_name}'. Valid values are: DEBUG, INFO, WARN, ERROR" >&2
        return 1
    fi

    # Validate color parameter
    if [[ ! -v __COMMON_LOG_COLORS__["${color_name}"] ]]; then
        echo "ERROR: Invalid color '${color_name}'. Valid values are: BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, NONE" >&2
        return 1
    fi

    # Validate icon parameter
    local icon_value='';
    local custom_icon=0;
    if [[ ! -v __COMMON_LOG_ICONS__["${icon_name}"] ]]; then
        custom_icon=1;
        icon_value=${icon_name};
    fi

    # Validate indent parameter (must be a positive integer or zero)
    if [[ ! "${indent_value}" =~ ^[0-9]+$ ]]; then
        echo "ERROR: Invalid indent value '${indent_value}'. Must be a positive integer or zero" >&2
        return 1
    fi

    local color="${__COMMON_LOG_COLORS__[$color_name]}";
    local icon=${icon_value};
    if [[ "${custom_icon}" -eq 0 ]]; then
        icon="${__COMMON_LOG_ICONS__[$icon_name]}";
    fi
    
    shift 4;
    local message="${@}";
  
    # Validate message is not empty
    if [[ -z "${message// }" ]]; then
        echo "ERROR: Message cannot be empty" >&2
        return 1
    fi


    # Determine the required logging level for the screen
    local std_level_name="${COMMON_LOG_STD_LEVEL:-INFO}";
    if [[ ! -v __COMMON_LOG_LEVELS__["${std_level_name}"] ]]; then
        echo "ERROR: Invalid COMMON_LOG_STD_LEVEL '${std_level_name}'. Valid values are: DEBUG, INFO, WARN, ERROR" >&2
        return 1
    fi

    # Determine the required logging level for the file
    local file_level_name="${COMMON_LOG_FILE_LEVEL:-DEBUG}";
    if [[ ! -v __COMMON_LOG_LEVELS__["${file_level_name}"] ]]; then
        echo "ERROR: Invalid COMMON_LOG_FILE_LEVEL '${file_level_name}'. Valid values are: DEBUG, INFO, WARN, ERROR" >&2
        return 1
    fi

    # Determine the numeric values for the levels
    local level_num="${__COMMON_LOG_LEVELS__[${level_name}]}";
    local std_level_num="${__COMMON_LOG_LEVELS__[${std_level_name}]}";
    local file_level_num="${__COMMON_LOG_LEVELS__[${file_level_name}]}";

    # Create indentation string
    local indent=""
    if [[ "${indent_value}" -gt 0 ]]; then
        indent=$(printf "%*s" "${indent_value}" "")
    fi

    local date_format="${COMMON_LOG_DATE_FORMAT:-+%F %T}";
    local date="$(date "${date_format}")";


    # file format has {date} {level} {indent}{message}
    # screen format has {color}{indent}{icon} {message}{nc}

    local std_line="${color}${indent}${icon} ${message}${__COMMON_LOG_COLORS__[NONE]}";
    if [[ "${std_level_num}" -ge "${level_num}" ]]; then
        if [[ "${level_num}" -le "20" ]]; then
            echo -e "${std_line}" >&2;
        else
            echo -e "${std_line}" ;
        fi
    fi

    local file="${COMMON_LOG_FILE_ENABLED:-0}";
    local file_path="${COMMON_LOG_FILE_PATH:-/tmp/$(basename "${0}").log}";
    local file_line="${date} $(printf "%-5s" "${level_name}") ${indent} ${message}";
    if [[ "${file}" -eq 1 && "${file_level_num}" -ge "${level_num}" ]]; then
        # Log to file if enabled and level is sufficient
        echo -e "${file_line}" >> "${file_path}";
    fi

}

log_debug() {
    log_raw "DEBUG" "CYAN" "NONE" ${__COMMON_LOG_INDENT__} "$@";
}

log_note() {
    log_raw "INFO" "NONE" "NONE" ${__COMMON_LOG_INDENT__} "$@";
}

log_info() {
    log_raw "INFO" "BLUE" "INFO" ${__COMMON_LOG_INDENT__} "$@";
}

log_success() {
    log_raw "INFO" "GREEN" "SUCCESS" ${__COMMON_LOG_INDENT__} "$@";
    increment_counter "SUCCESS"
}

log_warn() {
    log_raw "WARN" "YELLOW" "WARN" ${__COMMON_LOG_INDENT__} "$@";
    increment_counter "WARN"
}

log_error() {
    log_raw "ERROR" "RED" "ERROR" ${__COMMON_LOG_INDENT__} "$@";
    increment_counter "ERROR"
}

print_banner() {
    local message="$@"
    print_separator "NONE" "=" "${__COMMON_LOG_LINE_WIDTH__}"
    log_raw "INFO" "NONE" "NONE" ${__COMMON_LOG_INDENT__} "  ${message}";
    print_separator "NONE" "=" "${__COMMON_LOG_LINE_WIDTH__}"
}

print_section() {
    local message=$@;
    log_raw "INFO" "NONE" "🔧" ${__COMMON_LOG_INDENT__} "${message}";
    print_separator "NONE" "-" "${__COMMON_LOG_LINE_WIDTH__}";
}

print_separator() {
    local color="${1:-NONE}";
    local char="${2:-=}";
    local width="${3:-${__COMMON_LOG_LINE_WIDTH__}}";
    log_raw "INFO" ${color} "NONE" ${__COMMON_LOG_INDENT__} "$(printf -- '%*s' "${width}" "" | tr ' ' "${char}")";
}

pad_right() {
    local string="$1"
    local width="${2:-${__COMMON_LOG_LINE_WIDTH__}}"
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


print_count_summary() {

    local linewidth="${1:-${__COMMON_LOG_LINE_WIDTH__}}"
    local success_count=$(get_counter "SUCCESS")
    local warning_count=$(get_counter "WARN")
    local error_count=$(get_counter "ERROR")

    log_raw "INFO" "NONE" "NONE" ${__COMMON_LOG_INDENT__} "$(pad_right "== Summary of results " "$linewidth" "=")";
    push_indent 3
    log_raw "INFO" "GREEN" "SUCCESS" ${__COMMON_LOG_INDENT__} "Total successes: $(printf "%2d" ${success_count})";
    log_raw "INFO" "YELLOW" "WARN" ${__COMMON_LOG_INDENT__} "Total warnings:  $(printf "%2d" ${warning_count})";
    log_raw "INFO" "RED" "ERROR" ${__COMMON_LOG_INDENT__} "Total errors:    $(printf "%2d" ${error_count})";
    pop_indent 3
    log_raw "INFO" "NONE" "NONE" ${__COMMON_LOG_INDENT__} "$(pad_right "" "$linewidth" "=")";
}



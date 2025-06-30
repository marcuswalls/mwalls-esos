#!/bin/bash
#############################################################################################################
# Environment Check: make sure that the local environment is WSL2 or native Linux, and has the right tools:
# - Node.js v18
# - Yarn package manager
# - Angular CLI v16
# - Java 17
# - Apache Maven with Java 17
# - Docker Desktop
#############################################################################################################

# Source the common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common-functions.sh"
source "$SCRIPT_DIR/common-logging-functions.sh"

# Initialize logging for environment check
init_log_counters "env_check"

# Version comparison function
version_compare() {
    local version1=$1
    local version2=$2
    local operator=$3
    
    # Convert versions to comparable format (remove non-numeric chars)
    local v1=$(echo "$version1" | sed 's/[^0-9.]//g')
    local v2=$(echo "$version2" | sed 's/[^0-9.]//g')
    
    case $operator in
        ">=")
            [ "$(printf '%s\n' "$v2" "$v1" | sort -V | head -n1)" = "$v2" ]
            ;;
        "==")
            [ "$v1" = "$v2" ]
            ;;
        *)
            return 1
            ;;
    esac
}

# Check platform compatibility first
check_platform() {
    print_section "Platform compatibility"
    
    # Detect the operating system
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Check if we're in WSL
        if grep -qEi "(Microsoft|WSL)" /proc/version 2>/dev/null; then
            WSL_VERSION=""
            if grep -qi "WSL2" /proc/version 2>/dev/null; then
                WSL_VERSION="WSL2"
                log_note "Running on Windows $WSL_VERSION"
                log_success "WSL2 environment detected"
            else
                WSL_VERSION="WSL1"
                log_note "Running on Windows $WSL_VERSION"
                log_note "Please use WSL2 instead: https://docs.microsoft.com/en-us/windows/wsl/install"
                exit 1
            fi
        else
            log_note "Running on native Linux"
            log_success "Linux environment - compatible"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        log_note "Running on macOS"
        log_success "macOS environment - compatible"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        log_error "Running on native Windows (Cygwin/MSYS/Win32)"
        log_note "This environment is not supported for ESOS development"
        log_note "Please use WSL2 instead: https://docs.microsoft.com/en-us/windows/wsl/install"
        exit 1
    elif [[ -n "$WINDIR" ]] || [[ -n "$SYSTEMROOT" ]] || command -v cmd.exe >/dev/null 2>&1; then
        log_error "Windows environment detected outside of WSL"
        log_note "Native Windows is not supported for ESOS development"
        log_note "Please install and use WSL2: wsl --install"
        exit 1
    else
        log_warn "Unknown operating system: $OSTYPE"
        log_note "Proceeding with checks, but compatibility is not guaranteed"
    fi
    log_note ""
}

print_banner "ESOS Development Environment Check"
log_note ""

# Platform check must be first
check_platform

# Check Node.js
print_section "Node.js v18"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_VERSION_NUM=$(echo "$NODE_VERSION" | sed 's/v//')
    log_note "Found: Node.js $NODE_VERSION"
    
    if version_compare "$NODE_VERSION_NUM" "18.0.0" ">="; then
        if [[ "$NODE_VERSION_NUM" == 18.* ]]; then
            log_success "Node.js v18 is active [${NODE_VERSION}]"
        else
            log_warn "Node.js $NODE_VERSION is active (expected v18.x)"
        fi
    else
        log_error "Node.js version is too old (found $NODE_VERSION, need v18+)"
    fi
else
    log_error "Node.js is not installed"
fi
log_note ""

# Check Yarn
print_section "Yarn package manager"
if command -v yarn >/dev/null 2>&1; then
    YARN_VERSION=$(yarn --version 2>/dev/null)
    log_note "Found: Yarn v$YARN_VERSION"
    log_success "Yarn is installed [$YARN_VERSION]"
else
    log_error "Yarn is not installed"
fi
log_note ""

# Check Angular CLI
print_section "Angular CLI v16"
if command -v ng >/dev/null 2>&1; then
    # Try multiple methods to get Angular CLI version
    NG_VERSION=""
    
    # Method 1: Try ng version with JSON output
    if [ -z "$NG_VERSION" ]; then
        NG_VERSION=$(ng version --skip-git 2>/dev/null | grep -i "angular cli" | head -n 1 | awk '{print $3}' | tr -d ',' || echo "")
    fi
    
    # Method 2: Try ng --version
    if [ -z "$NG_VERSION" ]; then
        NG_VERSION=$(ng --version 2>/dev/null | head -n 1 | awk '{print $2}' || echo "")
    fi
    
    # Method 3: Try parsing package info
    if [ -z "$NG_VERSION" ]; then
        NG_VERSION=$(npm list -g @angular/cli --depth=0 2>/dev/null | grep "@angular/cli" | awk -F'@' '{print $3}' || echo "")
    fi
    
    if [ -n "$NG_VERSION" ] && [ "$NG_VERSION" != "unknown" ]; then
        log_note "Found: Angular CLI v$NG_VERSION"
        
        if [[ "$NG_VERSION" == 16.* ]]; then
            log_success "Angular CLI v16 is installed [$NG_VERSION]"
        else
            log_warn "Angular CLI v$NG_VERSION is installed (expected v16.x)"
        fi
    else
        log_warn "Could not determine Angular CLI version"
        log_note "Try running: ng version"
    fi
else
    log_error "Angular CLI is not installed"
    log_note "Install with: npm install -g @angular/cli@16"
fi
log_note ""

# Check Java 17
print_section "Java 17"
if command -v java >/dev/null 2>&1; then
    JAVA_VERSION_FULL=$(java -version 2>&1 | head -n 1)
    JAVA_VERSION=$(echo "$JAVA_VERSION_FULL" | awk -F '"' '{print $2}' | awk -F '.' '{print $1}')
    
    log_note "Found: $JAVA_VERSION_FULL"

    if [ -n "$JAVA_HOME" ]; then
        log_note "JAVA_HOME: $JAVA_HOME"
    else
        log_warn "JAVA_HOME environment variable is not set"
    fi
    
    if [ "$JAVA_VERSION" = "17" ]; then
        log_success "Java 17 installed [$JAVA_VERSION_FULL]"
    else
        log_error "Java $JAVA_VERSION is active (expected Java 17)"
        log_note "Check JAVA_HOME and PATH settings"
    fi
    
else
    log_error "Java is not installed"
fi
log_note ""

# Check Maven
print_section "Apache Maven with Java 17"
if command -v mvn >/dev/null 2>&1; then
    MVN_OUTPUT=$(mvn --version 2>/dev/null)
    MVN_VERSION=$(echo "$MVN_OUTPUT" | head -n 1 | awk '{print $3}')
    MVN_JAVA_VERSION=$(echo "$MVN_OUTPUT" | grep "Java version" | awk '{print $3}' | awk -F '.' '{print $1}' | sed 's/,//')
    
    log_note "Found: Apache Maven $MVN_VERSION"
    
    if [ -n "$MVN_JAVA_VERSION" ]; then
        log_note "Maven is using Java $MVN_JAVA_VERSION"
        
        if [ "$MVN_JAVA_VERSION" = "17" ]; then
            log_success "Maven is configured with Java 17 [$MVN_VERSION]"
        else
            log_error "Maven is using Java $MVN_JAVA_VERSION (expected Java 17)"
            log_note "Fix JAVA_HOME or update Maven's Java configuration"
        fi
    else
        log_warn "Could not determine Java version used by Maven"
    fi
    
    # Check if using project's wrapper
    if [ -f "./mvnw" ]; then
        log_note "Maven wrapper (mvnw) is available in current directory"
    fi
else
    log_error "Maven is not installed"
fi
log_note ""

# Check Docker
print_section "Docker"
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    log_note "Found: Docker $DOCKER_VERSION"
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        log_success "Docker is installed and running [$DOCKER_VERSION]"
    else
        log_warn "Docker is installed but daemon is not running"
    fi
    
else
    log_error "Docker is not installed"
fi
log_note ""

# Check PostgreSQL client (psql)
print_section "PostgreSQL client (psql)"
if command -v psql >/dev/null 2>&1; then
    PSQL_VERSION=$(psql --version 2>/dev/null | awk '{print $3}')
    log_note "Found: PostgreSQL client $PSQL_VERSION"
    log_success "psql is installed [$PSQL_VERSION]"
else
    log_error "psql is not installed"
    log_note "Install with: sudo apt install postgresql-client"
fi
log_note ""

# Check jq
print_section "JSON processor (jq)"
if command -v jq >/dev/null 2>&1; then
    JQ_VERSION=$(jq --version 2>/dev/null | sed 's/jq-//')
    log_note "Found: jq $JQ_VERSION"
    log_success "jq is installed [$JQ_VERSION]"
else
    log_error "jq is not installed"
    log_note "Install with: sudo apt install jq"
fi
log_note ""

# Check curl
print_section "curl"
if command -v curl >/dev/null 2>&1; then
    CURL_VERSION=$(curl --version 2>/dev/null | head -n 1 | awk '{print $2}')
    log_note "Found: curl $CURL_VERSION"
    log_success "curl is installed [$CURL_VERSION]"
else
    log_error "curl is not installed"
    log_note "Install with: sudo apt install curl"
fi
log_note ""


# Print summary using common functions
print_count_summary

# Overall status
errors=$(get_counter "ERROR")
warnings=$(get_counter "WARN")

if [ $errors -eq 0 ]; then
    if [ $warnings -eq 0 ]; then
        log_success "Environment is ready for ESOS development!"
        exit 0
    else
        log_warn "Environment is mostly ready, but please check warnings above."
        exit 0
    fi
else
    log_error "Environment setup is incomplete. Please fix the failed checks above."
    exit 1
fi

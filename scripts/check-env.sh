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
                print_note "Running on Windows $WSL_VERSION"
                print_success "WSL2 environment detected - compatible" "env_check"
            else
                WSL_VERSION="WSL1"
                print_note "Running on Windows $WSL_VERSION"
                print_warning "WSL1 detected - WSL2 is recommended for better Docker support" "env_check"
            fi
        else
            print_note "Running on native Linux"
            print_success "Linux environment - compatible" "env_check"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_note "Running on macOS"
        print_success "macOS environment - compatible" "env_check"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        print_error "Running on native Windows (Cygwin/MSYS/Win32)" "env_check"
        print_note "This environment is not supported for ESOS development"
        print_note "Please use WSL2 instead: https://docs.microsoft.com/en-us/windows/wsl/install"
        echo ""
        echo "❌ Unsupported platform detected. Exiting."
        exit 1
    elif [[ -n "$WINDIR" ]] || [[ -n "$SYSTEMROOT" ]] || command -v cmd.exe >/dev/null 2>&1; then
        print_error "Windows environment detected outside of WSL" "env_check"
        print_note "Native Windows is not supported for ESOS development"
        print_note "Please install and use WSL2: wsl --install"
        echo ""
        echo "❌ Please run this script from within WSL2. Exiting."
        exit 1
    else
        print_warning "Unknown operating system: $OSTYPE" "env_check"
        print_note "Proceeding with checks, but compatibility is not guaranteed"
    fi
    echo ""
}

print_banner "ESOS Development Environment Check"

# Platform check must be first
check_platform

# Check Node.js
print_section "Node.js v18"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_VERSION_NUM=$(echo "$NODE_VERSION" | sed 's/v//')
    print_note "Found: Node.js $NODE_VERSION"
    
    if version_compare "$NODE_VERSION_NUM" "18.0.0" ">="; then
        if [[ "$NODE_VERSION_NUM" == 18.* ]]; then
            print_success "Node.js v18 is active" "env_check"
        else
            print_warning "Node.js $NODE_VERSION is active (expected v18.x)" "env_check"
        fi
    else
        print_error "Node.js version is too old (found $NODE_VERSION, need v18+)" "env_check"
    fi
else
    print_error "Node.js is not installed" "env_check"
fi
echo ""

# Check Yarn
print_section "Yarn package manager"
if command -v yarn >/dev/null 2>&1; then
    YARN_VERSION=$(yarn --version 2>/dev/null)
    print_note "Found: Yarn v$YARN_VERSION"
    print_success "Yarn is installed" "env_check"
else
    print_error "Yarn is not installed" "env_check"
    print_note "Install with: npm install -g yarn"
fi
echo ""

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
        print_note "Found: Angular CLI v$NG_VERSION"
        
        if [[ "$NG_VERSION" == 16.* ]]; then
            print_success "Angular CLI v16 is installed" "env_check"
        else
            print_warning "Angular CLI v$NG_VERSION is installed (expected v16.x)" "env_check"
        fi
    else
        print_warning "Could not determine Angular CLI version" "env_check"
        print_note "Try running: ng version"
    fi
else
    print_error "Angular CLI is not installed" "env_check"
    print_note "Install with: npm install -g @angular/cli@16"
fi
echo ""

# Check Java 17
print_section "Java 17"
if command -v java >/dev/null 2>&1; then
    JAVA_VERSION_FULL=$(java -version 2>&1 | head -n 1)
    JAVA_VERSION=$(echo "$JAVA_VERSION_FULL" | awk -F '"' '{print $2}' | awk -F '.' '{print $1}')
    
    print_note "Found: $JAVA_VERSION_FULL"

    if [ -n "$JAVA_HOME" ]; then
        print_note "JAVA_HOME: $JAVA_HOME"
    else
        print_warning "JAVA_HOME environment variable is not set" "env_check"
    fi
    
    if [ "$JAVA_VERSION" = "17" ]; then
        print_success "Java 17 is active" "env_check"
    else
        print_error "Java $JAVA_VERSION is active (expected Java 17)" "env_check"
        print_note "Check JAVA_HOME and PATH settings"
    fi
    
else
    print_error "Java is not installed" "env_check"
fi
echo ""

# Check Maven
print_section "Apache Maven with Java 17"
if command -v mvn >/dev/null 2>&1; then
    MVN_OUTPUT=$(mvn --version 2>/dev/null)
    MVN_VERSION=$(echo "$MVN_OUTPUT" | head -n 1 | awk '{print $3}')
    MVN_JAVA_VERSION=$(echo "$MVN_OUTPUT" | grep "Java version" | awk '{print $3}' | awk -F '.' '{print $1}' | sed 's/,//')
    
    print_note "Found: Apache Maven $MVN_VERSION"
    
    if [ -n "$MVN_JAVA_VERSION" ]; then
        print_note "Maven is using Java $MVN_JAVA_VERSION"
        
        if [ "$MVN_JAVA_VERSION" = "17" ]; then
            print_success "Maven is configured with Java 17" "env_check"
        else
            print_error "Maven is using Java $MVN_JAVA_VERSION (expected Java 17)" "env_check"
            print_note "Fix JAVA_HOME or update Maven's Java configuration"
        fi
    else
        print_warning "Could not determine Java version used by Maven" "env_check"
    fi
    
    # Check if using project's wrapper
    if [ -f "./mvnw" ]; then
        print_note "Maven wrapper (mvnw) is available in current directory"
    fi
else
    print_error "Maven is not installed" "env_check"
fi
echo ""

# Check Docker
print_section "Docker"
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    print_note "Found: Docker $DOCKER_VERSION"
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        print_success "Docker is installed and running" "env_check"
    else
        print_warning "Docker is installed but daemon is not running" "env_check"
    fi
    
else
    print_error "Docker is not installed" "env_check"
fi
echo ""

# Check PostgreSQL client (psql)
print_section "PostgreSQL client (psql)"
if command -v psql >/dev/null 2>&1; then
    PSQL_VERSION=$(psql --version 2>/dev/null | awk '{print $3}')
    print_note "Found: PostgreSQL client $PSQL_VERSION"
    print_success "psql is installed" "env_check"
else
    print_error "psql is not installed" "env_check"
    print_note "Install with: sudo apt install postgresql-client"
fi
echo ""

# Check jq
print_section "JSON processor (jq)"
if command -v jq >/dev/null 2>&1; then
    JQ_VERSION=$(jq --version 2>/dev/null | sed 's/jq-//')
    print_note "Found: jq $JQ_VERSION"
    print_success "jq is installed" "env_check"
else
    print_error "jq is not installed" "env_check"
    print_note "Install with: sudo apt install jq"
fi
echo ""

# Check curl
print_section "curl"
if command -v curl >/dev/null 2>&1; then
    CURL_VERSION=$(curl --version 2>/dev/null | head -n 1 | awk '{print $2}')
    print_note "Found: curl $CURL_VERSION"
    print_success "curl is installed" "env_check"
else
    print_error "curl is not installed" "env_check"
    print_note "Install with: sudo apt install curl"
fi
echo ""


# Print summary using common functions
print_log_summary "env_check" $LOG_LINEWIDTH

# Overall status
errors=$(get_log_count "error" "env_check")
warnings=$(get_log_count "warning" "env_check")

if [ $errors -eq 0 ]; then
    if [ $warnings -eq 0 ]; then
        echo -e "${LOG_GREEN}🎉 Environment is ready for ESOS development!${LOG_NC}"
        exit 0
    else
        echo -e "${LOG_YELLOW}⚠️  Environment is mostly ready, but please check warnings above.${LOG_NC}"
        exit 0
    fi
else
    echo -e "${LOG_RED}❌ Environment setup is incomplete. Please fix the failed checks above.${LOG_NC}"
    exit 1
fi

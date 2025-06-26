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


# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
print_check() {
    echo -e "${BLUE}🔍 Checking $1...${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "   ℹ️  $1"
}

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
    print_check "Platform compatibility"
    
    # Detect the operating system
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Check if we're in WSL
        if grep -qEi "(Microsoft|WSL)" /proc/version 2>/dev/null; then
            WSL_VERSION=""
            if grep -qi "WSL2" /proc/version 2>/dev/null; then
                WSL_VERSION="WSL2"
                print_info "Running on Windows $WSL_VERSION"
                print_success "WSL2 environment detected - compatible"
            else
                WSL_VERSION="WSL1"
                print_info "Running on Windows $WSL_VERSION"
                print_warning "WSL1 detected - WSL2 is recommended for better Docker support"
            fi
        else
            print_info "Running on native Linux"
            print_success "Linux environment - compatible"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Running on macOS"
        print_success "macOS environment - compatible"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        print_fail "Running on native Windows (Cygwin/MSYS/Win32)"
        print_info "This environment is not supported for ESOS development"
        print_info "Please use WSL2 instead: https://docs.microsoft.com/en-us/windows/wsl/install"
        echo ""
        echo "❌ Unsupported platform detected. Exiting."
        exit 1
    elif [[ -n "$WINDIR" ]] || [[ -n "$SYSTEMROOT" ]] || command -v cmd.exe >/dev/null 2>&1; then
        print_fail "Windows environment detected outside of WSL"
        print_info "Native Windows is not supported for ESOS development"
        print_info "Please install and use WSL2: wsl --install"
        echo ""
        echo "❌ Please run this script from within WSL2. Exiting."
        exit 1
    else
        print_warning "Unknown operating system: $OSTYPE"
        print_info "Proceeding with checks, but compatibility is not guaranteed"
    fi
    echo ""
}

echo "🌍 ESOS Development Environment Check"
echo "====================================="
echo ""

# Platform check must be first
check_platform

# Check Node.js
print_check "Node.js v18"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    NODE_VERSION_NUM=$(echo "$NODE_VERSION" | sed 's/v//')
    print_info "Found: Node.js $NODE_VERSION"
    
    if version_compare "$NODE_VERSION_NUM" "18.0.0" ">="; then
        if [[ "$NODE_VERSION_NUM" == 18.* ]]; then
            print_success "Node.js v18 is active"
        else
            print_warning "Node.js $NODE_VERSION is active (expected v18.x)"
        fi
    else
        print_fail "Node.js version is too old (found $NODE_VERSION, need v18+)"
    fi
else
    print_fail "Node.js is not installed"
fi
echo ""

# Check Yarn
print_check "Yarn package manager"
if command -v yarn >/dev/null 2>&1; then
    YARN_VERSION=$(yarn --version 2>/dev/null)
    print_info "Found: Yarn v$YARN_VERSION"
    print_success "Yarn is installed"
else
    print_fail "Yarn is not installed"
    print_info "Install with: npm install -g yarn"
fi
echo ""

# Check Angular CLI
print_check "Angular CLI v16"
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
        print_info "Found: Angular CLI v$NG_VERSION"
        
        if [[ "$NG_VERSION" == 16.* ]]; then
            print_success "Angular CLI v16 is installed"
        else
            print_warning "Angular CLI v$NG_VERSION is installed (expected v16.x)"
        fi
    else
        print_warning "Could not determine Angular CLI version"
        print_info "Try running: ng version"
    fi
else
    print_fail "Angular CLI is not installed"
    print_info "Install with: npm install -g @angular/cli@16"
fi
echo ""

# Check Java 17
print_check "Java 17"
if command -v java >/dev/null 2>&1; then
    JAVA_VERSION_FULL=$(java -version 2>&1 | head -n 1)
    JAVA_VERSION=$(echo "$JAVA_VERSION_FULL" | awk -F '"' '{print $2}' | awk -F '.' '{print $1}')
    
    print_info "Found: $JAVA_VERSION_FULL"

    if [ -n "$JAVA_HOME" ]; then
        print_info "JAVA_HOME: $JAVA_HOME"
    else
        print_warning "JAVA_HOME environment variable is not set"
    fi
    
    if [ "$JAVA_VERSION" = "17" ]; then
        print_success "Java 17 is active"
    else
        print_fail "Java $JAVA_VERSION is active (expected Java 17)"
        print_info "Check JAVA_HOME and PATH settings"
    fi
    
else
    print_fail "Java is not installed"
fi
echo ""

# Check Maven
print_check "Apache Maven with Java 17"
if command -v mvn >/dev/null 2>&1; then
    MVN_OUTPUT=$(mvn --version 2>/dev/null)
    MVN_VERSION=$(echo "$MVN_OUTPUT" | head -n 1 | awk '{print $3}')
    MVN_JAVA_VERSION=$(echo "$MVN_OUTPUT" | grep "Java version" | awk '{print $3}' | awk -F '.' '{print $1}' | sed 's/,//')
    
    print_info "Found: Apache Maven $MVN_VERSION"
    
    if [ -n "$MVN_JAVA_VERSION" ]; then
        print_info "Maven is using Java $MVN_JAVA_VERSION"
        
        if [ "$MVN_JAVA_VERSION" = "17" ]; then
            print_success "Maven is configured with Java 17"
        else
            print_fail "Maven is using Java $MVN_JAVA_VERSION (expected Java 17)"
            print_info "Fix JAVA_HOME or update Maven's Java configuration"
        fi
    else
        print_warning "Could not determine Java version used by Maven"
    fi
    
    # Check if using project's wrapper
    if [ -f "./mvnw" ]; then
        print_info "Maven wrapper (mvnw) is available in current directory"
    fi
else
    print_fail "Maven is not installed"
fi
echo ""

# Check Docker
print_check "Docker"
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    print_info "Found: Docker $DOCKER_VERSION"
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        print_success "Docker is installed and running"
    else
        print_warning "Docker is installed but daemon is not running"
    fi
    
else
    print_fail "Docker is not installed"
fi
echo ""


# Summary
echo "📊 Environment Check Summary"
echo "====================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
fi
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED${NC}"
fi
echo ""

# Overall status
if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 Environment is ready for ESOS development!${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Environment is mostly ready, but please check warnings above.${NC}"
        exit 0
    fi
else
    echo -e "${RED}❌ Environment setup is incomplete. Please fix the failed checks above.${NC}"
    echo ""
    echo "💡 Quick setup commands:"
    echo "  sudo apt update && sudo apt install openjdk-17-jdk maven docker.io docker-compose"
    echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  npm install -g yarn @angular/cli@16"
    echo "  sudo usermod -aG docker \$USER"
    echo ""
    exit 1
fi
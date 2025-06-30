#!/bin/bash

#############################################################################################################
#   Create test users - this script is intended to be run in a development environment only.
#
#   This script create a test user according to the parameters provided:
#
#       TYPE
#           accepted values are in (OPERATOR, REGULATOR, VERIFIER)
#
#       ROLE
#           if (TYPE=OPERATOR) then accepted values are (operator_admin, operator, consultant_agent, emitter_agent)
#           if (TYPE=REGULATOR) then accepted values are (ca_super_user, regulator_admin_team, regulator_team_leader, regulator_technical_officer, service_super_user)
#           if (TYPE=VERIFIER) then accepted values are (verifier_admin, verifier)
#
#       COMPETENT_AUTHORITY
#           accepted values are (ENGLAND, NORTHERN_IRELAND, SCOTLAND, WALES, OPRED)
#       EMAIL
#       PASSWORD
#       FIRST_NAME
#       LAST_NAME
#       JOB_TITLE
#       PHONE_NUMBER
#
# 
# Where possible, the script will use the ESOS REST API, and specifically the invitation system, to create the user.
# Doing it this way will ensure that the user is created with the correct roles and permissions.  
#
# To be able to invoke the ESOS REST API, there needs to be at least one registered user in the system with
# permissions to create users.  Therefore, the first time this script is run it will create a super-user
# with the appropriate permissions to create other users, by invoking the Keycloak REST API and by making the 
# appropriate inserts to the database.
# 
# The details required to create the super-user are provided in the environment variables, prefixed with 
# BOOTSTRAP_ADMIN_%s, which are expected to be set in the .env file.
#############################################################################################################

# Load environment variables and common functions
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
source "$SCRIPT_DIR/common-functions.sh"
load_environment_variables

# Check that required environment variables are set
REQUIRED_ENV_VARS=(
    "KC_BASE_URL" 
    "KC_BOOTSTRAP_ADMIN_USERNAME" 
    "KC_BOOTSTRAP_ADMIN_PASSWORD"
    "API_DB_NAME"
    "API_DB_USERNAME"
    "API_DB_PASSWORD"
    "API_KEYCLOAK_REALM"
    "API_APPLICATION_API_URL"
    "ESOS_APP_API_CLIENT_ID"
    "ESOS_APP_API_CLIENT_SECRET"
    "BOOTSTRAP_ADMIN_EMAIL"
    "BOOTSTRAP_ADMIN_PASSWORD"
    "BOOTSTRAP_ADMIN_FIRST_NAME"
    "BOOTSTRAP_ADMIN_LAST_NAME"
    "BOOTSTRAP_ADMIN_CA"
)

# Initialize logging
LOG_NAMESPACE="create-users"
init_log_counters "${LOG_NAMESPACE}"



show_usage() {
    print_banner "ESOS User Creation Script"
    log_note "Create test users for development environments only"
    log_note ""
    log_note "Usage: $0 TYPE ROLE COMPETENT_AUTHORITY EMAIL PASSWORD FIRST_NAME LAST_NAME JOB_TITLE PHONE_COUNTRY_CODE PHONE_NUMBER"
    log_note ""
    print_section "Parameters"
    log_note "TYPE                  User type (OPERATOR, REGULATOR, VERIFIER)"
    log_note "ROLE                  User role (see below for valid combinations)"
    log_note "COMPETENT_AUTHORITY   Authority (ENGLAND, NORTHERN_IRELAND, SCOTLAND, WALES, OPRED)"
    log_note "EMAIL                 User email address"
    log_note "PASSWORD              User password"
    log_note "FIRST_NAME            User first name"
    log_note "LAST_NAME             User last name"
    log_note "JOB_TITLE             User job title"
    log_note "PHONE_COUNTRY_CODE    Phone country code (e.g., 44 for UK, 1 for US)"
    log_note "PHONE_NUMBER          Phone number without country code"
    log_note ""
    print_section "Valid Role Combinations"
    log_note "OPERATOR roles:       operator_admin, operator, consultant_agent, emitter_contact"
    log_note "REGULATOR roles:      ca_super_user, regulator_admin_team, regulator_team_leader,"
    log_note "                        regulator_technical_officer, service_super_user"
    log_note "VERIFIER roles:       verifier_admin, verifier"
    log_note ""
    log_note "Examples"
    log_note "# Create operator admin"
    log_note "$0 OPERATOR operator_admin ENGLAND john@company.com MyPassword123! John Doe 'Operations Manager' 44 1234567890"
    log_note ""
    log_note "# Create regulator super user"
    log_note "$0 REGULATOR ca_super_user ENGLAND admin@regulator.gov.uk SecurePass1! Jane Smith 'Super Admin' 44 9876543210"
    log_note ""
    log_note "# Create verifier admin"
    log_note "$0 VERIFIER verifier_admin ENGLAND verifier@company.com VerifyPass1! Bob Wilson 'Verification Lead' 44 5556667777"
}

validate_parameters() {
    local user_type="${1:-}"
    local role="${2:-}"
    local competent_authority="${3:-}"
    local email="${4:-}"
    local password="${5:-}"
    local first_name="${6:-}"
    local last_name="${7:-}"
    local job_title="${8:-}"
    local phone_country_code="${9:-}"
    local phone_number="${10:-}"
    
    # Check if all parameters are provided
    if [[ -z "$user_type" || -z "$role" || -z "$competent_authority" || -z "$email" || 
          -z "$password" || -z "$first_name" || -z "$last_name" || -z "$job_title" || 
          -z "$phone_country_code" || -z "$phone_number" ]]; then
        log_error "All parameters are required"
        show_usage
        exit 1
    fi
    
    # Validate user type
    case "$user_type" in
        "OPERATOR"|"REGULATOR"|"VERIFIER")
            ;;
        *)
            log_error "Invalid user type: $user_type. Must be OPERATOR, REGULATOR, or VERIFIER"
            exit 1
            ;;
    esac
    
    # Validate role based on user type
    case "$user_type" in
        "OPERATOR")
            case "$role" in
                "operator_admin"|"operator"|"consultant_agent"|"emitter_contact")
                    ;;
                *)
                    log_error "Invalid OPERATOR role: $role"
                    log_note "Valid OPERATOR roles: operator_admin, operator, consultant_agent, emitter_contact"
                    exit 1
                    ;;
            esac
            ;;
        "REGULATOR")
            case "$role" in
                "ca_super_user"|"regulator_admin_team"|"regulator_team_leader"|"regulator_technical_officer"|"service_super_user")
                    ;;
                *)
                    log_error "Invalid REGULATOR role: $role"
                    log_note "Valid REGULATOR roles: ca_super_user, regulator_admin_team, regulator_team_leader, regulator_technical_officer, service_super_user"
                    exit 1
                    ;;
            esac
            ;;
        "VERIFIER")
            case "$role" in
                "verifier_admin"|"verifier")
                    ;;
                *)
                    log_error "Invalid VERIFIER role: $role"
                    log_note "Valid VERIFIER roles: verifier_admin, verifier"
                    exit 1
                    ;;
            esac
            ;;
    esac
    
    # Validate competent authority
    case "$competent_authority" in
        "ENGLAND"|"NORTHERN_IRELAND"|"SCOTLAND"|"WALES"|"OPRED")
            ;;
        *)
            log_error "Invalid competent authority: $competent_authority"
            log_note "Valid authorities: ENGLAND, NORTHERN_IRELAND, SCOTLAND, WALES, OPRED"
            exit 1
            ;;
    esac
    
    # Basic email validation
    if [[ ! "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        log_error "Invalid email format: $email"
        exit 1
    fi
    
    # Validate phone country code (should be 1-4 digits)
    if [[ ! "$phone_country_code" =~ ^[0-9]{1,4}$ ]]; then
        log_error "Invalid phone country code: $phone_country_code (should be 1-4 digits)"
        exit 1
    fi
    
    # Validate phone number (should be at least 6 digits)
    if [[ ! "$phone_number" =~ ^[0-9]{6,}$ ]]; then
        log_error "Invalid phone number: $phone_number (should be at least 6 digits, numbers only)"
        exit 1
    fi
    
    log_success "Parameter validation passed"
}

# Function to generate base64url encoding (JWT compliant)
base64url_encode() {
    local input="$1"
    # Use base64 with no padding and URL-safe characters
    echo -n "$input" | base64 -w 0 | tr '/+' '_-' | tr -d '='
}

# Function to generate JWT token for user registration
generate_registration_jwt() {
    local email="$1"
    local current_time=$(date +%s)
    local expiry_time=$((current_time + 259200))  # 3 days (4320 minutes)
    
    # JWT header - compact JSON
    local header='{"alg":"HS256","typ":"JWT"}'
    local header_b64=$(base64url_encode "$header")
    
    # JWT payload - must match exact format expected by Java application
    # Issuer should be just the Keycloak auth server URL, not the realm URL
    local auth_server_url="$API_KEYCLOAK_SERVERURL"
    local payload="{\"iss\":\"$auth_server_url\",\"iat\":$current_time,\"sub\":\"user_registration\",\"user_email\":\"$email\",\"aud\":\"uk-esos-web-app\",\"exp\":$expiry_time}"
    local payload_b64=$(base64url_encode "$payload")
    
    # Create signature
    local unsigned_token="${header_b64}.${payload_b64}"
    local signature=$(echo -n "$unsigned_token" | openssl dgst -sha256 -hmac "$ESOS_APP_API_CLIENT_SECRET" -binary | base64 -w 0 | tr -d '=' | tr '/+' '_-')
    
    # Complete JWT token
    echo "${unsigned_token}.${signature}"
}

# Function to generate JWT token for regulator invitation acceptance
generate_regulator_invitation_jwt() {
    local -n jwt_ref=$1
    local authority_uuid="$2"
    local current_time=$(date +%s)
    local expiry_time=$((current_time + 259200))  # 3 days
    
    # JWT header - must match exact format from real token
    local header='{"typ":"JWT","alg":"HS256"}'
    local header_b64=$(base64url_encode "$header")
    
    # JWT payload for regulator invitation - must match exact format from real token
    local auth_server_url="$API_KEYCLOAK_SERVERURL"
    # Use jq to properly construct JSON and avoid quote escaping issues
    local payload=$(jq -n \
        --arg sub "regulator_invitation" \
        --arg aud "uk-esos-web-app" \
        --arg iss "$auth_server_url" \
        --arg authority_uuid "$authority_uuid" \
        --argjson exp "$expiry_time" \
        --argjson iat "$current_time" \
        --argjson nbf "$current_time" \
        '{sub: $sub, aud: $aud, iss: $iss, authority_uuid: $authority_uuid, exp: $exp, iat: $iat, nbf: $nbf}')
    local payload_b64=$(base64url_encode "$payload")
    
    log_debug "JWT generation debug:"
    log_debug "  Header: $header"
    log_debug "  Header B64: $header_b64"
    log_debug "  Payload: $payload"
    log_debug "  Payload B64: $payload_b64"
    log_debug "  Auth server URL: $auth_server_url"
    log_debug "  Secret (first 10 chars): ${ESOS_APP_API_CLIENT_SECRET:0:10}..."
    
    # Create signature - use exact same method as working operator JWT
    local unsigned_token="${header_b64}.${payload_b64}"
    local signature=$(echo -n "$unsigned_token" | openssl dgst -sha256 -hmac "$ESOS_APP_API_CLIENT_SECRET" -binary | base64 -w 0 | tr -d '=' | tr '/+' '_-')
    
    log_debug "  Unsigned token: $unsigned_token"
    log_debug "  Signature: $signature"
    
    jwt_ref="${unsigned_token}.${signature}"
}

check_or_create_bootstrap_admin() {
    print_section "Checking Bootstrap Admin"
    
    # Check if a super admin already exists in the database
    local existing_admin=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
        "SELECT COUNT(*) FROM au_authority WHERE code = 'ca_super_user' AND status = 'ACTIVE'" 2>/dev/null | xargs)
    
    if [[ "$existing_admin" -gt 0 ]]; then
        log_note "Bootstrap admin already exists"
        return 0
    fi
    
    log_note "No bootstrap admin found. Creating one..."
    
    # Create bootstrap admin user
    local bootstrap_email="${BOOTSTRAP_ADMIN_EMAIL}"
    local bootstrap_first_name="${BOOTSTRAP_ADMIN_FIRST_NAME}"
    local bootstrap_last_name="${BOOTSTRAP_ADMIN_LAST_NAME}"
    local bootstrap_password="${BOOTSTRAP_ADMIN_PASSWORD}"
    local bootstrap_ca="${BOOTSTRAP_ADMIN_CA}"
    
    log_note "Creating bootstrap admin: $bootstrap_email"
    
    # Get Keycloak admin token
    local admin_token=$(get_keycloak_admin_access_token)
    if [[ "$admin_token" == "null" || -z "$admin_token" ]]; then
        log_error "Failed to get Keycloak admin token"
        return 1
    fi
    
    # Create user in Keycloak
    local keycloak_user_response=$(curl -s -w "%{http_code}" -X POST \
        "$KC_BASE_URL/admin/realms/$API_KEYCLOAK_REALM/users" \
        -H "Authorization: Bearer $admin_token" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$bootstrap_email\",
            \"email\": \"$bootstrap_email\",
            \"firstName\": \"$bootstrap_first_name\",
            \"lastName\": \"$bootstrap_last_name\",
            \"enabled\": true,
            \"emailVerified\": true,
            \"credentials\": [{
                \"type\": \"password\",
                \"value\": \"$bootstrap_password\",
                \"temporary\": false
            }]
        }")
    
    local http_code="${keycloak_user_response: -3}"
    if [[ "$http_code" != "201" ]]; then
        log_error "Failed to create Keycloak user. HTTP code: $http_code"
        return 1
    fi
    
    # Get the created user ID from Keycloak
    local keycloak_user_id=$(curl -s -X GET \
        "$KC_BASE_URL/admin/realms/$API_KEYCLOAK_REALM/users?username=$bootstrap_email" \
        -H "Authorization: Bearer $admin_token" | jq -r '.[0].id')
    
    if [[ "$keycloak_user_id" == "null" || -z "$keycloak_user_id" ]]; then
        log_error "Failed to get Keycloak user ID"
        return 1
    fi
    
    log_debug "Created Keycloak user with ID: $keycloak_user_id"
    
    # Create authority record in database
    local authority_sql="
        INSERT INTO au_authority (id, user_id, code, status, competent_authority, creation_date, created_by)
        VALUES (nextval('au_authority_seq'), '$keycloak_user_id', 'ca_super_user', 'ACTIVE', '$bootstrap_ca', NOW(), 'SYSTEM')
        RETURNING id;
    "
    
    local authority_id=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -q -c "$authority_sql" 2>/dev/null | xargs)
    
    if [[ -z "$authority_id" || "$authority_id" == "" ]]; then
        log_error "Failed to create authority record"
        return 1
    fi
    
    log_debug "Created authority record with ID: $authority_id"
    
    # Copy permissions from role template to authority
    local permissions_sql="
        INSERT INTO au_authority_permission (id, authority_id, permission)
        SELECT nextval('au_authority_permission_seq'), $authority_id, arp.permission
        FROM au_role_permission arp
        JOIN au_role ar ON arp.role_id = ar.id
        WHERE ar.code = 'ca_super_user';
    "
    
    PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -c "$permissions_sql"
    
    local permissions_count=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
        "SELECT COUNT(*) FROM au_authority_permission WHERE authority_id = $authority_id" 2>/dev/null | xargs)
    
    log_debug "Copied $permissions_count permissions to bootstrap admin"
    log_success "Bootstrap admin created successfully!"
    
    # Give Keycloak a moment to make the user available for authentication
    log_debug "Waiting 2 seconds for Keycloak user to be available..."
    sleep 2
    
    return 0
}

get_esos_api_token() {
    local -n token_ref=$1
    local email="$2"
    local password="$3"
    
    log_debug "Attempting to get API token for user: $email"
    log_debug "Using realm: $API_KEYCLOAK_REALM"
    log_debug "Using KC_BASE_URL: $KC_BASE_URL"
    log_debug "Using client_id: $ESOS_APP_API_CLIENT_ID"
    
    # First, get token from Keycloak using user credentials
    local token_response=$(curl -s -X POST \
        "$KC_BASE_URL/realms/$API_KEYCLOAK_REALM/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "client_id=${ESOS_APP_API_CLIENT_ID}" \
        -d "grant_type=password" \
        -d "username=$email" \
        -d "password=$password")
    
    log_debug "Token response: $token_response"
    
    local access_token=$(echo "$token_response" | jq -r '.access_token // empty')
    
    if [[ -z "$access_token" || "$access_token" == "null" ]]; then
        log_error "Failed to get API access token for user: $email"
        log_error "Token response was: $token_response"
        
        # Check if it's an invalid_client error
        if echo "$token_response" | grep -q "invalid_client"; then
            log_error "Keycloak client 'esos-web-app' is not properly configured"
            log_error "Please ensure the client exists and supports password grant type"
        fi
        
        return 1
    fi
    
    log_debug "Successfully obtained API token"
    token_ref="$access_token"
}

create_user_via_api() {
    local user_type="$1"
    local role="$2"
    local competent_authority="$3"
    local email="$4"
    local password="$5"
    local first_name="$6"
    local last_name="$7"
    local job_title="$8"
    local phone_country_code="$9"
    local phone_number="${10}"
    
    print_section "Creating User via API"
    
    # For OPERATOR users, we don't need an API token (public endpoint)
    if [[ "$user_type" == "OPERATOR" ]]; then
        create_operator_user "$role" "$email" "$password" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
        return $?
    fi
    
    # For REGULATOR and VERIFIER users, we need an API token
    local bootstrap_email="${BOOTSTRAP_ADMIN_EMAIL}"
    local bootstrap_password="${BOOTSTRAP_ADMIN_PASSWORD}"
    
    local api_token
    if ! get_esos_api_token api_token "$bootstrap_email" "$bootstrap_password"; then
        log_error "Failed to get API token"
        return 1
    fi
    
    case "$user_type" in
        "REGULATOR")
            create_regulator_user "$api_token" "$role" "$competent_authority" "$email" "$password" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
            ;;
        "VERIFIER")
            create_verifier_user "$api_token" "$role" "$email" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
            ;;
        *)
            log_error "Unsupported user type for API creation: $user_type"
            return 1
            ;;
    esac
}

create_regulator_user() {
    local api_token="$1"
    local role="$2"
    local competent_authority="$3"
    local email="$4"
    local password="$5"
    local first_name="$6"
    local last_name="$7"
    local job_title="$8"
    local phone_country_code="$9"
    local phone_number="${10}"
    
    log_note "Creating regulator user via API..."
    # log_debug "Using API URL: $API_APPLICATION_API_URL"
    
    if [[ -z "$API_APPLICATION_API_URL" ]]; then
        log_error "API_APPLICATION_API_URL environment variable is not set"
        return 1
    fi
    
    # Create invitation request JSON
    local invitation_data=$(jq -n \
        --arg email "$email" \
        --arg firstName "$first_name" \
        --arg lastName "$last_name" \
        --arg jobTitle "$job_title" \
        --arg phoneNumber "$phone_country_code$phone_number" \
        '{
            "email": $email,
            "firstName": $firstName,
            "lastName": $lastName,
            "jobTitle": $jobTitle,
            "phoneNumber": $phoneNumber,
            "mobileNumber": "",
            "permissions": {
                "MANAGE_USERS_AND_CONTACTS": "NONE",
                "ASSIGN_REASSIGN_TASKS": "NONE",
                "REVIEW_ORGANISATION_ACCOUNT": "VIEW_ONLY"
            }
        }')
    
    # log_debug "Request URL: $API_APPLICATION_API_URL/v1.0/regulator-users/invite"
    # log_debug "Request JSON: $invitation_data"
    
    # Create temporary file for JSON data
    local temp_file=$(mktemp)
    echo "$invitation_data" > "$temp_file"
    
    # Debug: check if temp file is corrupted when DEBUG logging enabled
    if [[ "$COMMON_LOG_STD_LEVEL" == "DEBUG" ]]; then
        log_debug "Temp file contents:"
        log_debug "$(cat "$temp_file")"
        log_debug "End of temp file"
        
        # Additional debugging to verify the HTTP request
        log_debug "About to make curl request with:"
        log_debug "  URL: $API_APPLICATION_API_URL/v1.0/regulator-users/invite"
        log_debug "  Token (first 20 chars): ${api_token:0:20}..."
        log_debug "  Temp file size: $(wc -c < "$temp_file") bytes"
    fi
    
    local response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/regulator-users/invite" \
        -H "Authorization: Bearer $api_token" \
        -F "regulatorInvitedUser=@$temp_file;type=application/json")
    
    # Clean up temporary file
    rm -f "$temp_file"
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" == "200" || "$http_code" == "204" ]]; then
        log_success "Regulator invitation sent successfully"
        
        # Automatically accept the invitation using JWT token
        log_note "Automatically accepting invitation..."
        
        # Get the invitation token (authority UUID) from database
        log_note "Looking up invitation token from database..."
        sleep 2  # Wait for authority record to be created
        
        # First get Keycloak user ID via API
        local admin_token=$(get_keycloak_admin_access_token)
        if [[ "$admin_token" == "null" || -z "$admin_token" ]]; then
            log_error "Failed to get Keycloak admin token"
            log_note "User must manually accept invitation via email"
            return 0
        fi
        
        local keycloak_user_id=$(curl -s -X GET \
            "$KC_BASE_URL/admin/realms/$API_KEYCLOAK_REALM/users?email=$email" \
            -H "Authorization: Bearer $admin_token" | jq -r '.[0].id // empty')
        
        if [[ -z "$keycloak_user_id" || "$keycloak_user_id" == "null" ]]; then
            log_error "Could not find Keycloak user ID for email: $email"
            log_note "User must manually accept invitation via email"
            return 0
        fi
        
        log_note "Found Keycloak user ID: $keycloak_user_id"
        
        # Now get the authority UUID using the Keycloak user ID
        local invitation_token=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
            "SELECT uuid FROM au_authority WHERE user_id = '$keycloak_user_id' AND status = 'PENDING' ORDER BY creation_date DESC LIMIT 1;" 2>/dev/null | xargs)
        
        if [[ -z "$invitation_token" || "$invitation_token" == "" ]]; then
            log_error "Could not find invitation token for user ID: $keycloak_user_id"
            log_note "User must manually accept invitation via email"
            return 0
        fi
        
        log_note "Found authority UUID: $invitation_token"
        
        # Create JWT token with the authority UUID (API requires JWT format)
        log_debug "Generating JWT token with authority UUID: $invitation_token"
        local jwt_token
        if ! generate_regulator_invitation_jwt jwt_token "$invitation_token"; then
            log_error "Failed to generate JWT token"
            log_note "User must manually accept invitation via email"
            return 0
        fi
        
        log_note "Generated JWT token: ${jwt_token:0:50}...${jwt_token: -20}"
        
        # Step 1: Accept invitation using the JWT token
        log_debug "Accepting invitation with JWT token..."
        local accept_response=$(curl -s -w "%{http_code}" -X POST \
            "$API_APPLICATION_API_URL/v1.0/regulator-users/registration/accept-invitation" \
            -H "Content-Type: application/json" \
            -d "{\"token\": \"$jwt_token\"}")
        
        local accept_http_code="${accept_response: -3}"
        local accept_response_body="${accept_response%???}"
        
        if [[ "$accept_http_code" != "200" ]]; then
            log_error "Failed to accept invitation. HTTP code: $accept_http_code"
            log_note "Response: $accept_response_body"
            log_note "User must manually accept invitation via email"
            return 0  # Don't fail completely, invitation was sent
        fi
        
        log_debug "Invitation accepted successfully"
        
        # Step 2: Enable user with password
        log_note "Enabling user account with credentials..."
        local enable_data=$(jq -n \
            --arg invitationToken "$jwt_token" \
            --arg password "$password" \
            '{
                "invitationToken": $invitationToken,
                "password": $password
            }')
        
        local enable_response=$(curl -s -w "%{http_code}" -X PUT \
            "$API_APPLICATION_API_URL/v1.0/regulator-users/registration/enable-from-invitation" \
            -H "Content-Type: application/json" \
            -d "$enable_data")
        
        local enable_http_code="${enable_response: -3}"
        local enable_response_body="${enable_response%???}"
        
        if [[ "$enable_http_code" == "204" ]]; then
            log_success "Regulator user registration completed successfully!"
            log_note "User details:"
            log_note "  Email: $email"
            log_note "  Name: $first_name $last_name"
            log_note "  Status: ACTIVE"
            log_note ""
            log_note "User can now login with: $email / $password"
            return 0
        else
            log_error "Failed to enable user account. HTTP code: $enable_http_code"
            log_note "Response: $enable_response_body"
            log_note "User must manually complete registration via email"
            return 0  # Don't fail completely, invitation was sent
        fi
    else
        log_error "Failed to send regulator invitation. HTTP code: $http_code"
        log_note "Response: $response_body"
        return 1
    fi
}

create_operator_user() {
    local role="$1" 
    local email="$2"
    local password="$3"
    local first_name="$4"
    local last_name="$5"
    local job_title="$6"
    local phone_country_code="$7"
    local phone_number="$8"
    
    log_note "Creating operator user via automated registration..."
    
    # Step 1: Generate JWT token for registration
    log_debug "Generating registration token for: $email"
    local jwt_token=$(generate_registration_jwt "$email")
    
    if [[ -z "$jwt_token" ]]; then
        log_error "Failed to generate registration token"
        return 1
    fi
    
    log_debug "Generated registration token"
    
    # Step 2: Verify the token (optional validation step)
    log_debug "Verifying registration token..."
    local verify_response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/operator-users/registration/token-verification" \
        -H "Content-Type: application/json" \
        -d "{\"token\": \"$jwt_token\"}")
    
    local verify_http_code="${verify_response: -3}"
    local verify_response_body="${verify_response%???}"
    
    if [[ "$verify_http_code" == "200" ]]; then
        log_debug "Token verification successful"
    else
        log_warn "Token verification failed (HTTP: $verify_http_code)"
        log_note "Response: $verify_response_body"
    fi
    
    # Step 3: Complete the registration
    log_note "Completing user registration..."
    
    # Build registration payload using jq to properly escape JSON
    local registration_data=$(jq -n \
        --arg emailToken "$jwt_token" \
        --arg firstName "$first_name" \
        --arg lastName "$last_name" \
        --arg jobTitle "$job_title" \
        --arg password "$password" \
        --arg countryCode "$phone_country_code" \
        --arg number "$phone_number" \
        '{
            "emailToken": $emailToken,
            "firstName": $firstName,
            "lastName": $lastName,
            "jobTitle": $jobTitle,
            "address": {
                "line1": "123 Default Street",
                "city": "London",
                "county": "London",
                "postcode": "SW1A 1AA"
            },
            "phoneNumber": {
                "countryCode": $countryCode,
                "number": $number
            },
            "password": $password,
            "termsVersion": 1
        }')
    
    local registration_response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/operator-users/registration/register" \
        -H "Content-Type: application/json" \
        -d "$registration_data")
    
    local reg_http_code="${registration_response: -3}"
    local reg_response_body="${registration_response%???}"
    
    if [[ "$reg_http_code" == "200" ]]; then
        log_success "Operator user registration completed successfully!"
        log_note "User details:"
        log_note "  Email: $email"
        log_note "  Name: $first_name $last_name"
        log_note "  Status: REGISTERED"
        log_note ""
        log_note "Next steps for user:"
        log_note "1. Login to the application using: $email / $password"
        log_note "2. Click 'Apply for new organisation account'"
        log_note "3. Complete the organization account application"
        log_note "4. Wait for regulatory approval"
        return 0
    else
        log_error "Registration failed (HTTP: $reg_http_code)"
        log_note "Response: $reg_response_body"
        
        # Fallback to manual instructions
        log_warn "Falling back to manual registration approach"
        log_note "Please complete registration manually:"
        log_note "1. Visit the application registration page"
        log_note "2. Click 'Create a sign in'"
        log_note "3. Enter email: $email"
        log_note "4. Complete verification and registration with provided details"
        return 1
    fi
}

create_verifier_user() {
    local api_token="$1"
    local role="$2"
    local email="$3"
    local first_name="$4"
    local last_name="$5"
    local job_title="$6"
    local phone_country_code="$7"
    local phone_number="$8"
    
    log_note "Creating verifier user via API..."
    log_debug "Using API URL: $API_APPLICATION_API_URL"
    
    if [[ -z "$API_APPLICATION_API_URL" ]]; then
        log_error "API_APPLICATION_API_URL environment variable is not set"
        return 1
    fi
    
    # Create invitation request JSON - verifier API expects different structure
    local invitation_data=$(jq -n \
        --arg email "$email" \
        --arg firstName "$first_name" \
        --arg lastName "$last_name" \
        --arg roleCode "$role" \
        --arg phoneNumber "$phone_country_code$phone_number" \
        '{
            "email": $email,
            "firstName": $firstName,
            "lastName": $lastName,
            "roleCode": $roleCode,
            "phoneNumber": $phoneNumber,
            "mobileNumber": ""
        }')
    
    log_debug "Request URL: $API_APPLICATION_API_URL/v1.0/verifier-users/invite"
    log_debug "Request JSON: $invitation_data"
    
    local response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/verifier-users/invite" \
        -H "Authorization: Bearer $api_token" \
        -H "Content-Type: application/json" \
        -d "$invitation_data")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" == "200" || "$http_code" == "204" ]]; then
        log_success "Verifier invitation sent successfully"
        log_note "User must check email and accept invitation to complete registration"
        return 0
    else
        log_error "Failed to send verifier invitation. HTTP code: $http_code"
        log_note "Response: $response_body"
        return 1
    fi
}

create_user_main() {
    
    # Show usage if no parameters are provided
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 0
    fi
    
    # Check environment variables
    check_environment_variables REQUIRED_ENV_VARS
    
    # Validate parameters
    validate_parameters "$@"
    
    local user_type="$1"
    local role="$2"
    local competent_authority="$3"
    local email="$4"
    local password="$5"
    local first_name="$6"
    local last_name="$7"
    local job_title="$8"
    local phone_country_code="$9"
    local phone_number="${10}"
    
    print_banner "Creating $user_type user with role $role"
    log_note "Email: $email"
    log_note "Name: $first_name $last_name"
    log_note "Authority: $competent_authority"
    
    # Check if bootstrap admin exists, create if needed
    check_or_create_bootstrap_admin
    
    # Create user via appropriate API
    create_user_via_api "$user_type" "$role" "$competent_authority" "$email" "$password" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
   
}

# Only run main function if script is executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    set -e
    create_user_main "$@"
fi
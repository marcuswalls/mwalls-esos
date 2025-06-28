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
source "$SCRIPT_DIR/load-env-vars.sh"
source "$SCRIPT_DIR/common-functions.sh"

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
    print_banner "🎯 ESOS User Creation Script"
    print_info "Create test users for development environments only"
    echo ""
    echo "Usage: $0 TYPE ROLE COMPETENT_AUTHORITY EMAIL PASSWORD FIRST_NAME LAST_NAME JOB_TITLE PHONE_COUNTRY_CODE PHONE_NUMBER"
    echo ""
    print_section "Parameters"
    echo "  TYPE                  User type (OPERATOR, REGULATOR, VERIFIER)"
    echo "  ROLE                  User role (see below for valid combinations)"
    echo "  COMPETENT_AUTHORITY   Authority (ENGLAND, NORTHERN_IRELAND, SCOTLAND, WALES, OPRED)"
    echo "  EMAIL                 User email address"
    echo "  PASSWORD              User password"
    echo "  FIRST_NAME            User first name"
    echo "  LAST_NAME             User last name"
    echo "  JOB_TITLE             User job title"
    echo "  PHONE_COUNTRY_CODE    Phone country code (e.g., 44 for UK, 1 for US)"
    echo "  PHONE_NUMBER          Phone number without country code"
    echo ""
    print_section "Valid Role Combinations"
    echo "  OPERATOR roles:       operator_admin, operator, consultant_agent, emitter_contact"
    echo "  REGULATOR roles:      ca_super_user, regulator_admin_team, regulator_team_leader,"
    echo "                        regulator_technical_officer, service_super_user"
    echo "  VERIFIER roles:       verifier_admin, verifier"
    echo ""
    print_section "Examples"
    echo "  # Create operator admin"
    echo "  $0 OPERATOR operator_admin ENGLAND john@company.com MyPass123! John Doe 'Operations Manager' 44 1234567890"
    echo ""
    echo "  # Create regulator super user"
    echo "  $0 REGULATOR ca_super_user ENGLAND admin@regulator.gov.uk SecurePass1! Jane Smith 'Super Admin' 44 9876543210"
    echo ""
    echo "  # Create verifier admin"
    echo "  $0 VERIFIER verifier_admin ENGLAND verifier@company.com VerifyPass1! Bob Wilson 'Verification Lead' 44 5556667777"
}

validate_parameters() {
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
    
    # Check if all parameters are provided
    if [[ -z "$user_type" || -z "$role" || -z "$competent_authority" || -z "$email" || 
          -z "$password" || -z "$first_name" || -z "$last_name" || -z "$job_title" || 
          -z "$phone_country_code" || -z "$phone_number" ]]; then
        print_error "All parameters are required" "${LOG_NAMESPACE}"
        show_usage
        exit 1
    fi
    
    # Validate user type
    case "$user_type" in
        "OPERATOR"|"REGULATOR"|"VERIFIER")
            ;;
        *)
            print_error "Invalid user type: $user_type. Must be OPERATOR, REGULATOR, or VERIFIER" "${LOG_NAMESPACE}"
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
                    print_error "Invalid OPERATOR role: $role" "${LOG_NAMESPACE}"
                    print_note "Valid OPERATOR roles: operator_admin, operator, consultant_agent, emitter_contact"
                    exit 1
                    ;;
            esac
            ;;
        "REGULATOR")
            case "$role" in
                "ca_super_user"|"regulator_admin_team"|"regulator_team_leader"|"regulator_technical_officer"|"service_super_user")
                    ;;
                *)
                    print_error "Invalid REGULATOR role: $role" "${LOG_NAMESPACE}"
                    print_note "Valid REGULATOR roles: ca_super_user, regulator_admin_team, regulator_team_leader, regulator_technical_officer, service_super_user"
                    exit 1
                    ;;
            esac
            ;;
        "VERIFIER")
            case "$role" in
                "verifier_admin"|"verifier")
                    ;;
                *)
                    print_error "Invalid VERIFIER role: $role" "${LOG_NAMESPACE}"
                    print_note "Valid VERIFIER roles: verifier_admin, verifier"
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
            print_error "Invalid competent authority: $competent_authority" "${LOG_NAMESPACE}"
            print_note "Valid authorities: ENGLAND, NORTHERN_IRELAND, SCOTLAND, WALES, OPRED"
            exit 1
            ;;
    esac
    
    # Basic email validation
    if [[ ! "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        print_error "Invalid email format: $email" "${LOG_NAMESPACE}"
        exit 1
    fi
    
    # Validate phone country code (should be 1-4 digits)
    if [[ ! "$phone_country_code" =~ ^[0-9]{1,4}$ ]]; then
        print_error "Invalid phone country code: $phone_country_code (should be 1-4 digits)" "${LOG_NAMESPACE}"
        exit 1
    fi
    
    # Validate phone number (should be at least 6 digits)
    if [[ ! "$phone_number" =~ ^[0-9]{6,}$ ]]; then
        print_error "Invalid phone number: $phone_number (should be at least 6 digits, numbers only)" "${LOG_NAMESPACE}"
        exit 1
    fi
    
    print_success "Parameter validation passed" "${LOG_NAMESPACE}"
}

# Function to generate base64url encoding (JWT compliant)
base64url_encode() {
    local input="$1"
    echo -n "$input" | base64 -w 0 | tr -d '=' | tr '/+' '_-'
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
    local auth_server_url="${API_KEYCLOAK_SERVERURL:-$KC_BASE_URL}"
    local payload="{\"iss\":\"$auth_server_url\",\"iat\":$current_time,\"sub\":\"user_registration\",\"user_email\":\"$email\",\"aud\":\"uk-esos-web-app\",\"exp\":$expiry_time}"
    local payload_b64=$(base64url_encode "$payload")
    
    # Create signature
    local unsigned_token="${header_b64}.${payload_b64}"
    local signature=$(echo -n "$unsigned_token" | openssl dgst -sha256 -hmac "$ESOS_APP_API_CLIENT_SECRET" -binary | base64 -w 0 | tr -d '=' | tr '/+' '_-')
    
    # Complete JWT token
    echo "${unsigned_token}.${signature}"
}

check_or_create_bootstrap_admin() {
    print_section "Checking Bootstrap Admin"
    
    # Check if a super admin already exists in the database
    local existing_admin=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -c \
        "SELECT COUNT(*) FROM au_authority WHERE code = 'ca_super_user' AND status = 'ACTIVE'" 2>/dev/null | xargs)
    
    if [[ "$existing_admin" -gt 0 ]]; then
        print_success "Bootstrap admin already exists" "${LOG_NAMESPACE}"
        return 0
    fi
    
    print_info "No bootstrap admin found. Creating one..."
    
    # Create bootstrap admin user
    local bootstrap_email="${BOOTSTRAP_ADMIN_EMAIL}"
    local bootstrap_first_name="${BOOTSTRAP_ADMIN_FIRST_NAME}"
    local bootstrap_last_name="${BOOTSTRAP_ADMIN_LAST_NAME}"
    local bootstrap_password="${BOOTSTRAP_ADMIN_PASSWORD}"
    local bootstrap_ca="${BOOTSTRAP_ADMIN_CA}"
    
    print_info "Creating bootstrap admin: $bootstrap_email"
    
    # Get Keycloak admin token
    local admin_token=$(getKeycloakAdminAccessToken)
    if [[ "$admin_token" == "null" || -z "$admin_token" ]]; then
        print_error "Failed to get Keycloak admin token" "${LOG_NAMESPACE}"
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
        print_error "Failed to create Keycloak user. HTTP code: $http_code" "${LOG_NAMESPACE}"
        return 1
    fi
    
    # Get the created user ID from Keycloak
    local keycloak_user_id=$(curl -s -X GET \
        "$KC_BASE_URL/admin/realms/$API_KEYCLOAK_REALM/users?username=$bootstrap_email" \
        -H "Authorization: Bearer $admin_token" | jq -r '.[0].id')
    
    if [[ "$keycloak_user_id" == "null" || -z "$keycloak_user_id" ]]; then
        print_error "Failed to get Keycloak user ID" "${LOG_NAMESPACE}"
        return 1
    fi
    
    print_success "Created Keycloak user with ID: $keycloak_user_id" "${LOG_NAMESPACE}"
    
    # Create authority record in database
    local authority_sql="
        INSERT INTO au_authority (id, user_id, code, status, competent_authority, creation_date, created_by)
        VALUES (nextval('au_authority_seq'), '$keycloak_user_id', 'ca_super_user', 'ACTIVE', '$bootstrap_ca', NOW(), 'SYSTEM')
        RETURNING id;
    "
    
    local authority_id=$(PGPASSWORD="$API_DB_PASSWORD" psql -h "${API_DB_HOST:-localhost}" -p "${API_DB_PORT:-5433}" -U "$API_DB_USERNAME" -d "$API_DB_NAME" -t -q -c "$authority_sql" 2>/dev/null | xargs)
    
    if [[ -z "$authority_id" || "$authority_id" == "" ]]; then
        print_error "Failed to create authority record" "${LOG_NAMESPACE}"
        return 1
    fi
    
    print_success "Created authority record with ID: $authority_id" "${LOG_NAMESPACE}"
    
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
    
    print_success "Copied $permissions_count permissions to bootstrap admin" "${LOG_NAMESPACE}"
    print_success "Bootstrap admin created successfully!" "${LOG_NAMESPACE}"
    
    return 0
}

get_esos_api_token() {
    local email="$1"
    local password="$2"
    
    # First, get token from Keycloak using user credentials
    local token_response=$(curl -s -X POST \
        "$KC_BASE_URL/realms/$API_KEYCLOAK_REALM/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "client_id=esos-web-app" \
        -d "grant_type=password" \
        -d "username=$email" \
        -d "password=$password")
    
    local access_token=$(echo "$token_response" | jq -r '.access_token // empty')
    
    if [[ -z "$access_token" || "$access_token" == "null" ]]; then
        print_error "Failed to get API access token for user: $email" "${LOG_NAMESPACE}"
        return 1
    fi
    
    echo "$access_token"
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
    
    local api_token=$(get_esos_api_token "$bootstrap_email" "$bootstrap_password")
    if [[ $? -ne 0 || -z "$api_token" ]]; then
        print_error "Failed to get API token" "${LOG_NAMESPACE}"
        return 1
    fi
    
    case "$user_type" in
        "REGULATOR")
            create_regulator_user "$api_token" "$role" "$competent_authority" "$email" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
            ;;
        "VERIFIER")
            create_verifier_user "$api_token" "$role" "$email" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
            ;;
        *)
            print_error "Unsupported user type for API creation: $user_type" "${LOG_NAMESPACE}"
            return 1
            ;;
    esac
}

create_regulator_user() {
    local api_token="$1"
    local role="$2"
    local competent_authority="$3"
    local email="$4"
    local first_name="$5"
    local last_name="$6"
    local job_title="$7"
    local phone_country_code="$8"
    local phone_number="$9"
    
    print_info "Creating regulator user via API..."
    
    # Create invitation request
    local invitation_data=$(jq -n \
        --arg email "$email" \
        --arg firstName "$first_name" \
        --arg lastName "$last_name" \
        --arg jobTitle "$job_title" \
        --arg countryCode "$phone_country_code" \
        --arg number "$phone_number" \
        '{
            "email": $email,
            "firstName": $firstName,
            "lastName": $lastName,
            "jobTitle": $jobTitle,
            "phoneNumber": {
                "countryCode": $countryCode,
                "number": $number
            },
            "permissions": {
                "PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK": "VIEW_ONLY"
            }
        }')
    
    local response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/regulator-users/invite" \
        -H "Authorization: Bearer $api_token" \
        -H "Content-Type: application/json" \
        -d "$invitation_data")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" == "200" || "$http_code" == "204" ]]; then
        print_success "Regulator invitation sent successfully" "${LOG_NAMESPACE}"
        print_note "User must check email and accept invitation to complete registration"
        return 0
    else
        print_error "Failed to send regulator invitation. HTTP code: $http_code" "${LOG_NAMESPACE}"
        print_note "Response: $response_body"
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
    
    print_info "Creating operator user via automated registration..."
    
    # Step 1: Generate JWT token for registration
    print_info "Generating registration token for: $email"
    local jwt_token=$(generate_registration_jwt "$email")
    
    if [[ -z "$jwt_token" ]]; then
        print_error "Failed to generate registration token" "${LOG_NAMESPACE}"
        return 1
    fi
    
    print_success "Generated registration token" "${LOG_NAMESPACE}"
    
    # Step 2: Verify the token (optional validation step)
    print_info "Verifying registration token..."
    local verify_response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/operator-users/registration/token-verification" \
        -H "Content-Type: application/json" \
        -d "{\"token\": \"$jwt_token\"}")
    
    local verify_http_code="${verify_response: -3}"
    local verify_response_body="${verify_response%???}"
    
    if [[ "$verify_http_code" == "200" ]]; then
        print_success "Token verification successful" "${LOG_NAMESPACE}"
    else
        print_warning "Token verification failed (HTTP: $verify_http_code)" "${LOG_NAMESPACE}"
        print_note "Response: $verify_response_body"
    fi
    
    # Step 3: Complete the registration
    print_info "Completing user registration..."
    
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
        print_success "Operator user registration completed successfully!" "${LOG_NAMESPACE}"
        print_note "User details:"
        print_note "  Email: $email"
        print_note "  Name: $first_name $last_name"
        print_note "  Status: REGISTERED"
        print_note ""
        print_note "Next steps for user:"
        print_note "1. Login to the application using: $email / $password"
        print_note "2. Click 'Apply for new organisation account'"
        print_note "3. Complete the organization account application"
        print_note "4. Wait for regulatory approval"
        return 0
    else
        print_error "Registration failed (HTTP: $reg_http_code)" "${LOG_NAMESPACE}"
        print_note "Response: $reg_response_body"
        
        # Fallback to manual instructions
        print_warning "Falling back to manual registration approach" "${LOG_NAMESPACE}"
        print_note "Please complete registration manually:"
        print_note "1. Visit the application registration page"
        print_note "2. Click 'Create a sign in'"
        print_note "3. Enter email: $email"
        print_note "4. Complete verification and registration with provided details"
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
    
    print_info "Creating verifier user via API..."
    
    # Create invitation request  
    local invitation_data=$(jq -n \
        --arg email "$email" \
        --arg firstName "$first_name" \
        --arg lastName "$last_name" \
        --arg jobTitle "$job_title" \
        --arg countryCode "$phone_country_code" \
        --arg number "$phone_number" \
        '{
            "email": $email,
            "firstName": $firstName,
            "lastName": $lastName,
            "jobTitle": $jobTitle,
            "phoneNumber": {
                "countryCode": $countryCode,
                "number": $number
            }
        }')
    
    local response=$(curl -s -w "%{http_code}" -X POST \
        "$API_APPLICATION_API_URL/v1.0/verifier-users/invite" \
        -H "Authorization: Bearer $api_token" \
        -H "Content-Type: application/json" \
        -d "$invitation_data")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" == "200" || "$http_code" == "204" ]]; then
        print_success "Verifier invitation sent successfully" "${LOG_NAMESPACE}"
        print_note "User must check email and accept invitation to complete registration"
        return 0
    else
        print_error "Failed to send verifier invitation. HTTP code: $http_code" "${LOG_NAMESPACE}"
        print_note "Response: $response_body"
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
    checkEnvironmentVariables REQUIRED_ENV_VARS
    
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
    print_info "Email: $email"
    print_info "Name: $first_name $last_name"
    print_info "Authority: $competent_authority"
    
    # Check if bootstrap admin exists, create if needed
    check_or_create_bootstrap_admin
    
    # Create user via appropriate API
    create_user_via_api "$user_type" "$role" "$competent_authority" "$email" "$password" "$first_name" "$last_name" "$job_title" "$phone_country_code" "$phone_number"
    
    print_log_summary "${LOG_NAMESPACE}"
}

# Only run main function if script is executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    set -e
    create_user_main "$@"
fi
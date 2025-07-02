#!/bin/bash

#This script enables unmanaged user attributes for the UK ESOS realm

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration  
USER_PROFILE_URL="$BASE_URL/admin/realms/$UK_ESOS_REALM_NAME/users/profile"

#Get Keycloak Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Get current user profile configuration
CURRENT_PROFILE_CONFIG=$(curl -s -L -X GET "$USER_PROFILE_URL" \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

#Check if unmanaged attributes are already enabled
CURRENT_POLICY=$(echo "$CURRENT_PROFILE_CONFIG" | jq -r '.unmanagedAttributePolicy // "DISABLED"')

if [ "$CURRENT_POLICY" = "ENABLED" ]; then
	echo " $SCRIPT_NAME executed successfully"
else

	#Update user profile configuration to enable unmanaged attributes
	#Must include all existing configuration (attributes, groups) plus the new policy
	UPDATE_PROFILE_RESPONSE=$(curl -s -L -X PUT "$USER_PROFILE_URL" \
	-H 'Content-Type: application/json' \
	-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
	--data-raw "$(echo "$CURRENT_PROFILE_CONFIG" | jq '.unmanagedAttributePolicy = "ENABLED"')")
	
	# Check if the response contains an error or is the expected configuration
	if echo "$UPDATE_PROFILE_RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
		echo " $SCRIPT_NAME failed: $UPDATE_PROFILE_RESPONSE"
	else
		echo " $SCRIPT_NAME executed successfully"
	fi


fi

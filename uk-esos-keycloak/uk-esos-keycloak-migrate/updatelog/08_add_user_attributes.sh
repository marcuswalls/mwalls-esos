#!/bin/bash

#This script enables unmanaged user attributes for the UK ESOS realm

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/$UK_ESOS_REALM_NAME"

#Get Keycloak Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Get current realm configuration
CURRENT_REALM_CONFIG=$(curl -s -L -X GET "$UPDATE_REALM_URL" \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

#Check if unmanaged attributes are already enabled
CURRENT_POLICY=$(echo "$CURRENT_REALM_CONFIG" | jq -r '.attributes."_userAttributes.unmanaged" // "false"')

if [ "$CURRENT_POLICY" = "true" ]; then
	echo " Unmanaged attributes already enabled for realm $UK_ESOS_REALM_NAME"
else
	echo " Enabling unmanaged attributes for realm $UK_ESOS_REALM_NAME"
	
	#Update realm configuration to enable unmanaged attributes
	UPDATE_REALM_RESPONSE=$(curl -s -L -X PUT "$UPDATE_REALM_URL" \
	-H 'Content-Type: application/json' \
	-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
	--data-raw "$(echo "$CURRENT_REALM_CONFIG" | jq '.attributes."_userAttributes.unmanaged" = "true"')")
	
	if [ -z "$UPDATE_REALM_RESPONSE" ]; then
		echo " Unmanaged attributes enabled successfully for realm $UK_ESOS_REALM_NAME"
	else
		echo " Failed to enable unmanaged attributes: $UPDATE_REALM_RESPONSE"
		exit 1
	fi
fi

#Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")

if [ -z "$ADD_SCRIPT_TO_CHANGELOG" ]; then
	echo " Script $SCRIPT_NAME added to changelog"
else
	echo " Script $SCRIPT_NAME was not added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi
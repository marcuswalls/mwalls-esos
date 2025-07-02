#!/bin/bash

#This script updates conditional OTP execution of ESOSBrowser authentication flow.

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/"

#Get Keyclok Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Get ESOS Browser Conditional OTP execution id
GET_ESOS_BROWSER_EXECUTIONS=$(curl -s -L -X GET "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$ESOS_BROWSER"/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

CONDITIONAL_OTP_ID=$(echo "$GET_ESOS_BROWSER_EXECUTIONS" | jq -r '.[] | select(.displayName=="ESOSBrowser Browser - Conditional OTP").id')

CONDITIONAL_OTP_EXECUTION_OBJECT=$(echo "$GET_ESOS_BROWSER_EXECUTIONS" | jq --arg targetId "$CONDITIONAL_OTP_ID" '.[] | select(.id == $targetId) | .requirement = "REQUIRED"')

#Update Conditional OTP execution
CONDITIONAL_OTP_EXECUTION=$(curl -s -L -X PUT "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$ESOS_BROWSER"/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw "$CONDITIONAL_OTP_EXECUTION_OBJECT")

# Check if response is non-empty and contains an error
if [ -n "$CONDITIONAL_OTP_EXECUTION" ] && echo "$CONDITIONAL_OTP_EXECUTION" | jq -e '.error' >/dev/null 2>&1;
then
	#In case of error during realm creation, print the error and exit in order to avoid successfully loging the script execution
	echo " Realm $UK_ESOS_REALM_NAME update failed: $CONDITIONAL_OTP_EXECUTION"
	exit 1;
else
	echo " Realm $UK_ESOS_REALM_NAME updated successfully"
fi

#Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")

if [ -z "$ADD_SCRIPT_TO_CHANGELOG" ]
then
	echo " Script $SCRIPT_NAME added to changelog"
else
	echo " Script $SCRIPT_NAME was not to added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi

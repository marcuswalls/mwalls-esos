#!/bin/bash

#This script creates a new realm named uk-esos and adds basic configuration including :
#	a)A realm role named esos_user defined as default realm role
#	b)A user defined as realm admin
#	c)Two clients, uk-esos-app-api(confidential) and uk-esos-web-app(public)

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
CREATE_REALM_URL="$BASE_URL/admin/realms"

#Get Keyclok Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Create new realm
CREATE_REALM=$(curl -s -L -X POST "$CREATE_REALM_URL" \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw '{
	"id": "'$UK_ESOS_REALM_NAME'",
	"realm": "'$UK_ESOS_REALM_NAME'",
	"enabled": true,
	"registrationAllowed" : true,
	"registrationEmailAsUsername" : true,
	"roles": {
		"realm": [
		  {
			"name": "esos_user",
			"description": "ESOS User"
		  }
		]
	},
	"defaultRoles" : [ "offline_access", "esos_user", "uma_authorization" ],
	"loginTheme": "uk-esos-theme",
	"clients": [
		{
			"id": "4beee482-515a-4cd5-b835-14c781a7c8d7",
			"clientId": "uk-esos-web-app",
			"enabled": true,
			"publicClient" : true,
			"redirectUris": ["'$ESOS_WEB_APP_URL'/*"],
			"protocol": "openid-connect",
			"attributes": {},
			"baseUrl": "'$ESOS_WEB_APP_URL'",
			"adminUrl": "'$ESOS_WEB_APP_URL'",
			"webOrigins": ["'$ESOS_WEB_APP_URL'"],
			"directAccessGrantsEnabled": true
		},
		{
			"id": "a2d1abe6-f362-422a-a17a-e0a2d566a265",
			"clientId": "uk-esos-app-api",
			"enabled": true,
			"protocol": "openid-connect",
			"attributes": {},
			"secret" : "'$ESOS_APP_API_CLIENT_SECRET'",
			"redirectUris" : [ "'$ESOS_API_APP_URL'" ],
			"webOrigins": ["'$ESOS_API_APP_URL'", "'$ESOS_WEB_APP_URL'"],
			"serviceAccountsEnabled" : true,
			"authorizationServicesEnabled" : true,
			"publicClient" : false
		}
	]
}')

if [ -z "$CREATE_REALM" ]
then
	echo " Realm $UK_ESOS_REALM_NAME created successfully"
else
	#In case of error during realm creation, print the error and exit in order to avoid successfully loging the script execution
	echo " $CREATE_REALM"
	exit;
fi

#Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")

if [ -z "$ADD_SCRIPT_TO_CHANGELOG" ]
then
	echo " Script $SCRIPT_NAME added to changelog"
else
	echo " Script $SCRIPT_NAME was not to added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi

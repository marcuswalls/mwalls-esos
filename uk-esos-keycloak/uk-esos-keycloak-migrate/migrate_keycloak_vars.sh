#!/bin/bash

#Contains variables commonly used and/or needed to customize keycloak environment

#Keycloak server url
export BASE_URL=http://localhost:$KC_HTTP_PORT/auth

#Name of realm used to hold the changelog of executed scripts
export CHANGELOG_REALM_NAME=changelog

#Name of realm used to hold configuration for ESOS application
export UK_ESOS_REALM_NAME=uk-esos

#ESOS authentication flow
export ESOS_BROWSER=ESOSBrowser

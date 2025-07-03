#!/bin/bash
set -e

# Import custom CA certificate if it exists
if [ -f "/tmp/dockerhost-root-ca.crt" ]; then
    echo "Importing custom CA certificate..."
    # Need to switch to root temporarily to modify cacerts
    sudo $JAVA_HOME/bin/keytool -import -trustcacerts -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -alias dockerhost-ca -file /tmp/dockerhost-root-ca.crt -noprompt || true
    echo "Custom CA certificate imported successfully"
else
    echo "No custom CA certificate found at /tmp/dockerhost-root-ca.crt, skipping import"
fi

# Execute the main command
exec "$@"
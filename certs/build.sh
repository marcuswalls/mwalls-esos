#!/bin/bash

# Set Variables
DOMAIN="docker.internal"
ROOT_CA_KEY="dockerhost-root-ca.key"
ROOT_CA_CERT="dockerhost-root-ca.crt"
ROOT_CA_CSR="dockerhost-root-ca.csr"

WILDCARD_CERT_KEY="dockerhost-wildcard.key"
WILDCARD_CERT_CSR="dockerhost-wildcard.csr"
WILDCARD_CERT_CERT="dockerhost-wildcard.crt"
CONFIG_FILE="dockerhost-wildcard.cnf"

# Create OpenSSL Config for Wildcard Certificate
cat > $CONFIG_FILE <<EOF
[ req ]
distinguished_name = req_distinguished_name
req_extensions = v3_req
[ req_distinguished_name ]
[ v3_req ]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[ alt_names ]
DNS.1 = *.$DOMAIN
DNS.2 = host.$DOMAIN
DNS.3 = proxy.$DOMAIN
DNS.4 = frontend.$DOMAIN
DNS.5 = backend.$DOMAIN
DNS.6 = api.$DOMAIN
DNS.7 = auth.$DOMAIN
DNS.8 = keycloak.$DOMAIN
EOF

# 1. Generate Root CA Private Key
openssl genrsa -out $ROOT_CA_KEY 4096

# 2. Create and Self-Sign Root CA Certificate
openssl req -x509 -new -nodes -key $ROOT_CA_KEY -sha256 -days 3650 \
  -out $ROOT_CA_CERT -subj "/C=GB/ST=London/O=Docker Host CA/CN=Docker Host Root CA"

# 3. Generate Wildcard Certificate Private Key
openssl genrsa -out $WILDCARD_CERT_KEY 2048

# 4. Create Wildcard Certificate Signing Request (CSR)
openssl req -new -key $WILDCARD_CERT_KEY -out $WILDCARD_CERT_CSR -subj "/C=GB/ST=London/O=Docker Host CA/CN=*.$DOMAIN" -config $CONFIG_FILE

# 5. Sign Wildcard Certificate with Root CA
openssl x509 -req -in $WILDCARD_CERT_CSR -CA $ROOT_CA_CERT -CAkey $ROOT_CA_KEY -CAcreateserial \
  -out $WILDCARD_CERT_CERT -days 825 -sha256 -extensions v3_req -extfile $CONFIG_FILE

# 6. Create PKCS#12 Bundle for Wildcard Certificate
openssl pkcs12 -export -inkey dockerhost-wildcard.key -in dockerhost-wildcard.crt -certfile dockerhost-root-ca.crt -out dockerhost-wildcard.p12 -name dockerhost -passout pass:password

echo "✅ Root CA and Wildcard Certificate for '$DOMAIN' created successfully!"

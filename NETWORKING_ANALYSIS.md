# Networking Architecture Analysis

## Current Problem
- Mixed use of container names, localhost, and host.docker.internal
- Need to support both containerized and host-based API service
- Keycloak issuer URL consistency requirements
- Future nginx reverse proxy with SSL

## Proposed Custom Network Approach

### Pros:
1. **Proper Container Networking**: Services use DNS names within custom network
2. **Consistent Naming**: `*.docker.internal` pattern for all services
3. **Hybrid Support**: `extra_hosts` allows containers to reach host services
4. **Future-Proof**: Works with reverse proxy setup
5. **Production-Like**: Mirrors real deployment patterns
6. **SSL Preparation**: Ready for nginx with proper hostnames

### Cons:
1. **Complexity**: Requires network configuration management
2. **DNS Setup**: May need local DNS resolution for development
3. **Debugging**: More network layers to troubleshoot

## Recommended Architecture

```yaml
networks:
  esos_network:
    name: esos.docker.internal
    driver: bridge

services:
  app-api:
    hostname: api.esos.docker.internal
    networks:
      esos_network:
        aliases:
          - api.local
          - api.esos.docker.internal
    extra_hosts:
      - "host.docker.internal:host-gateway"
      
  keycloak:
    hostname: keycloak.esos.docker.internal
    networks:
      esos_network:
        aliases:
          - keycloak.local
          - keycloak.esos.docker.internal
    extra_hosts:
      - "host.docker.internal:host-gateway"
      
  app-web:
    hostname: web.esos.docker.internal
    networks:
      esos_network:
        aliases:
          - web.local
          - web.esos.docker.internal
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

## Environment Variables Strategy

```bash
# For container-to-container communication
API_KEYCLOAK_SERVERURL=http://keycloak.esos.docker.internal:8091/auth

# For host-based API development
API_KEYCLOAK_SERVERURL=http://host.docker.internal:8091/auth

# For nginx reverse proxy (future)
API_KEYCLOAK_SERVERURL=https://esos.docker.internal/auth
```

## Key Benefits:
1. **Keycloak Issuer Consistency**: Same URL works in all contexts
2. **Development Flexibility**: API can run on host or in container
3. **Production Readiness**: Easy transition to real hostnames
4. **SSL Support**: nginx can terminate SSL with proper certificates
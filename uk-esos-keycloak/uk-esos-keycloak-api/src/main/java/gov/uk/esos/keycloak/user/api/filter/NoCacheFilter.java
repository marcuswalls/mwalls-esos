package gov.uk.esos.keycloak.user.api.filter;

import gov.uk.esos.keycloak.user.api.annotation.NoCache;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * JAX-RS response filter that implements no-cache behavior for endpoints
 * annotated with @NoCache. This filter adds appropriate HTTP headers to
 * prevent caching of the response.
 */
@Provider
@NoCache
public class NoCacheFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
            ContainerResponseContext responseContext) throws IOException {

        // Add standard HTTP headers to prevent caching
        responseContext.getHeaders().add("Cache-Control", "no-cache, no-store, must-revalidate");
        responseContext.getHeaders().add("Pragma", "no-cache");
        responseContext.getHeaders().add("Expires", "0");
    }
}
package gov.uk.esos.keycloak.user.api.filter;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.core.MultivaluedMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;

import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NoCacheFilterTest {

    @Mock
    private ContainerRequestContext requestContext;

    @Mock
    private ContainerResponseContext responseContext;

    @Mock
    private MultivaluedMap<String, Object> headers;

    private NoCacheFilter filter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(responseContext.getHeaders()).thenReturn(headers);
        filter = new NoCacheFilter();
    }

    @Test
    void shouldAddNoCacheHeaders() throws IOException {
        filter.filter(requestContext, responseContext);

        verify(responseContext, atLeast(1)).getHeaders();

        // Verify each specific header is added
        verify(headers).add("Cache-Control", "no-cache, no-store, must-revalidate");
        verify(headers).add("Pragma", "no-cache");
        verify(headers).add("Expires", "0");
    }
}
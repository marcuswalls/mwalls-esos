package gov.uk.esos.keycloak.user.api.annotation;

import jakarta.ws.rs.NameBinding;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to indicate that a REST endpoint should not be cached.
 * This replaces the deprecated org.jboss.resteasy.annotations.cache.NoCache
 * annotation
 * for compatibility with standard JAX-RS implementations.
 */
@NameBinding
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface NoCache {
}
package uk.gov.esos.api.web.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.Scopes;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.Year;

/**
 * Configuration for REST API documentation.
 */
@Configuration
@OpenAPIDefinition(info = @Info(title = "ESOS API Documentation", description = "ESOS API Documentation"), security = {
        @SecurityRequirement(name = "bearerAuth"),
        @SecurityRequirement(name = "esos-oauth2")
})
@SecurityScheme(name = "esos-oauth2", type = SecuritySchemeType.OAUTH2, flows = @OAuthFlows(authorizationCode = @OAuthFlow(authorizationUrl = "${spring.security.oauth2.resourceserver.jwt.issuer-uri}/protocol/openid-connect/auth", tokenUrl = "${spring.security.oauth2.resourceserver.jwt.issuer-uri}/protocol/openid-connect/token", scopes = {
        @OAuthScope(name = "openid", description = "OpenID Connect scope"),
        @OAuthScope(name = "profile", description = "Access to user profile information"),
        @OAuthScope(name = "email", description = "Access to user email address")
})))
public class SwaggerConfig {
    private final BuildProperties buildProperties;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String keycloakIssuerUri;

    public SwaggerConfig(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String bearerSchemeName = "bearerAuth";
        final String oauthSchemeName = "esos-oauth2";

        SpringDocUtils.getConfig().replaceWithSchema(
                BigDecimal.class,
                new Schema<BigDecimal>().type("string").format("decimal"));

        SpringDocUtils.getConfig().replaceWithSchema(
                Year.class,
                new Schema<Year>().type("integer").format("int16"));

        return new OpenAPI()
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("ESOS API Documentation")
                        .version(String.format("%s %s", buildProperties.getName(), buildProperties.getVersion()))
                        .description("ESOS API Documentation"))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement()
                        .addList(bearerSchemeName))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement()
                        .addList(oauthSchemeName))
                .components(new Components()
                        .addSecuritySchemes(bearerSchemeName, new io.swagger.v3.oas.models.security.SecurityScheme()
                                .name(bearerSchemeName)
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                .scheme("bearer"))
                        .addSecuritySchemes(oauthSchemeName, new io.swagger.v3.oas.models.security.SecurityScheme()
                                .name(oauthSchemeName)
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.OAUTH2)
                                .flows(new io.swagger.v3.oas.models.security.OAuthFlows()
                                        .authorizationCode(new io.swagger.v3.oas.models.security.OAuthFlow()
                                                .authorizationUrl(keycloakIssuerUri + "/protocol/openid-connect/auth")
                                                .tokenUrl(keycloakIssuerUri + "/protocol/openid-connect/token")
                                                .refreshUrl(keycloakIssuerUri + "/protocol/openid-connect/refresh")
                                                .scopes(
                                                        new Scopes()
                                                                .addString("openId", "OpenId Connect Scope")
                                                                .addString("email", "Access to user email address")
                                                                .addString("offline_access", "Support refresh tokens")
                                                                .addString("profile",
                                                                        "Access to user profile information"))))));
    }
}
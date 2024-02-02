package uk.gov.esos.api.workflow.payment.config.property;

import java.util.HashMap;
import java.util.Map;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@Data
@ConfigurationProperties(prefix = "govuk-pay")
@ConditionalOnProperty(prefix = "govuk-pay", name = "isActive", havingValue = "true")
public class GovukPayProperties {

    @NotBlank
    private String serviceUrl;

    @NotEmpty
    private Map<String, @NotBlank String> apiKeys = new HashMap<>();
}

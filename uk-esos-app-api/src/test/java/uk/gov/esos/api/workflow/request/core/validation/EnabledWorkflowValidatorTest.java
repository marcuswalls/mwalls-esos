package uk.gov.esos.api.workflow.request.core.validation;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.workflow.request.core.config.FeatureFlagProperties;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EnabledWorkflowValidatorTest {

    @Test
    void isWorkflowAllowed() {
        FeatureFlagProperties featureFlagProperties = new FeatureFlagProperties();
        featureFlagProperties.setDisabledWorkflows(Set.of(RequestType.ORGANISATION_ACCOUNT_OPENING));

        EnabledWorkflowValidator enabledWorkflowValidator = new EnabledWorkflowValidator(featureFlagProperties);

        boolean isAllowed = enabledWorkflowValidator.isWorkflowEnabled(RequestType.NOTIFICATION_OF_COMPLIANCE_P3);

        assertTrue(isAllowed);

        isAllowed = enabledWorkflowValidator.isWorkflowEnabled(RequestType.ORGANISATION_ACCOUNT_OPENING);

        assertFalse(isAllowed);
    }

    @Test
    void isWorkflowAllowed_when_all_workflows_enabled() {
        FeatureFlagProperties featureFlagProperties = new FeatureFlagProperties();

        EnabledWorkflowValidator enabledWorkflowValidator = new EnabledWorkflowValidator(featureFlagProperties);

        boolean isAllowed = enabledWorkflowValidator.isWorkflowEnabled(RequestType.ORGANISATION_ACCOUNT_OPENING);

        assertTrue(isAllowed);

        isAllowed = enabledWorkflowValidator.isWorkflowEnabled(RequestType.ORGANISATION_ACCOUNT_OPENING);

        assertTrue(isAllowed);
    }

}

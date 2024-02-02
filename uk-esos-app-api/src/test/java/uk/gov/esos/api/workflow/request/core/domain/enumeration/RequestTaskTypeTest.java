package uk.gov.esos.api.workflow.request.core.domain.enumeration;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RequestTaskTypeTest {

    @Test
    void getSupportingRequestTaskTypes() {
        Set<RequestTaskType> expectedRequestTaskTypes = Set.of(
            RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT
        );

        assertEquals(expectedRequestTaskTypes, RequestTaskType.getSupportingRequestTaskTypes());
    }
}
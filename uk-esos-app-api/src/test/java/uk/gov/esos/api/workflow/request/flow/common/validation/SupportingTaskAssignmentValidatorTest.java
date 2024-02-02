package uk.gov.esos.api.workflow.request.flow.common.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentValidationService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

@ExtendWith(MockitoExtension.class)
class SupportingTaskAssignmentValidatorTest {

    @InjectMocks
    private SupportingTaskAssignmentValidator supportingTaskAssignmentValidator;

    @Mock
    private RequestTaskAssignmentValidationService requestTaskAssignmentValidationService;

    @Test
    void validate() {
        AppUser pmrvUser = AppUser.builder().userId("userId").build();
        String peerReviewer = "peerReviewer";
        RequestTask requestTask = RequestTask.builder().build();
        RequestTaskType requestTaskType = RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT;

        when(requestTaskAssignmentValidationService.
            hasUserPermissionsToBeAssignedToTaskType(requestTask, requestTaskType, peerReviewer, pmrvUser))
            .thenReturn(true);

        supportingTaskAssignmentValidator.validate(requestTask, requestTaskType, peerReviewer, pmrvUser);
    }

    @Test
    void validate_assignment_not_allowed() {
        AppUser pmrvUser = AppUser.builder().userId("userId").build();
        String peerReviewer = "peerReviewer";
        RequestTask requestTask = RequestTask.builder().build();
        RequestTaskType requestTaskType = RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT;

        when(requestTaskAssignmentValidationService.
            hasUserPermissionsToBeAssignedToTaskType(requestTask, requestTaskType, peerReviewer, pmrvUser))
            .thenReturn(false);

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> supportingTaskAssignmentValidator.validate(requestTask, requestTaskType, peerReviewer, pmrvUser));

        assertEquals(ErrorCode.ASSIGNMENT_NOT_ALLOWED, businessException.getErrorCode());
    }
}
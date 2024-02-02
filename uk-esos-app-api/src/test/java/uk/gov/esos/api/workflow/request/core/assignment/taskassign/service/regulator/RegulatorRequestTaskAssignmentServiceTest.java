package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.regulator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessCheckedException;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.SiteContactRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

@ExtendWith(MockitoExtension.class)
class RegulatorRequestTaskAssignmentServiceTest {

    @InjectMocks
    private RegulatorRequestTaskAssignmentService regulatorRequestTaskAssignmentService;

    @Mock
    private SiteContactRequestTaskAssignmentService siteContactRequestTaskAssignmentService;

    @Mock
    private RequestTaskAssignmentService requestTaskAssignmentService;

    @Test
    void assignTasksOfDeletedRegulatorToCaSiteContactOrRelease() {
        String userId = "userId";
        regulatorRequestTaskAssignmentService.assignTasksOfDeletedRegulatorToCaSiteContactOrRelease(userId);
        verify(siteContactRequestTaskAssignmentService, times(1))
            .assignTasksOfDeletedUserToSiteContactOrRelease(userId, AccountContactType.CA_SITE);
    }

    @Test
    void assignTask_peer_review_task() throws BusinessCheckedException {
        String userId = "userId";
        String requestRegulatorReviewer = "requestRegulatorReviewer";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .regulatorReviewer(requestRegulatorReviewer)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .build();

        regulatorRequestTaskAssignmentService.assignTask(requestTask, userId);

        verify(requestTaskAssignmentService, times(1)).assignToUser(requestTask, userId);
        verifyNoMoreInteractions(requestTaskAssignmentService);
    }

    @Test
    void assignTask_non_peer_review_task() throws BusinessCheckedException {
        String userId = "userId";
        Request request = Request.builder().build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .build();

        regulatorRequestTaskAssignmentService.assignTask(requestTask, userId);

        verify(requestTaskAssignmentService, times(1)).assignToUser(requestTask, userId);
    }

    @Test
    void assignTask_non_peer_review_task_exception_on_assignment() throws BusinessCheckedException {
        String userId = "userId";
        Request request = Request.builder().build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .build();

        doThrow(BusinessCheckedException.class).when(requestTaskAssignmentService).assignToUser(requestTask, userId);

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> regulatorRequestTaskAssignmentService.assignTask(requestTask, userId));

        assertEquals(ErrorCode.ASSIGNMENT_NOT_ALLOWED, businessException.getErrorCode());

        verify(requestTaskAssignmentService, times(1)).assignToUser(requestTask, userId);
        verifyNoMoreInteractions(requestTaskAssignmentService);
    }

    @Test
    void getRoleType() {
        assertEquals(RoleType.REGULATOR, regulatorRequestTaskAssignmentService.getRoleType());
    }
}
package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.authorization.rules.services.resource.RequestTaskAuthorizationResourceService;
import uk.gov.esos.api.authorization.rules.services.resource.ResourceCriteria;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.common.domain.enumeration.RoleType.OPERATOR;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;

@ExtendWith(MockitoExtension.class)
class RequestTaskAssignmentValidationServiceTest {

    @InjectMocks
    private RequestTaskAssignmentValidationService requestTaskAssignmentValidationService;

    @Mock
    private UserRoleTypeService userRoleTypeService;

    @Mock
    private RequestTaskAuthorizationResourceService requestTaskAuthorizationResourceService;

    @Test
    void validateTaskReleaseCapability() {
        RequestTask requestTask = buildMockRequestTask(new Request(), ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

        // Invoke
        requestTaskAssignmentValidationService.validateTaskReleaseCapability(requestTask, RoleType.REGULATOR);
    }

    @Test
    void validateTaskReleaseCapability_task_operator() {
        RequestTask requestTask = buildMockRequestTask(new Request(), ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class, () ->
            requestTaskAssignmentValidationService.validateTaskReleaseCapability(requestTask, RoleType.OPERATOR));

        // Assert
        assertEquals(ErrorCode.ASSIGNMENT_NOT_ALLOWED, businessException.getErrorCode());
    }

    @Test
    void validateTaskAssignmentCapability() {
        RequestTask requestTask = buildMockRequestTask(new Request(), ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

        // Invoke
        requestTaskAssignmentValidationService.validateTaskAssignmentCapability(requestTask);
    }

    @Test
    void hasUserPermissionsToBeAssignedToTask() {
        final String userId = "userId";
        Request request = Request.builder().accountId(1L).competentAuthority(CompetentAuthorityEnum.ENGLAND).build();
        RequestTask requestTask = buildMockRequestTask(request, ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
        UserRoleTypeDTO userRoleTypeDTO = UserRoleTypeDTO.builder().roleType(OPERATOR).build();
        List<String> candidateAssignees = List.of("userId", "userId2");
        
        ResourceCriteria resourceCriteria = 
                ResourceCriteria.builder()
                    .accountId(requestTask.getRequest().getAccountId())
                    .competentAuthority(requestTask.getRequest().getCompetentAuthority()).build();

        // Mock
        when(userRoleTypeService.getUserRoleTypeByUserId(userId)).thenReturn(userRoleTypeDTO);
        when(requestTaskAuthorizationResourceService.findUsersWhoCanExecuteRequestTaskTypeByAccountCriteriaAndRoleType(
                    requestTask.getType().name(), resourceCriteria, OPERATOR))
                .thenReturn(candidateAssignees);

        // Invoke
        boolean result = requestTaskAssignmentValidationService.hasUserPermissionsToBeAssignedToTask(requestTask, userId);

        // Assert
        assertTrue(result);
        verify(requestTaskAuthorizationResourceService, times(1))
                .findUsersWhoCanExecuteRequestTaskTypeByAccountCriteriaAndRoleType(
                        requestTask.getType().name(), resourceCriteria, OPERATOR);
    }

    @Test
    void hasUserPermissionsToBeAssignedToTask_user_not_in_candidates() {
        final String userId = "userId";
        Request request = Request.builder().accountId(1L).competentAuthority(CompetentAuthorityEnum.ENGLAND).build();
        RequestTask requestTask = buildMockRequestTask(request, ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
        UserRoleTypeDTO userRoleTypeDTO = UserRoleTypeDTO.builder().roleType(OPERATOR).build();
        List<String> candidateAssignees = List.of("userId1", "userId2");
        
        ResourceCriteria resourceCriteria = 
                ResourceCriteria.builder()
                    .accountId(requestTask.getRequest().getAccountId())
                    .competentAuthority(requestTask.getRequest().getCompetentAuthority()).build();

        // Mock
        when(userRoleTypeService.getUserRoleTypeByUserId(userId)).thenReturn(userRoleTypeDTO);
        when(requestTaskAuthorizationResourceService.findUsersWhoCanExecuteRequestTaskTypeByAccountCriteriaAndRoleType(
                requestTask.getType().name(), resourceCriteria, OPERATOR))
                .thenReturn(candidateAssignees);

        // Invoke
        boolean result = requestTaskAssignmentValidationService.hasUserPermissionsToBeAssignedToTask(requestTask, userId);

        // Assert
        assertFalse(result);
        verify(requestTaskAuthorizationResourceService, times(1))
                .findUsersWhoCanExecuteRequestTaskTypeByAccountCriteriaAndRoleType(
                        requestTask.getType().name(), resourceCriteria, OPERATOR);
    }

    private RequestTask buildMockRequestTask(Request request, RequestTaskType type) {
        return RequestTask.builder()
                .id(1L)
                .request(request)
                .type(type)
                .build();
    }
}

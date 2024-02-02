package uk.gov.esos.api.workflow.request.flow.common.actionhandler;

import org.aspectj.lang.JoinPoint;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.core.validation.RequestTaskActionValidatorService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProcessRequestTaskAspectTest {

    @InjectMocks
    private ProcessRequestTaskAspect processRequestTaskAspect;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private JoinPoint joinPoint;

    @Mock
    private RequestTaskActionValidatorService requestTaskActionValidatorService;

    @Test
    void validateProcessRequestTask() {
        final AppUser user = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[]{1L,
                RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION, user, new OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload()};
        final RequestTask requestTask = RequestTask.builder()
                .assignee("userId").type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW).build();

        // Mock
        when(joinPoint.getArgs()).thenReturn(arguments);
        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);
        doNothing().when(requestTaskActionValidatorService).validate(requestTask, 
            RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION);

        // Invoke
        processRequestTaskAspect.validateProcessRequestTask(joinPoint);

        // Assert
        verify(requestTaskService, times(1)).findTaskById(1L);
        verify(requestTaskActionValidatorService, times(1)).validate(requestTask,
            RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION);
    }

    @Test
    void validateProcessRequestTask_not_valid_assignee() {
        final AppUser user = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[]{1L,
            RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION, user, new OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload()};
        final RequestTask requestTask = RequestTask.builder()
                .assignee("userId2").type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW).build();

        // Mock
        when(joinPoint.getArgs()).thenReturn(arguments);
        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> processRequestTaskAspect.validateProcessRequestTask(joinPoint));

        // Assert
        assertEquals(ErrorCode.REQUEST_TASK_ACTION_USER_NOT_THE_ASSIGNEE, businessException.getErrorCode());
        verify(requestTaskService, times(1)).findTaskById(1L);
    }

    @Test
    void validateProcessRequestTask_not_valid_action() {
        final AppUser user = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[]{1L,
            RequestTaskActionType.PAYMENT_CANCEL, user, new OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload()};
        final RequestTask requestTask = RequestTask.builder()
                .assignee("userId").type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW).build();

        // Mock
        when(joinPoint.getArgs()).thenReturn(arguments);
        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> processRequestTaskAspect.validateProcessRequestTask(joinPoint));

        // Assert
        assertEquals(ErrorCode.REQUEST_TASK_ACTION_CANNOT_PROCEED, businessException.getErrorCode());
        verify(requestTaskService, times(1)).findTaskById(1L);
    }

    @Test
    void validateProcessRequestTask_no_task_exists() {
        final AppUser user = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[]{1L,
            RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION, user, new OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload()};

        // Mock
        when(joinPoint.getArgs()).thenReturn(arguments);
        when(requestTaskService.findTaskById(1L)).thenThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> processRequestTaskAspect.validateProcessRequestTask(joinPoint));

        // Assert
        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, businessException.getErrorCode());
        verify(requestTaskService, times(1)).findTaskById(1L);
    }

    @Test
    void validateProcessRequestTask_whenCustomValidationFails_thenThrowException() {
        
        final AppUser user = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[]{1L,
            RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION, user, 
            new OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload()};
        final RequestTask requestTask = RequestTask.builder()
            .assignee("userId").type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW).build();

        // Mock
        when(joinPoint.getArgs()).thenReturn(arguments);
        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);
        doThrow(new BusinessException(ErrorCode.REQUEST_TASK_ACTION_CANNOT_PROCEED))
            .when(requestTaskActionValidatorService)
            .validate(requestTask, RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION);
        
        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
            () -> processRequestTaskAspect.validateProcessRequestTask(joinPoint));

        // Assert
        assertEquals(ErrorCode.REQUEST_TASK_ACTION_CANNOT_PROCEED, businessException.getErrorCode());
    }
}

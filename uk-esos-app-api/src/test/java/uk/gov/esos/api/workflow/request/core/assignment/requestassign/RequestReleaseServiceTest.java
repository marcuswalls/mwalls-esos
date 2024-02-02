package uk.gov.esos.api.workflow.request.core.assignment.requestassign;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.services.AuthorizationRulesQueryService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

@ExtendWith(MockitoExtension.class)
class RequestReleaseServiceTest {

    @InjectMocks
    private RequestReleaseService service;
    
    @Mock
    private AuthorizationRulesQueryService authorizationRulesQueryService;

    @Test
    void releaseRequest_operator_task() {
        final String operatorAssignee = "operatorAssignee";
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .assignee(operatorAssignee)
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.OPERATOR));

        service.releaseRequest(requestTask);
        assertEquals(regulatorAssignee, request.getPayload().getRegulatorAssignee());

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_operator_task_without_assignee() {
        final String operatorAssignee = "operatorAssignee";
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.OPERATOR));

        service.releaseRequest(requestTask);

        assertNull(request.getPayload().getOperatorAssignee());
        assertEquals(regulatorAssignee, request.getPayload().getRegulatorAssignee());

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_operator_request_operator_assignee_other_than_task_assignee() {
        final String operatorAssignee = "operatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().operatorAssignee(operatorAssignee).build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .assignee("assignee")
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.OPERATOR));

        service.releaseRequest(requestTask);

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_operator_request_without_operator_assignee() {
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().regulatorAssignee(regulatorAssignee).build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .assignee("assignee")
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.OPERATOR));

        service.releaseRequest(requestTask);

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_regulator_task() {
        final String operatorAssignee = "operatorAssignee";
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .assignee(regulatorAssignee)
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.REGULATOR));

        service.releaseRequest(requestTask);

        assertNull(request.getPayload().getRegulatorAssignee());
        assertEquals(operatorAssignee, request.getPayload().getOperatorAssignee());

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_regulator_task_without_assignee() {
        final String operatorAssignee = "operatorAssignee";
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.REGULATOR));

        service.releaseRequest(requestTask);
        assertEquals(operatorAssignee, request.getPayload().getOperatorAssignee());
        assertNull(request.getPayload().getRegulatorAssignee());

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_regulator_request_regulator_assignee_other_than_task_assignee() {
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().regulatorAssignee(regulatorAssignee).build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .assignee("assignee")
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.REGULATOR));

        service.releaseRequest(requestTask);

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_regulator_request_without_regulator_assignee() {
        final String operatorAssignee = "operatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().operatorAssignee(operatorAssignee).build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .assignee("assignee")
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.REGULATOR));

        service.releaseRequest(requestTask);

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_null_role_type() {
        final String operatorAssignee = "operatorAssignee";
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .assignee(operatorAssignee)
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.empty());

        service.releaseRequest(requestTask);

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_verifier_task() {
        final String operatorAssignee = "operatorAssignee";
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build())
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .assignee(regulatorAssignee)
            .build();

        when(authorizationRulesQueryService.findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name()))
            .thenReturn(Optional.of(RoleType.VERIFIER));

        service.releaseRequest(requestTask);

        verify(authorizationRulesQueryService, times(1))
            .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, requestTask.getType().name());
    }

    @Test
    void releaseRequest_peer_review_task() {
        Request request = Request.builder().build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .build();

        service.releaseRequest(requestTask);
    }
}

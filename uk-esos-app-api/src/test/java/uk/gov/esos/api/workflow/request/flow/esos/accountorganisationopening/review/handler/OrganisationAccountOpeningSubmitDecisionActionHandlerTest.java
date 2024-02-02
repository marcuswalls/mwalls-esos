package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.Decision;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningSubmitDecisionActionHandlerTest {

    @InjectMocks
    private OrganisationAccountOpeningSubmitDecisionActionHandler submitDecisionActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String processTaskId = "process_id";
        RequestTaskActionType requestTaskActionType = RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION;
        AppUser appUser = AppUser.builder().build();

        OrganisationAccountPayload requestPayloadAccount = OrganisationAccountPayload.builder()
            .name("name")
            .competentAuthority(CompetentAuthorityEnum.WALES)
            .build();
        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .payloadType(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD)
            .account(requestPayloadAccount)
            .build();
        Request request = Request.builder().payload(requestPayload).build();

        OrganisationAccountPayload requestTaskPayloadAccount = OrganisationAccountPayload.builder()
            .name("different name")
            .registrationNumber("145")
            .competentAuthority(CompetentAuthorityEnum.WALES)
            .build();
        OrganisationAccountOpeningApplicationRequestTaskPayload requestTaskPayload =
            OrganisationAccountOpeningApplicationRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD)
                .account(requestTaskPayloadAccount)
                .build();

        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .payload(requestTaskPayload)
            .processTaskId(processTaskId)
            .build();

        AccountOpeningDecisionPayload decision = AccountOpeningDecisionPayload.builder().decision(Decision.REJECTED).reason("reason").build();
        OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload requestTaskActionPayload =
            OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload.builder()
                .decision(decision)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        submitDecisionActionHandler.process(requestTaskId, requestTaskActionType, appUser, requestTaskActionPayload);

        //verify
        assertEquals(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD, requestPayload.getPayloadType());
        assertEquals(decision, requestPayload.getDecision());
        assertEquals(requestTaskPayloadAccount, requestPayload.getAccount());
        assertNull(requestPayload.getParticipantDetails());

        verify(workflowService, times(1)).completeTask(
            processTaskId,
            Map.of(BpmnProcessConstants.APPLICATION_APPROVED, false)
        );
    }

    @Test
    void getTypes() {
        assertThat(submitDecisionActionHandler.getTypes())
            .containsOnly(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION);
    }
}
package uk.gov.esos.api.workflow.request.flow.common.actionhandler;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.workflow.request.core.domain.RequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.validation.EnabledWorkflowValidator;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.handler.OrganisationAccountOpeningSubmitApplicationCreateActionHandler;

@ExtendWith(MockitoExtension.class)
class RequestCreateActionHandlerMapperTest {

    @Mock
    private EnabledWorkflowValidator enabledWorkflowValidator;

    @Mock
    private OrganisationAccountOpeningSubmitApplicationCreateActionHandler accountOpeningActionHandler;


    @Test
    void get_not_return_disabled_workflows() {
        List<RequestCreateActionHandler<? extends RequestCreateActionPayload>> handlers = List.of(accountOpeningActionHandler);

        when(enabledWorkflowValidator.isWorkflowEnabled(RequestType.ORGANISATION_ACCOUNT_OPENING)).thenReturn(false);
        when(accountOpeningActionHandler.getType()).thenReturn(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION);
        RequestCreateActionHandlerMapper requestCreateActionHandlerMapper = new RequestCreateActionHandlerMapper(handlers, enabledWorkflowValidator);
        assertThrows(BusinessException.class, () -> requestCreateActionHandlerMapper.get(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION));
        
        when(enabledWorkflowValidator.isWorkflowEnabled(RequestType.ORGANISATION_ACCOUNT_OPENING)).thenReturn(true);
        RequestCreateActionHandlerMapper requestCreateActionHandlerMapper2 = new RequestCreateActionHandlerMapper(handlers, enabledWorkflowValidator);
        var handler = requestCreateActionHandlerMapper2.get(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION);

        assertThat(handler).isEqualTo(accountOpeningActionHandler);
    }
}

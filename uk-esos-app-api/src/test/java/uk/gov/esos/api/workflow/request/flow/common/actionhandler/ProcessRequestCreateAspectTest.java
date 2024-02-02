package uk.gov.esos.api.workflow.request.flow.common.actionhandler;

import org.aspectj.lang.JoinPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.competentauthority.CompetentAuthorityService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByAccountValidator;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByCAValidator;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningSubmitApplicationCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service.OrganisationAccountOpeningCreateValidator;

import java.util.ArrayList;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProcessRequestCreateAspectTest {

    private ProcessRequestCreateAspect aspect;

    @Mock
    private OrganisationAccountOpeningCreateValidator organisationAccountOpeningCreateValidator;

    @Mock
    private AccountQueryService accountQueryService;
    
    @Mock
    private CompetentAuthorityService competentAuthorityService;

    @Spy
    private ArrayList<RequestCreateByAccountValidator> requestCreateByAccountValidators;
    
    @Spy
    private ArrayList<RequestCreateByCAValidator> requestCreateByCAValidators;
    
    @Mock
    private JoinPoint joinPoint;

    @BeforeEach
    void setUp() {
    	requestCreateByAccountValidators.add(organisationAccountOpeningCreateValidator);
    	
		aspect = new ProcessRequestCreateAspect(requestCreateByAccountValidators, requestCreateByCAValidators,
            accountQueryService, competentAuthorityService);
    }

    @Test
    void process_account_opening_request_type() {
        final RequestCreateActionType type = RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION;
        final OrganisationAccountOpeningSubmitApplicationCreateActionPayload payload = OrganisationAccountOpeningSubmitApplicationCreateActionPayload.builder().build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] {
                null, type, payload, currentUser
        };

        RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(organisationAccountOpeningCreateValidator.getType()).thenReturn(type);
        when(organisationAccountOpeningCreateValidator.validateAction(null)).thenReturn(validationResult);

        aspect.process(joinPoint);

        verify(joinPoint, times(1)).getArgs();
        verify(organisationAccountOpeningCreateValidator, times(1)).getType();
        verify(organisationAccountOpeningCreateValidator, times(1)).validateAction(null);
        verifyNoInteractions(accountQueryService);
        verifyNoInteractions(competentAuthorityService);
    }
}

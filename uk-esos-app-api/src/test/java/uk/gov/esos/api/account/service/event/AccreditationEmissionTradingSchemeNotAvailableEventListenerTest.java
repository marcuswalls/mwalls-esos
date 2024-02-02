package uk.gov.esos.api.account.service.event;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.service.AccountVerificationBodyUnappointService;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;
import uk.gov.esos.api.verificationbody.event.AccreditationEmissionTradingSchemeNotAvailableEvent;

@ExtendWith(MockitoExtension.class)
class AccreditationEmissionTradingSchemeNotAvailableEventListenerTest {
    
    @InjectMocks
    private AccreditationEmissionTradingSchemeNotAvailableEventListener listener;

    @Mock
    private AccountVerificationBodyUnappointService accountVerificationBodyUnappointService;

    @Test
    void onAccreditationEmissionTradingSchemeNotAvailableEvent() {
        Long verificationBodyId = 1L;
        Set<EmissionTradingScheme> notAvailableAccreditationEmissionTradingSchemes = Set.of(EmissionTradingScheme.UK_ETS_INSTALLATIONS);
        AccreditationEmissionTradingSchemeNotAvailableEvent event = 
                new AccreditationEmissionTradingSchemeNotAvailableEvent(verificationBodyId, notAvailableAccreditationEmissionTradingSchemes);

        listener.onAccreditationEmissionTradingSchemeNotAvailableEvent(event);

        verify(accountVerificationBodyUnappointService,times(1))
            .unappointAccountsAppointedToVerificationBodyForEmissionTradingSchemes(verificationBodyId, notAvailableAccreditationEmissionTradingSchemes);
    }

}

package uk.gov.esos.api.account.service.event;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import uk.gov.esos.api.account.service.AccountVerificationBodyUnappointService;
import uk.gov.esos.api.verificationbody.domain.event.VerificationBodyDeletedEvent;

import java.util.Set;

@RequiredArgsConstructor
@Component(value =  "accountVerificationBodyDeletedEventListener")
public class VerificationBodyDeletedEventListener {

    private final AccountVerificationBodyUnappointService accountVerificationBodyUnappointService;

    @Order(1)
    @EventListener(VerificationBodyDeletedEvent.class)
    public void onVerificationBodyDeletedEvent(VerificationBodyDeletedEvent event) {
        // Unappoint accounts from vb
        accountVerificationBodyUnappointService.unappointAccountsAppointedToVerificationBody(Set.of(event.getVerificationBodyId()));
    }
}

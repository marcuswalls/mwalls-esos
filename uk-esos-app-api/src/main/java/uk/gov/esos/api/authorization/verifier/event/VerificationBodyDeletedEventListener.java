package uk.gov.esos.api.authorization.verifier.event;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import uk.gov.esos.api.authorization.verifier.service.VerifierAuthorityDeletionService;
import uk.gov.esos.api.verificationbody.domain.event.VerificationBodyDeletedEvent;

@RequiredArgsConstructor
@Component(value =  "authorityVerificationBodyDeletedEventListener")
public class VerificationBodyDeletedEventListener {

    private final VerifierAuthorityDeletionService verifierAuthorityDeletionService;

    @Order(2)
    @EventListener(VerificationBodyDeletedEvent.class)
    public void onVerificationBodyDeletedEvent(VerificationBodyDeletedEvent event) {
        // Delete verifier users
        verifierAuthorityDeletionService.deleteVerifierAuthorities(event.getVerificationBodyId());
    }
}

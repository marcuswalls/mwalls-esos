package uk.gov.esos.api.web.orchestrator.verificationbody.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.verifier.service.VerifierUserInvitationService;
import uk.gov.esos.api.web.orchestrator.verificationbody.dto.VerificationBodyCreationDTO;
import uk.gov.esos.api.verificationbody.domain.dto.VerificationBodyInfoDTO;
import uk.gov.esos.api.verificationbody.service.VerificationBodyCreationService;

@Service
@RequiredArgsConstructor
public class VerificationBodyAndUserOrchestrator {

    private final VerificationBodyCreationService verificationBodyCreationService;
    private final VerifierUserInvitationService verifierUserInvitationService;

    @Transactional
    public VerificationBodyInfoDTO createVerificationBody(AppUser pmrvUser, VerificationBodyCreationDTO verificationBodyCreationDTO) {

        VerificationBodyInfoDTO verificationBodyInfoDTO =
            verificationBodyCreationService.createVerificationBody(verificationBodyCreationDTO.getVerificationBody());

        verifierUserInvitationService.inviteVerifierAdminUser(pmrvUser,
            verificationBodyCreationDTO.getAdminVerifierUserInvitation(),
            verificationBodyInfoDTO.getId());

        return verificationBodyInfoDTO;
    }
}

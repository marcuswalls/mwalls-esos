package uk.gov.esos.api.user.regulator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.service.UserInvitationTokenVerificationService;

@Service
@RequiredArgsConstructor
public class RegulatorUserTokenVerificationService {

    private final UserInvitationTokenVerificationService userInvitationTokenVerificationService;

    public AuthorityInfoDTO verifyInvitationTokenForPendingAuthority(String invitationToken) {
        return userInvitationTokenVerificationService
            .verifyInvitationTokenForPendingAuthority(invitationToken, JwtTokenActionEnum.REGULATOR_INVITATION);
    }
}

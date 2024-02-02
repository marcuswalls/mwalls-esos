package uk.gov.esos.api.user.core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.token.JwtTokenActionEnum;

@Service
@RequiredArgsConstructor
public class UserInvitationTokenVerificationService {

    private final JwtTokenService jwtTokenService;
    private final AuthorityService authorityService;

    public AuthorityInfoDTO verifyInvitationTokenForPendingAuthority(String invitationToken, JwtTokenActionEnum tokenAction) {
        String authorityUuid = jwtTokenService.resolveTokenActionClaim(invitationToken, tokenAction);
        return authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
    }

}

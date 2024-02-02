package uk.gov.esos.api.user.operator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.operator.domain.OperatorInvitedUserInfoDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.core.domain.enumeration.UserInvitationStatus;
import uk.gov.esos.api.user.operator.transform.OperatorUserAcceptInvitationMapper;

@Service
@RequiredArgsConstructor
public class OperatorUserAcceptInvitationService {

    private final OperatorUserAuthService operatorUserAuthService;
    private final UserRoleTypeService userRoleTypeService;
    private final OperatorUserTokenVerificationService operatorUserTokenVerificationService;
    private final OperatorUserAcceptInvitationMapper operatorUserAcceptInvitationMapper;
    private final AccountQueryService accountQueryService;
    private final OperatorRoleCodeAcceptInvitationServiceDelegator operatorRoleCodeAcceptInvitationServiceDelegator;

    @Transactional
    public OperatorInvitedUserInfoDTO acceptInvitation(String invitationToken) {
        AuthorityInfoDTO authority =
            operatorUserTokenVerificationService.verifyInvitationTokenForPendingAuthority(invitationToken);

        if(!userRoleTypeService.isUserOperator(authority.getUserId())){
            throw new BusinessException(ErrorCode.AUTHORITY_USER_IS_NOT_OPERATOR);
        }

        OperatorUserDTO userDTO = operatorUserAuthService.getOperatorUserById(authority.getUserId());

        String accountInstallationName = accountQueryService.getAccountName(authority.getAccountId());

        OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = operatorUserAcceptInvitationMapper
            .toOperatorUserAcceptInvitationDTO(userDTO, authority, accountInstallationName);

        UserInvitationStatus invitationStatus = operatorRoleCodeAcceptInvitationServiceDelegator
            .acceptInvitation(operatorUserAcceptInvitation, authority.getCode());

        return operatorUserAcceptInvitationMapper
            .toOperatorInvitedUserInfoDTO(operatorUserAcceptInvitation, authority.getCode(), invitationStatus);
    }
}

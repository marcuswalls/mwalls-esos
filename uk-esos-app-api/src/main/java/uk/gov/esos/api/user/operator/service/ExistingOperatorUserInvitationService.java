package uk.gov.esos.api.user.operator.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;

@Log4j2
@Service
@RequiredArgsConstructor
public class ExistingOperatorUserInvitationService {

    private final UserRoleTypeService userRoleTypeService;
    private final OperatorAuthorityService operatorAuthorityService;
    private final AccountQueryService accountQueryService;
    private final OperatorUserNotificationGateway operatorUserNotificationGateway;
    private final OperatorUserAuthService operatorUserAuthService;

    @Transactional
    public void addExistingUserToAccount(OperatorUserInvitationDTO operatorUserInvitationDTO,
                                         Long accountId, String userId, AuthenticationStatus authenticationStatus, AppUser currentUser) {
        log.debug("Adding existing operator user '{}' to account '{}'", () -> userId, () -> accountId);
        checkInvitedUserStatus(userId, authenticationStatus, operatorUserInvitationDTO);

        String authorityUuid = 
        		operatorAuthorityService.createPendingAuthorityForOperator(
        				accountId, operatorUserInvitationDTO.getRoleCode(), userId, currentUser);

        String accountName = accountQueryService.getAccountName(accountId);

        operatorUserNotificationGateway.notifyInvitedUser(
        		operatorUserInvitationDTO,
        		accountName,
        		authorityUuid);
    }

    private void checkInvitedUserStatus(String userId, AuthenticationStatus authenticationStatus,
                                        OperatorUserInvitationDTO operatorUserInvitationDTO) {
        switch (authenticationStatus) {
            case REGISTERED:
                checkInvitedUserRole(userId);
                break;
            case PENDING:
            case DELETED:
                operatorUserAuthService.updateOperatorUserToPending(userId, operatorUserInvitationDTO);
                break;
            default:
                throw new UnsupportedOperationException(String.format("Processing for user status  %s is not supported yet",
                    authenticationStatus));
        }
    }

    private void checkInvitedUserRole(String userId) {
        if (!userRoleTypeService.isUserOperator(userId)) {
            log.error("User '{}' has already been introduced with role other than Operator", () -> userId);
            throw new BusinessException(ErrorCode.USER_ALREADY_REGISTERED);
        }
    }
}

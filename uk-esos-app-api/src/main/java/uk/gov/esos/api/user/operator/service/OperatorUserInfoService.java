package uk.gov.esos.api.user.operator.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.UserInfoService;

@Service
@RequiredArgsConstructor
public class OperatorUserInfoService {

    private final AccountAuthorizationResourceService accountAuthorizationResourceService;
    private final UserInfoService userInfoService;

    public List<UserInfoDTO> getOperatorUsersInfo(AppUser authUser, Long accountId, List<String> userIds) {
        boolean hasAuthUserEditUserScopeOnAccount =
            accountAuthorizationResourceService.hasUserScopeToAccount(authUser, accountId, Scope.EDIT_USER);

        return userInfoService.getUsersInfo(userIds, hasAuthUserEditUserScopeOnAccount);
    }
}

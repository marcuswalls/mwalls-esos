package uk.gov.esos.api.authorization.rules.services.handlers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestTaskAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.RequestTaskAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service("requestTaskAccountBasedAccessHandler")
@RequiredArgsConstructor
public class RequestTaskAccountBasedAccessRuleHandler implements AuthorizationResourceRuleHandler {
    private final AppAuthorizationService appAuthorizationService;
    private final RequestTaskAuthorityInfoProvider requestTaskAuthorityInfoProvider;

    /**
     * @param user the authenticated user
     * @param authorizationRules the list of
     * @param resourceId the resourceId for which the rules apply.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     *
     * Authorizes access on {@link uk.gov.esos.api.account.domain.Account} or {@link CompetentAuthorityEnum},
     * the {@link uk.gov.esos.api.workflow.request.core.domain.Request} of {@link uk.gov.esos.api.workflow.request.core.domain.RequestTask} with id the {@code resourceId}
     * and permission the {@link uk.gov.esos.api.authorization.core.domain.Permission} of the rule
     */
    @Override
    public void evaluateRules(@Valid Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user, String resourceId) {
        RequestTaskAuthorityInfoDTO requestTaskInfoDTO = requestTaskAuthorityInfoProvider.getRequestTaskInfo(Long.parseLong(resourceId));

        List<AuthorizationRuleScopePermission> filteredRules = authorizationRules.stream()
                .filter(rule -> requestTaskInfoDTO.getType().equals(rule.getResourceSubType()))
                .collect(Collectors.toList());

        if (filteredRules.isEmpty()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        filteredRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                    .accountId(requestTaskInfoDTO.getAuthorityInfo().getAccountId())
                    .permission(rule.getPermission()).build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }
}
package uk.gov.esos.api.authorization.rules.services.authorization;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.core.domain.AppUser;

@Service
@RequiredArgsConstructor
public class AppVerificationBodyAuthorizationService implements AppResourceAuthorizationService {

    private final VerificationBodyAuthorizationServiceDelegator verificationBodyAuthorizationService;

    @Override
    public boolean isAuthorized(AppUser user, AuthorizationCriteria criteria) {
        boolean isAuthorized;
        if (ObjectUtils.isEmpty(criteria.getPermission())) {
            isAuthorized = verificationBodyAuthorizationService.isAuthorized(user, criteria.getVerificationBodyId());
        } else {
            isAuthorized = verificationBodyAuthorizationService.isAuthorized(user, criteria.getVerificationBodyId(), criteria.getPermission());
        }

        return isAuthorized;
    }

    @Override
    public ResourceType getResourceType() {
        return ResourceType.VERIFICATION_BODY;
    }
}

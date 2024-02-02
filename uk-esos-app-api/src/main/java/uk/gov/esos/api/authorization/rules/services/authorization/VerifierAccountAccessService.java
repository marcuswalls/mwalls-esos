package uk.gov.esos.api.authorization.rules.services.authorization;

import uk.gov.esos.api.authorization.core.domain.AppUser;

import java.util.Set;

public interface VerifierAccountAccessService {
    Set<Long> findAuthorizedAccountIds(AppUser user);
}

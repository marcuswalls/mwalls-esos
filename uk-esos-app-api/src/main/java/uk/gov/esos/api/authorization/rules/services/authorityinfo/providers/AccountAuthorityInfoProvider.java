package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.Optional;

public interface AccountAuthorityInfoProvider {
    CompetentAuthorityEnum getAccountCa(Long accountId);
    Optional<Long> getAccountVerificationBodyId(Long accountId);
}

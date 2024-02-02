package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;

public interface RequestAuthorityInfoProvider {
    RequestAuthorityInfoDTO getRequestInfo(String id);
}

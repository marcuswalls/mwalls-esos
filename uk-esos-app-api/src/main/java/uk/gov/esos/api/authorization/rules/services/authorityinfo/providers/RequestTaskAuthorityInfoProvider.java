package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestTaskAuthorityInfoDTO;

public interface RequestTaskAuthorityInfoProvider {
    RequestTaskAuthorityInfoDTO getRequestTaskInfo(Long requestTaskId);
}

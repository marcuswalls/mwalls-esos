package uk.gov.esos.api.authorization.rules.services.resource;

import lombok.Builder;
import lombok.Data;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@Builder
public class ResourceCriteria {
    
    private Long accountId;
    private CompetentAuthorityEnum competentAuthority;
    private Long verificationBodyId;
    
}

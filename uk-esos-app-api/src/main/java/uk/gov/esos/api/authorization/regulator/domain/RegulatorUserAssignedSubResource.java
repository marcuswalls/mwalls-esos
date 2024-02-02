package uk.gov.esos.api.authorization.regulator.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegulatorUserAssignedSubResource {
    private CompetentAuthorityEnum ca;
    private String resourceSubType;
}

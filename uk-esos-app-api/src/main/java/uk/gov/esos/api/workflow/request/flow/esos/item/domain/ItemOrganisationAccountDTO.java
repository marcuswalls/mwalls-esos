package uk.gov.esos.api.workflow.request.flow.esos.item.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemOrganisationAccountDTO {

    private Long accountId;

    private String accountName;

    private CompetentAuthorityEnum competentAuthority;

    private String accountOrganisationId;

    private String accountRegistrationNumber;
}

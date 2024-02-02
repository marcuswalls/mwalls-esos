package uk.gov.esos.api.account.organisation.domain.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;

@Getter
@EqualsAndHashCode
public class OrganisationAccountSearchResultsInfoDTO {

    private Long id;
    private String name;
    private String emitterId;
    private OrganisationAccountStatus status;

    public OrganisationAccountSearchResultsInfoDTO(Long id, String name, String emitterId, String status) {
        this.id = id;
        this.name = name;
        this.emitterId = emitterId;
        this.status = OrganisationAccountStatus.valueOf(status);
    }
}

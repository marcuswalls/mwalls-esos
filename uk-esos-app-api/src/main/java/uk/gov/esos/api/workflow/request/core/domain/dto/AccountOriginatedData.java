package uk.gov.esos.api.workflow.request.core.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountOriginatedData {

    private OrganisationDetails organisationDetails;

    private ContactPerson primaryContact;

    private ContactPerson secondaryContact;
}

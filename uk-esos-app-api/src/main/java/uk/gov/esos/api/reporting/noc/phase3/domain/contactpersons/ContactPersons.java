package uk.gov.esos.api.reporting.noc.phase3.domain.contactpersons;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#hasSecondaryContact) == (#secondaryContact != null)}", message = "noc.contactPersons.hasSecondaryContact")
public class ContactPersons implements NocP3Section {

    @Valid
    @NotNull
    private ContactPerson primaryContact;

    @NotNull
    private Boolean hasSecondaryContact;

    @Valid
    private ContactPerson secondaryContact;
}

package uk.gov.esos.api.reporting.noc.phase3.domain.confirmations;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Confirmations implements NocP3Section {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<ResponsibilityAssessmentType> responsibilityAssessmentTypes = new HashSet<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<NoEnergyResponsibilityAssessmentType> noEnergyResponsibilityAssessmentTypes = new HashSet<>();

    @Valid
    @NotNull
    private ContactPerson responsibleOfficerDetails;

    @Past
    private LocalDate reviewAssessmentDate;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<ResponsibilityAssessmentType> secondResponsibleOfficerEnergyTypes = new HashSet<>();

    @Valid
    private ContactPerson secondResponsibleOfficerDetails;
}

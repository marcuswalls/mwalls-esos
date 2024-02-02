package uk.gov.esos.api.reporting.noc.phase3.domain.confirmations;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponsibilityAssessmentType {

    REVIEWED_THE_RECOMMENDATIONS("Has reviewed the recommendations of your organisation's ESOS assessment or alternative routes to compliance (e.g. ISO 50001)"),
    SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME("Is satisfied, to the best of their knowledge, that the organisation is within the scope of the scheme"),
    SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME("Is satisfied, to the best of their knowledge, that the organisation is compliant with the scheme"),
    SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON("Is satisfied, to the best of their knowledge, that relevant sections of the ESOS report, and supporting information where relevant, have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law"),
    SATISFIED_WITH_INFORMATION_PROVIDED("Is satisfied, to the best of their knowledge, that the information provided in this notification is correct");

    private final String description;
}

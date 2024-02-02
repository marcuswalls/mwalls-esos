package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrganisationQualificationType {
    QUALIFY("Yes, the organisation qualifies for ESOS and will submit a notification"),
    NOT_QUALIFY("No, the organisation does not qualify for ESOS and will not submit a notification")
    ;

    private final String description;
}

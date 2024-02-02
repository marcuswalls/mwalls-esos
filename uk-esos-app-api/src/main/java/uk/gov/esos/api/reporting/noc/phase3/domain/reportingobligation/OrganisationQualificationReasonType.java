package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrganisationQualificationReasonType {
    TURNOVER_MORE_THAN_44M("The turnover is over £44m"),
    STAFF_MEMBERS_MORE_THAN_250("We have over 250 staff members")
    ;

    private final String description;
}

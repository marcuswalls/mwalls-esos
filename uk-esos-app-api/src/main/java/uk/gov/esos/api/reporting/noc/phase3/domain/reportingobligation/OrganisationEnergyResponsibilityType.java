package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrganisationEnergyResponsibilityType {
    RESPONSIBLE("Yes, the organisation is responsible for energy"),
    NOT_RESPONSIBLE("No, the organisation has no energy responsibility and the total energy consumption is zero"),
    RESPONSIBLE_BUT_LESS_THAN_40000_KWH("Yes, the organisation is responsible for energy, but used less than 40,000 kWh of energy in the reference period")
    ;

    private final String description;
}

package uk.gov.esos.api.reporting.noc.phase3.domain;

import java.util.Set;

public enum ReportingObligationCategory {
    ESOS_ENERGY_ASSESSMENTS_95_TO_100,
    ISO_50001_COVERING_ENERGY_USAGE,
    PARTIAL_ENERGY_ASSESSMENTS,
    ZERO_ENERGY,
    LESS_THAN_40000_KWH_PER_YEAR,
    ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100,
    NOT_QUALIFY
    ;

    public static Set<ReportingObligationCategory> getQualifyCategories() {
        return Set.of(
            ESOS_ENERGY_ASSESSMENTS_95_TO_100,
            ISO_50001_COVERING_ENERGY_USAGE,
            PARTIAL_ENERGY_ASSESSMENTS,
            ZERO_ENERGY,
            LESS_THAN_40000_KWH_PER_YEAR,
            ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
}

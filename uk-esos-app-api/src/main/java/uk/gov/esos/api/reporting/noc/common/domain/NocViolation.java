package uk.gov.esos.api.reporting.noc.common.domain;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class NocViolation {

    private String sectionName;
    private String message;
    private Object[] data;

    public NocViolation(String sectionName, NocViolation.NocViolationMessage nocViolationMessage) {
        this(sectionName, nocViolationMessage, List.of());
    }

    public NocViolation(String sectionName, NocViolation.NocViolationMessage nocViolationMessage, Object... data) {
        this.sectionName = sectionName;
        this.message = nocViolationMessage.getMessage();
        this.data = data;
    }

    @Getter
    public enum NocViolationMessage {
        INVALID_SECTION("Invalid section"),
        INVALID_SECTION_DATA ("Invalid section data"),
        INVALID_DEPENDENT_SECTION_DATA("Invalid dependent section data"),

        INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST("Not all responsibility assessment types exist"),
        INVALID_RESPONSIBILITY_ASSESSMENT_TYPE("Responsibility assessment types and category are not mutually valid"),
        INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE_LIST("Not all no energy responsibility assessment types exist"),
        INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE("No energy responsibility assessment types and category are not mutually valid"),
        INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS("Second responsible officer details and category are not mutually valid"),
        INVALID_REVIEW_ASSESSMENT_DATE("Second responsible officer details and category are not mutually valid"),
        INVALID_ENERGY_CONSUMPTION_DATA("Energy consumption data and category are not mutually valid"),
        INVALID_TWELVE_MONTHS_VERIFIABLE_DATA("Are data estimated and twelve months verifiable data used are not mutually valid"),
        INVALID_ENERGY_SAVINGS_OPPORTUNITIES_TOTAL("Energy savings opportunities energy consumption total and energy savings opportunities categories total are not equal"),
        INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION("Total energy savings estimation and category are not mutually valid"),
        INVALID_ENERGY_SAVINGS_CONSUMPTION("Energy savings consumption and category are not mutually valid"),
        INVALID_ENERGY_SAVINGS_CATEGORIES("Energy savings categories and category are not mutually valid"),
        INVALID_ENERGY_SAVINGS_CONSUMPTION_ENERGY_SAVINGS_CATEGORIES_TOTAL("Energy savings consumption total and energy savings categories total are not equal"),
        INVALID_ENERGY_CONSUMPTION_REDUCTION("Energy consumption reduction and category are not mutually valid"),
        INVALID_ISO50001_DETAILS("Iso50001 details and compliance routes distribution are not mutually valid"),
        INVALID_DEC_DETAILS("DEC details and compliance routes distribution are not mutually valid"),
        INVALID_GDA_DETAILS("GDA details and compliance routes distribution are not mutually valid"),
        ;

        private final String message;

        NocViolationMessage(String message) {
            this.message = message;
        }
    }
}

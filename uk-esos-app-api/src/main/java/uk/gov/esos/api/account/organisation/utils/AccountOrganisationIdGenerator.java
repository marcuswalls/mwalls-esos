package uk.gov.esos.api.account.organisation.utils;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AccountOrganisationIdGenerator {

    public final String ORGANISATION_ID_PREFIX = "ORG";

    public String generate(Long id) {
        return String.format("%s%s", ORGANISATION_ID_PREFIX, String.format("%06d", id));
    }
}

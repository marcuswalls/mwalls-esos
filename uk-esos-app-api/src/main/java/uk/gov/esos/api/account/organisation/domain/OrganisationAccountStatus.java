package uk.gov.esos.api.account.organisation.domain;

import uk.gov.esos.api.account.domain.enumeration.AccountStatus;

public enum OrganisationAccountStatus implements AccountStatus {

    UNAPPROVED,
    LIVE,
    DENIED
    ;

    @Override
    public String getName() {
        return this.name();
    }
}

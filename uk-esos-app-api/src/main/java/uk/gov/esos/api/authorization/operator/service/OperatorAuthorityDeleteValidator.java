package uk.gov.esos.api.authorization.operator.service;

import uk.gov.esos.api.authorization.core.domain.Authority;

public interface OperatorAuthorityDeleteValidator {

    void validateDeletion(Authority authority);
}
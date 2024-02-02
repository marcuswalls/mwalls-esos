package uk.gov.esos.api.verificationbody.event;

import java.util.Set;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;

@Getter
@EqualsAndHashCode
@RequiredArgsConstructor
public class AccreditationEmissionTradingSchemeNotAvailableEvent {

    private final Long verificationBodyId;
    private final Set<EmissionTradingScheme> notAvailableAccreditationEmissionTradingSchemes;
}

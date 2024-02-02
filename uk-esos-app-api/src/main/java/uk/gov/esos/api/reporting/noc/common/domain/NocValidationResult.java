package uk.gov.esos.api.reporting.noc.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocValidationResult {

    private boolean valid;

    @Builder.Default
    private List<NocViolation> nocViolations = new ArrayList<>();

    public static NocValidationResult validNoc() {
        return NocValidationResult.builder().valid(true).build();
    }

    public static NocValidationResult invalidNoc(List<NocViolation> nocViolations) {
        return NocValidationResult.builder().valid(false).nocViolations(nocViolations).build();
    }
}

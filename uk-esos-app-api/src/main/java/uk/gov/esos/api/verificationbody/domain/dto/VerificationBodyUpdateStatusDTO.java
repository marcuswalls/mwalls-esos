package uk.gov.esos.api.verificationbody.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.verificationbody.domain.dto.validation.StatusPending;
import uk.gov.esos.api.verificationbody.enumeration.VerificationBodyStatus;

import jakarta.validation.constraints.NotNull;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationBodyUpdateStatusDTO {

    @NotNull
    private Long id;

    @NotNull
    @StatusPending
    private VerificationBodyStatus status;
}

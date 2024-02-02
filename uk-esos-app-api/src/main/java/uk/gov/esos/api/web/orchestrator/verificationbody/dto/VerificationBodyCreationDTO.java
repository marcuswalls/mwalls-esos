package uk.gov.esos.api.web.orchestrator.verificationbody.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.user.verifier.domain.AdminVerifierUserInvitationDTO;
import uk.gov.esos.api.verificationbody.domain.dto.VerificationBodyEditDTO;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationBodyCreationDTO {

    @JsonUnwrapped
    @Valid
    private VerificationBodyEditDTO verificationBody;

    @NotNull(message = "{verificationBody.adminUser.notEmpty}")
    @Valid
    private AdminVerifierUserInvitationDTO adminVerifierUserInvitation;
}

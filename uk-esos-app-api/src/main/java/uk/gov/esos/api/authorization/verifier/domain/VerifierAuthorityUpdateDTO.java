package uk.gov.esos.api.authorization.verifier.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.RoleCode;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifierAuthorityUpdateDTO {

	@NotBlank
	private String userId;
	
	@NotNull
    private AuthorityStatus authorityStatus;

	@RoleCode(roleType = RoleType.VERIFIER)
    private String roleCode;
}

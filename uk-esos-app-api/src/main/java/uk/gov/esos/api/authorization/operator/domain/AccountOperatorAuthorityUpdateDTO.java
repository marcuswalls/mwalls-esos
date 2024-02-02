package uk.gov.esos.api.authorization.operator.domain;

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
public class AccountOperatorAuthorityUpdateDTO {

    @NotBlank
	private String userId;

    @RoleCode(roleType = RoleType.OPERATOR)
	private String roleCode;

    @NotNull
    private AuthorityStatus authorityStatus;
    
}

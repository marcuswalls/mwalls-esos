package uk.gov.esos.api.account.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class AccountDTO {
	
	private Long id;
	
	@NotNull
	private AccountType accountType;

	@NotBlank
	@Size(max = 255)
	private String name;

    private EmissionTradingScheme emissionTradingScheme;

	private CompetentAuthorityEnum competentAuthority;

	private LocalDateTime acceptedDate;
}

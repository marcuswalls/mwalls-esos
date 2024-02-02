package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationAssociatedWithRU {

    @Size(max = 255)
	private String registrationNumber;
	
	@NotBlank
    @Size(max = 255)
	private String organisationName;
	
    @Size(max = 255)
	private String taxReferenceNumber;
	
	@NotNull
	private Boolean isCoveredByThisNotification;
	
	@NotNull
	private Boolean isPartOfArrangement;
	
	@NotNull
	private Boolean isParentOfResponsibleUndertaking;
	
	@NotNull
	private Boolean isSubsidiaryOfResponsibleUndertaking;
	
	@NotNull
	private Boolean isPartOfFranchise;
	
	@NotNull
	private Boolean isTrust;
	
	@NotNull
	private Boolean hasCeasedToBePartOfGroup;
}

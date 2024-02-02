package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

import java.util.LinkedHashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationStructure implements NocP3Section {

	@NotNull
	private Boolean isPartOfArrangement;
	
	@NotNull
	private Boolean isPartOfFranchise;
	
	@NotNull
	private Boolean isTrust;
	
	@NotNull
	private Boolean hasCeasedToBePartOfGroup;
	
	@Valid
    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
	@JsonDeserialize(as = LinkedHashSet.class)
	private Set<OrganisationAssociatedWithRU> organisationsAssociatedWithRU = new LinkedHashSet<>();
}

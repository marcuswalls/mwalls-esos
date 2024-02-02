package uk.gov.esos.api.competentauthority.repository;

import java.util.Optional;

import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.competentauthority.domain.CompetentAuthority;

public interface CompetentAuthorityCustomRepository {

	Optional<CompetentAuthority> findByIdForUpdate(CompetentAuthorityEnum id);
	
}

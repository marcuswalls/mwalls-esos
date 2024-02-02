package uk.gov.esos.api.reporting.noc.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.reporting.noc.common.domain.NocEntity;

@Repository
public interface NocRepository extends JpaRepository<NocEntity, String> {

}

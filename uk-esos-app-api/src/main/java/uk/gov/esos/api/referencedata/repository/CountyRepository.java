package uk.gov.esos.api.referencedata.repository;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.referencedata.domain.Country;
import uk.gov.esos.api.referencedata.domain.County;

import java.util.Optional;

/**
 * Repository for {@link County} objects.
 */
@Repository
public interface CountyRepository extends JpaRepository<County, Long> {
}

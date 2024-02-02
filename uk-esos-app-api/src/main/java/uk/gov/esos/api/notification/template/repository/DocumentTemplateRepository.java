package uk.gov.esos.api.notification.template.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.notification.template.domain.DocumentTemplate;
import uk.gov.esos.api.notification.template.domain.enumeration.DocumentTemplateType;

import java.util.Optional;

@Repository
public interface DocumentTemplateRepository extends JpaRepository<DocumentTemplate, Long>, DocumentTemplateCustomRepository {

    Optional<DocumentTemplate> findByTypeAndCompetentAuthorityAndAccountType(DocumentTemplateType type,
                                                                             CompetentAuthorityEnum competentAuthority,
                                                                             AccountType accountType);
}

package uk.gov.esos.api.notification.template.repository;

import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.notification.template.domain.dto.DocumentTemplateSearchCriteria;
import uk.gov.esos.api.notification.template.domain.dto.TemplateSearchResults;

public interface DocumentTemplateCustomRepository {

    @Transactional(readOnly = true)
    TemplateSearchResults findBySearchCriteria(DocumentTemplateSearchCriteria searchCriteria);
}

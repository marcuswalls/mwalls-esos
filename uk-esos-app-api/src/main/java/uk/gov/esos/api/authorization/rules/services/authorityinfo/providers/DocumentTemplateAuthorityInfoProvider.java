package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

public interface DocumentTemplateAuthorityInfoProvider {
    CompetentAuthorityEnum getDocumentTemplateCaById(Long templateId);
}

package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

public interface NotificationTemplateAuthorityInfoProvider {
    CompetentAuthorityEnum getNotificationTemplateCaById(Long templateId);

}

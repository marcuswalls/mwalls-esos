package uk.gov.esos.api.notification.mail.domain;

import lombok.Builder;
import lombok.Data;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;

import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class EmailNotificationTemplateData {

    private CompetentAuthorityEnum competentAuthority;
    
    private NotificationTemplateName templateName;

    private AccountType accountType;
    
    @Builder.Default
    private Map<String, Object> templateParams = new HashMap<>();
    
}

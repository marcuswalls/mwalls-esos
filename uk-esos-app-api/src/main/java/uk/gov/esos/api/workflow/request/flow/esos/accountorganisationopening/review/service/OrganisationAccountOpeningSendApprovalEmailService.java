package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.domain.EmailNotificationTemplateData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.user.application.UserService;
import uk.gov.esos.api.user.core.domain.dto.ApplicationUserDTO;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningSendApprovalEmailService {

    private final RequestService requestService;
    private final NotificationEmailService notificationEmailService;
    private final UserService userService;
    private final NotificationProperties notificationProperties;
    private final AppProperties appProperties;

    public void sendEmail(String requestId) {
        Request request = requestService.findRequestById(requestId);

        String assigneeUserId = request.getPayload().getOperatorAssignee();
        ApplicationUserDTO assigneeUser = userService.getUserById(assigneeUserId);

        EmailData emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(NotificationTemplateName.ACCOUNT_APPLICATION_APPROVED)
                .templateParams(Map.of(
                    EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl(),
                    EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()
                ))
                .build())
            .build();

        notificationEmailService.notifyRecipient(emailData, assigneeUser.getEmail());
    }
}

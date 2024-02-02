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
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningSendRejectionEmailService {

    private final RequestService requestService;
    private final UserService userService;
    private final NotificationEmailService notificationEmailService;
    private final NotificationProperties notificationProperties;
    private final AppProperties appProperties;

    public void sendEmail(String requestId) {
        Request request = requestService.findRequestById(requestId);

        OrganisationAccountOpeningRequestPayload requestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();
        AccountOpeningDecisionPayload decision = requestPayload.getDecision();

        String assigneeUserId = requestPayload.getOperatorAssignee();
        ApplicationUserDTO assigneeUser = userService.getUserById(assigneeUserId);

        EmailData emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(NotificationTemplateName.ACCOUNT_APPLICATION_REJECTED)
                .templateParams(Map.of(
                    EmailNotificationTemplateConstants.ACCOUNT_APPLICATION_REJECTED_REASON, decision.getReason(),
                    EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl(),
                    EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()
                ))
                .build())
            .build();

        notificationEmailService.notifyRecipient(emailData, assigneeUser.getEmail());
    }
}

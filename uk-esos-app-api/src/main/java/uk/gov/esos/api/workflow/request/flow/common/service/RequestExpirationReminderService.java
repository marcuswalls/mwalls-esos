package uk.gov.esos.api.workflow.request.flow.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.dto.AccountInfoDTO;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityService;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.domain.EmailNotificationTemplateData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.NotificationTemplateExpirationReminderParams;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RequestExpirationReminderService {

    private final RequestService requestService;
    private final AccountQueryService accountQueryService;
    private final NotificationEmailService notificationEmailService;
    private final CompetentAuthorityService competentAuthorityService;

    public void sendExpirationReminderNotification(String requestId, NotificationTemplateExpirationReminderParams expirationParams) {
        final Request request = requestService.findRequestById(requestId);
        final Long accountId = request.getAccountId();
        final AccountInfoDTO accountInfo = accountQueryService.getAccountInfoDTOById(accountId);
        final AccountType accountType = request.getType().getAccountType();
        
        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(EmailNotificationTemplateConstants.ACCOUNT_NAME, accountInfo.getName());
        templateParams.put(EmailNotificationTemplateConstants.EMITTER_ID, accountInfo.getEmitterId());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW_ID, request.getId());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW, request.getType().getDescription());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW_TASK, expirationParams.getWorkflowTask());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW_USER, expirationParams.getRecipient().getFullName());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW_EXPIRATION_TIME, expirationParams.getExpirationTime());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW_EXPIRATION_TIME_LONG, expirationParams.getExpirationTimeLong());
        templateParams.put(EmailNotificationTemplateConstants.WORKFLOW_DEADLINE, expirationParams.getDeadline());
        templateParams.put(EmailNotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthorityService
                .getCompetentAuthority(request.getCompetentAuthority(), accountType).getEmail());
        
        final EmailData emailData = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .competentAuthority(request.getCompetentAuthority())
                        .templateName(NotificationTemplateName.GENERIC_EXPIRATION_REMINDER)
                        .accountType(request.getType().getAccountType())
                        .templateParams(templateParams)
                        .build())
                .build();
        
        notificationEmailService.notifyRecipient(emailData, expirationParams.getRecipient().getEmail());
    }
}

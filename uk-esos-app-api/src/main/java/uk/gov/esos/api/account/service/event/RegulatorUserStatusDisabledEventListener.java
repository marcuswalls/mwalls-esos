package uk.gov.esos.api.account.service.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.account.service.AccountCaSiteContactService;
import uk.gov.esos.api.authorization.regulator.event.RegulatorUserStatusDisabledEvent;

@RequiredArgsConstructor
@Component
public class RegulatorUserStatusDisabledEventListener {

private final AccountCaSiteContactService accountCaSiteContactService;
    
    @EventListener(RegulatorUserStatusDisabledEvent.class)
    public void onRegulatorUserStatusDisabledEvent(RegulatorUserStatusDisabledEvent event) {
        removeUserFromCaSiteContact(event.getUserId());
    }
    
    private void removeUserFromCaSiteContact(String userId) {
        accountCaSiteContactService.removeUserFromCaSiteContact(userId);
    }
}

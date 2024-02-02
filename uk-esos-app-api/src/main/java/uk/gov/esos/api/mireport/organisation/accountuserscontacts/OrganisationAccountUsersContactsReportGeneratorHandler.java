package uk.gov.esos.api.mireport.organisation.accountuserscontacts;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.mireport.common.accountuserscontacts.AccountUserContact;
import uk.gov.esos.api.mireport.common.accountuserscontacts.AccountUsersContactsReportGenerator;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import jakarta.persistence.EntityManager;
import java.util.List;

@Service
public class OrganisationAccountUsersContactsReportGeneratorHandler
    extends AccountUsersContactsReportGenerator
    implements OrganisationMiReportGeneratorHandler<EmptyMiReportParams> {

    private final OrganisationAccountUsersContactsRepository accountUsersContactsRepository;

    public OrganisationAccountUsersContactsReportGeneratorHandler(OrganisationAccountUsersContactsRepository accountUsersContactsRepository,
                                                                  UserAuthService userAuthService) {
        super(userAuthService);
        this.accountUsersContactsRepository = accountUsersContactsRepository;
    }

    @Override
    public List<AccountUserContact> findAccountUserContacts(EntityManager entityManager) {
        return accountUsersContactsRepository.findAccountUserContacts(entityManager);
    }
}

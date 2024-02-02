package uk.gov.esos.api.mireport.organisation.accountsregulatorsitecontacts;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactReportGenerator;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import jakarta.persistence.EntityManager;
import java.util.List;

@Service
public class OrganisationAccountAssignedRegulatorSiteContactReportGeneratorHandler
    extends AccountAssignedRegulatorSiteContactReportGenerator
    implements OrganisationMiReportGeneratorHandler<EmptyMiReportParams> {

    private final OrganisationAccountAssignedRegulatorSiteContactsRepository regulatorSiteContactsRepository;

    public OrganisationAccountAssignedRegulatorSiteContactReportGeneratorHandler(
        OrganisationAccountAssignedRegulatorSiteContactsRepository regulatorSiteContactsRepository,
        UserAuthService userAuthService) {
        super(userAuthService);
        this.regulatorSiteContactsRepository = regulatorSiteContactsRepository;
    }

    @Override
    public List<AccountAssignedRegulatorSiteContact> findAccountAssignedRegulatorSiteContacts(EntityManager entityManager) {
        return regulatorSiteContactsRepository.findAccountAssignedRegulatorSiteContacts(entityManager);
    }

}

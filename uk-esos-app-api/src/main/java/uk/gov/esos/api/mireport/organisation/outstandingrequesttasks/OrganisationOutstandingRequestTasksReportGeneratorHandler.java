package uk.gov.esos.api.mireport.organisation.outstandingrequesttasks;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTasksReportGenerator;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTasksReportService;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTasksRepository;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@Service
public class OrganisationOutstandingRequestTasksReportGeneratorHandler
    extends OutstandingRequestTasksReportGenerator
    implements OrganisationMiReportGeneratorHandler<OutstandingRegulatorRequestTasksMiReportParams> {


    public OrganisationOutstandingRequestTasksReportGeneratorHandler(OutstandingRequestTasksReportService outstandingRequestTasksReportService,
                                                                     OutstandingRequestTasksRepository outstandingRequestTasksRepository,
                                                                     UserAuthService userAuthService) {
        super(outstandingRequestTasksReportService, outstandingRequestTasksRepository, userAuthService);
    }

    @Override
    public AccountType getAccountType() {
        return AccountType.ORGANISATION;
    }
}

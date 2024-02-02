package uk.gov.esos.api.mireport.organisation.customreport;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.mireport.common.customreport.CustomMiReportGeneratorHandler;
import uk.gov.esos.api.mireport.common.customreport.CustomMiReportParams;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@Service
public class OrganisationCustomMiReportGeneratorHandlerImpl extends CustomMiReportGeneratorHandler
        implements OrganisationMiReportGeneratorHandler<CustomMiReportParams> {

    public OrganisationCustomMiReportGeneratorHandlerImpl(UserAuthService userAuthService) {
        super(userAuthService);
    }
}

package uk.gov.esos.api.mireport.common;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportParams;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

public interface MiReportGeneratorService {

    MiReportResult generateReport(CompetentAuthorityEnum competentAuthority, MiReportParams reportParams);

    AccountType getAccountType();
}

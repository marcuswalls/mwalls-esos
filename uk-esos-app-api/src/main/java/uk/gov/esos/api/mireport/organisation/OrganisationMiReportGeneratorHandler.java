package uk.gov.esos.api.mireport.organisation;

import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportParams;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

import jakarta.persistence.EntityManager;

public interface OrganisationMiReportGeneratorHandler<T extends MiReportParams> {

    MiReportResult generateMiReport(EntityManager entityManager, T reportParams);

    MiReportType getReportType();
}

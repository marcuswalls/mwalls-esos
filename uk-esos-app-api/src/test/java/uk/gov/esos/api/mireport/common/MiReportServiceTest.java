package uk.gov.esos.api.mireport.common;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportSearchResult;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorService;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MiReportServiceTest {

    @InjectMocks
    private MiReportService service;

    @Mock
    private MiReportRepository miReportRepository;

    @Spy
    private ArrayList<MiReportGeneratorService> miReportGeneratorServices;

    @Mock
    private OrganisationMiReportGeneratorService organisationMiReportGeneratorService;

    @BeforeEach
    void setup() {
        miReportGeneratorServices.add(organisationMiReportGeneratorService);
    }

    @Test
    void findByCompetentAuthorityAndAccountType() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        AccountType accountType = AccountType.ORGANISATION;
        MiReportSearchResult expectedMiReportSearchResult = Mockito.mock(MiReportSearchResult.class);

        when(miReportRepository.findByCompetentAuthorityAndAccountType(competentAuthority, accountType))
            .thenReturn(List.of(expectedMiReportSearchResult));

        List<MiReportSearchResult> actual = service.findByCompetentAuthorityAndAccountType(competentAuthority, accountType);

        assertThat(actual.get(0)).isEqualTo(expectedMiReportSearchResult);
    }

    @Test
    void generateReport() {
        AccountType accountType = AccountType.ORGANISATION;
        AppUser pmrvUser = AppUser.builder()
                .userId("userId")
                .roleType(RoleType.REGULATOR)
                .authorities(List.of(AppAuthority.builder()
                        .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                        .build()))
                .build();
        MiReportType reportType = MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS;
        EmptyMiReportParams reportParams = EmptyMiReportParams.builder().reportType(reportType).build();
        MiReportResult expectedMiReportResult = mock(MiReportResult.class);

        when(organisationMiReportGeneratorService.getAccountType()).thenReturn(accountType);
        when(organisationMiReportGeneratorService.generateReport(pmrvUser.getCompetentAuthority(), reportParams))
            .thenReturn(expectedMiReportResult);

        MiReportResult actualMiReportResult = service.generateReport(pmrvUser.getCompetentAuthority(), accountType, reportParams);

        assertThat(actualMiReportResult).isEqualTo(expectedMiReportResult);
    }

    @Test
    void generateReport_generator_not_found() {
        AccountType accountType = AccountType.ORGANISATION;
        AppUser pmrvUser = AppUser.builder()
                .userId("userId")
                .roleType(RoleType.REGULATOR)
                .authorities(List.of(AppAuthority.builder()
                        .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                        .build()))
                .build();
        MiReportType reportType = MiReportType.COMPLETED_WORK;
        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder().reportType(reportType).build();

        when(organisationMiReportGeneratorService.getAccountType()).thenReturn(null);

        BusinessException businessException = assertThrows(
            BusinessException.class, () -> service.generateReport(pmrvUser.getCompetentAuthority(), accountType, reportParams));

        assertEquals(ErrorCode.MI_REPORT_TYPE_NOT_SUPPORTED, businessException.getErrorCode());
    }
}

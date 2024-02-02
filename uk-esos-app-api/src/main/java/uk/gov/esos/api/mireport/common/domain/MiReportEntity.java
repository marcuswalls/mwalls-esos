package uk.gov.esos.api.mireport.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.MiReportType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
    name = "mi_report",
    uniqueConstraints = @UniqueConstraint(columnNames = {"competent_authority", "type", "account_type"})
)
public class MiReportEntity {

    @Id
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private MiReportType miReportType;

    @Enumerated(EnumType.STRING)
    @Column(name = "competent_authority")
    private CompetentAuthorityEnum competentAuthority;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type")
    private AccountType accountType;
}

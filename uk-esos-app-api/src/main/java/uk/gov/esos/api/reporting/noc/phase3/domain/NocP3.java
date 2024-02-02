package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.AlternativeComplianceRoutes;
import uk.gov.esos.api.reporting.noc.phase3.domain.assessmentpersonnel.AssessmentPersonnel;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.ComplianceRoute;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.Confirmations;
import uk.gov.esos.api.reporting.noc.phase3.domain.contactpersons.ContactPersons;
import uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails.EnergyConsumptionDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsAchieved;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities.EnergySavingsOpportunities;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriod;
import uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor.LeadAssessor;
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationStructure;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod.SecondCompliancePeriod;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocP3 {

    @NotNull
    @Valid
    private ReportingObligation reportingObligation;

    @Valid
    private ResponsibleUndertaking responsibleUndertaking;

    @Valid
    private ContactPersons contactPersons;
    
    @Valid
    private OrganisationStructure organisationStructure;
    
    @Valid
    private ComplianceRoute complianceRoute;

    @Valid
    private EnergyConsumptionDetails energyConsumptionDetails;
    
    @Valid
    private EnergySavingsOpportunities energySavingsOpportunities;

    @Valid
    private AlternativeComplianceRoutes alternativeComplianceRoutes;
    
    @Valid
    private EnergySavingsAchieved energySavingsAchieved;
    
    @Valid
    private LeadAssessor leadAssessor;
    
    @Valid
    private AssessmentPersonnel assessmentPersonnel;
    
    @Valid
    private SecondCompliancePeriod secondCompliancePeriod;
    
    @Valid
    private FirstCompliancePeriod firstCompliancePeriod;

    @Valid
    private Confirmations confirmations;
}

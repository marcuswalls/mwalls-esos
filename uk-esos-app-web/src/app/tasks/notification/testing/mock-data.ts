import { RequestTaskState } from '@common/request-task/+state';
import { mockRequestTask } from '@common/request-task/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import {
  AlternativeComplianceRoutes,
  AssessmentPersonnel,
  ComplianceRoute,
  Confirmations,
  ContactPersons,
  EnergyConsumption,
  EnergyConsumptionDetails,
  EnergySavingsAchieved,
  EnergySavingsOpportunities,
  FirstCompliancePeriod,
  FirstCompliancePeriodDetails,
  LeadAssessor,
  OrganisationStructure,
  ResponsibleUndertaking,
  SecondCompliancePeriod,
  SignificantEnergyConsumption,
} from 'esos-api';

import { NotificationTaskPayload } from '../notification.types';

export const mockContactPersons: ContactPersons = {
  primaryContact: {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },

  hasSecondaryContact: true,
  secondaryContact: {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },
};

export const mockNotificationTaskPayload: NotificationTaskPayload = {
  noc: {
    assessmentPersonnel: {
      personnel: [
        {
          firstName: 'John',
          lastName: 'Doe',
          type: 'INTERNAL',
        },
        {
          firstName: 'John',
          lastName: 'Smith',
          type: 'EXTERNAL',
        },
      ],
    },
    leadAssessor: {
      leadAssessorType: 'EXTERNAL',
      hasLeadAssessorConfirmation: true,
      leadAssessorDetails: {
        firstName: 'Mike',
        lastName: 'Btiste',
        email: 'dpg@media.com',
        professionalBody: 'ASSOCIATION_OF_ENERGY_ENGINEERS',
        membershipNumber: '13',
      },
    },
    reportingObligation: {
      qualificationType: 'QUALIFY',
      reportingObligationDetails: {
        qualificationReasonTypes: [],
        energyResponsibilityType: 'RESPONSIBLE',
      },
    },
  },
};

export const mockAssessmentPersonnel: AssessmentPersonnel = {
  personnel: [
    {
      firstName: 'John',
      lastName: 'Doe',
      type: 'INTERNAL',
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      type: 'EXTERNAL',
    },
  ],
};

export const mockEnergySavingOpportunities: EnergySavingsOpportunities = {
  energyConsumption: {
    buildings: 2,
    transport: 4,
    industrialProcesses: 9,
    otherProcesses: 13,
    total: 28,
  },
  energySavingsCategories: {
    energyManagementPractices: 1,
    behaviourChangeInterventions: 2,
    training: 3,
    controlsImprovements: 4,
    shortTermCapitalInvestments: 5,
    longTermCapitalInvestments: 6,
    otherMeasures: 7,
    total: 28,
  },
};

export const mockResponsibleUndertaking: ResponsibleUndertaking = {
  organisationDetails: {
    name: 'Corporate Legal Entity Account 2',
    registrationNumber: '111111',
    line1: 'Some address 1',
    line2: 'Some address 2',
    city: 'London',
    county: 'London',
    postcode: '511111',
  },
  tradingDetails: {
    exist: true,
    tradingName: 'Trading name',
  },
  organisationContactDetails: {
    email: '1@o.com',
    phoneNumber: {
      countryCode: '44',
      number: '02071234567',
    },
  },
  hasOverseasParentDetails: true,
  overseasParentDetails: {
    name: 'Parent company name',
    tradingName: 'Parent company trading name',
  },
};
export const mockOrganisationStructure: OrganisationStructure = {
  hasCeasedToBePartOfGroup: false,
  isPartOfArrangement: true,
  isPartOfFranchise: false,
  isTrust: true,
  organisationsAssociatedWithRU: [
    {
      hasCeasedToBePartOfGroup: true,
      isCoveredByThisNotification: true,
      isParentOfResponsibleUndertaking: true,
      isPartOfArrangement: true,
      isPartOfFranchise: false,
      isSubsidiaryOfResponsibleUndertaking: true,
      isTrust: false,
      organisationName: 'Organisation name',
    },
  ],
};

export const mockEnergySavingsAchieved: EnergySavingsAchieved = {
  details: 'lorem ipsum',
  energySavingCategoriesExist: true,
  energySavingsCategories: {
    energyManagementPractices: 0,
    behaviourChangeInterventions: 0,
    training: 0,
    controlsImprovements: 0,
    shortTermCapitalInvestments: 0,
    longTermCapitalInvestments: 0,
    otherMeasures: 0,
    total: 0,
  },
  energySavingsEstimation: {
    buildings: 0,
    transport: 0,
    industrialProcesses: 0,
    otherProcesses: 0,
    total: 0,
  },
  energySavingsRecommendationsExist: true,
  energySavingsRecommendations: {
    energyAudits: 0,
    alternativeComplianceRoutes: 0,
    other: 0,
    total: 0,
  },
};

export const mockEnergySavingsAchievedWithTotalEstimate: EnergySavingsAchieved = {
  details: 'lorem ipsum',
  energySavingsRecommendationsExist: true,
  energySavingsRecommendations: {
    energyAudits: 0,
    alternativeComplianceRoutes: 0,
    other: 0,
    total: 0,
  },
  totalEnergySavingsEstimation: 100,
};

export const mockLeadAssessor: LeadAssessor = {
  leadAssessorType: 'EXTERNAL',
  hasLeadAssessorConfirmation: true,
  leadAssessorDetails: {
    firstName: 'Mike',
    lastName: 'Batiste',
    email: 'dpg@media.com',
    professionalBody: 'ASSOCIATION_OF_ENERGY_ENGINEERS',
    membershipNumber: '13',
  },
};

export const mockEnergyConsumptionDetails: EnergyConsumptionDetails = {
  totalEnergyConsumption: {
    buildings: 100,
    transport: 0,
    industrialProcesses: 50,
    otherProcesses: 0,
    total: 150,
  },
  significantEnergyConsumptionExists: true,
  significantEnergyConsumption: {
    buildings: 100,
    transport: 0,
    industrialProcesses: 45,
    otherProcesses: 0,
    total: 145,
    significantEnergyConsumptionPct: 97,
  },
  energyIntensityRatioData: {
    buildingsIntensityRatio: {
      ratio: '50',
      unit: 'm2',
      additionalInformation: 'Buildings additional information',
    },
    freightsIntensityRatio: {
      ratio: '60',
      unit: 'freight miles',
    },
    passengersIntensityRatio: {
      ratio: '70',
      unit: 'passenger miles',
      additionalInformation: null,
    },
    industrialProcessesIntensityRatio: {
      ratio: '80',
      unit: 'tonnes',
      additionalInformation: null,
    },
    otherProcessesIntensityRatios: [
      {
        name: 'custom',
        ratio: '100',
        unit: 'litres',
        additionalInformation: null,
      },
    ],
  },
  additionalInformationExists: true,
  additionalInformation: 'Additional info',
};

export const mockComplianceRoute: ComplianceRoute = {
  areDataEstimated: false,
  twelveMonthsVerifiableDataUsed: 'YES',
  energyConsumptionProfilingUsed: 'NOT_APPLICABLE',
  energyAudits: [
    {
      description: 'desc1',
      numberOfSitesCovered: 5,
      numberOfSitesVisited: 10,
      reason: 'reason1',
    },
    {
      description: 'desc2',
      numberOfSitesCovered: 999,
      numberOfSitesVisited: 999,
      reason: 'reason2',
    },
  ],
  partsProhibitedFromDisclosingExist: true,
  partsProhibitedFromDisclosing: 'parts',
  partsProhibitedFromDisclosingReason: 'reason',
};

export const mockSignificantEnergyConsumption: SignificantEnergyConsumption = {
  buildings: 5000,
  transport: 3000,
  industrialProcesses: 2000,
  otherProcesses: 1000,
  total: 11000,
  significantEnergyConsumptionPct: 25,
};

export const mockEnergyConsumption: EnergyConsumption = {
  buildings: 4000,
  transport: 2500,
  industrialProcesses: 1500,
  otherProcesses: 800,
  total: 8800,
};

export const mockFirstCompliancePeriodDetails: FirstCompliancePeriodDetails = {
  organisationalEnergyConsumption: mockEnergyConsumption,
  significantEnergyConsumptionExists: true,
  significantEnergyConsumption: mockSignificantEnergyConsumption,
  explanation: 'Explanation for changes in total consumption',
  potentialReductionExists: true,
  potentialReduction: mockEnergyConsumption,
};

export const mockFirstCompliancePeriod: FirstCompliancePeriod = {
  informationExists: true,
  firstCompliancePeriodDetails: mockFirstCompliancePeriodDetails,
};

export const mockSecondCompliancePeriod: SecondCompliancePeriod = {
  informationExists: true,
  reductionAchievedExists: true,
  reductionAchieved: mockEnergyConsumptionDetails.totalEnergyConsumption,
  firstCompliancePeriodDetails: mockFirstCompliancePeriodDetails,
};

export const mockConfirmations: Confirmations = {
  responsibilityAssessmentTypes: [
    'REVIEWED_THE_RECOMMENDATIONS',
    'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
    'SATISFIED_WITH_INFORMATION_PROVIDED',
  ],
  noEnergyResponsibilityAssessmentTypes: [
    'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_INFORMATION_PROVIDED',
  ],

  responsibleOfficerDetails: {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },
  reviewAssessmentDate: '2022-02-02',
  secondResponsibleOfficerEnergyTypes: [
    'REVIEWED_THE_RECOMMENDATIONS',
    'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
    'SATISFIED_WITH_INFORMATION_PROVIDED',
  ],

  secondResponsibleOfficerDetails: {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },
};

export const mockAlternativeComplianceRoutes: AlternativeComplianceRoutes = {
  totalEnergyConsumptionReduction: 12,
  energyConsumptionReduction: {
    buildings: 1,
    transport: 5,
    industrialProcesses: 4,
    otherProcesses: 2,
    total: 12,
  },
  energyConsumptionReductionCategories: {
    energyManagementPractices: 1,
    behaviourChangeInterventions: 2,
    training: 3,
    controlsImprovements: 4,
    shortTermCapitalInvestments: 1,
    longTermCapitalInvestments: 0,
    otherMeasures: 1,
    total: 12,
  },
  assets: {
    iso50001: 'iso1',
    dec: 'dec1',
    gda: 'gda1',
  },
  iso50001CertificateDetails: {
    certificateNumber: 'iso1',
    validFrom: '2022-01-01T00:00:00.000Z',
    validUntil: '2024-01-01T00:00:00.000Z',
  },
  decCertificatesDetails: {
    certificateDetails: [
      {
        certificateNumber: 'dec1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      {
        certificateNumber: 'dec2',
        validFrom: '2020-01-01T00:00:00.000Z',
        validUntil: '2021-01-01T00:00:00.000Z',
      },
    ],
  },
  gdaCertificatesDetails: {
    certificateDetails: [
      {
        certificateNumber: 'gda1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      {
        certificateNumber: 'gda2',
        validFrom: '2020-01-01T00:00:00.000Z',
        validUntil: '2021-01-01T00:00:00.000Z',
      },
    ],
  },
};

export const mockNotificationRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        noc: {
          contactPersons: {} as ContactPersons,
          assessmentPersonnel: {} as AssessmentPersonnel,
          reportingObligation: { qualificationType: 'QUALIFY' },
          organisationStructure: {} as OrganisationStructure,
          confirmations: {} as Confirmations,
        },
        accountOriginatedData: {
          primaryContact: mockContactPersons.primaryContact,
          secondaryContact: {
            firstName: 'Paul',
            lastName: 'Doe',
            jobTitle: 'Job title second',
            email: null,
            line1: 'Line second',
            city: 'City second',
            county: 'County second',
            postcode: 'Postcode second',
          },
          organisationDetails: {
            city: 'City',
            county: 'Powys',
            line1: 'Line 1',
            line2: 'Line 2',
            name: 'Ru Org Name',
            postcode: 'Postcode',
          },
        },
        nocSectionsCompleted: {
          contactPersons: 'IN_PROGRESS',
          assessmentPersonnel: 'IN_PROGRESS',
          energySavingsAchieved: 'IN_PROGRESS',
          confirmations: 'IN_PROGRESS',
        },
      } as NotificationTaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: Partial<Record<keyof NotificationTaskPayload['noc'], any>>,
  taskStatus?: Partial<Record<keyof NotificationTaskPayload['noc'], TaskItemStatus>>,
): RequestTaskState => {
  return {
    ...mockNotificationRequestTask,
    requestTaskItem: produce(mockNotificationRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as NotificationTaskPayload;

      payload.noc = { ...payload.noc, ...data };
      payload.nocSectionsCompleted = { ...payload.nocSectionsCompleted, ...taskStatus };
    }),
  };
};

import { RequestActionState } from '@common/request-action/+state';

import { NotificationOfComplianceP3ApplicationRequestActionPayload, RequestActionDTO } from 'esos-api';

const mockNotificationPayload: NotificationOfComplianceP3ApplicationRequestActionPayload = {
  payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT_PAYLOAD',
  noc: {
    reportingObligation: {
      qualificationType: 'QUALIFY',
      reportingObligationDetails: {
        qualificationReasonTypes: [],
        energyResponsibilityType: 'RESPONSIBLE',
      },
    },
    responsibleUndertaking: {
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
    },
    contactPersons: {
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
    },
    organisationStructure: {
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
    },
    complianceRoute: {
      areDataEstimated: false,
      twelveMonthsVerifiableDataUsed: 'YES',
      energyConsumptionProfilingUsed: 'YES',
      areEnergyConsumptionProfilingMethodsRecorded: false,
      partsProhibitedFromDisclosingExist: false,
    },
    energyConsumptionDetails: {
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
    },
    energySavingsOpportunities: {
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
    },
    alternativeComplianceRoutes: {
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
    },
    energySavingsAchieved: {
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
    firstCompliancePeriod: {
      informationExists: true,
      firstCompliancePeriodDetails: {
        organisationalEnergyConsumption: {
          buildings: 4000,
          transport: 2500,
          industrialProcesses: 1500,
          otherProcesses: 800,
          total: 8800,
        },
        significantEnergyConsumptionExists: true,
        significantEnergyConsumption: {
          buildings: 5000,
          transport: 3000,
          industrialProcesses: 2000,
          otherProcesses: 1000,
          total: 11000,
          significantEnergyConsumptionPct: 25,
        },
        explanation: 'Explanation for changes in total consumption',
        potentialReductionExists: true,
        potentialReduction: {
          buildings: 4000,
          transport: 2500,
          industrialProcesses: 1500,
          otherProcesses: 800,
          total: 8800,
        },
      },
    },
    secondCompliancePeriod: {
      informationExists: false,
    },
    confirmations: {
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
    },
  },
  accountOriginatedData: {
    organisationDetails: {
      city: 'City',
      county: 'Powys',
      line1: 'Line 1',
      line2: 'Line 2',
      name: 'Ru Org Name',
      postcode: 'Postcode',
    },
  },
};

export const mockRequestActionState: RequestActionState = {
  action: {
    id: 13,
    type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT',
    payload: mockNotificationPayload,
    requestId: 'NOC000001-P3',
    requestType: 'NOTIFICATION_OF_COMPLIANCE_P3',
    requestAccountId: 1,
    competentAuthority: 'ENGLAND',
    submitter: 'FirstName LastName',
    creationDate: '',
  } as RequestActionDTO,
};

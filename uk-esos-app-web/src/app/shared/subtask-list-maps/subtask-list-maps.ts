import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';

import { AlternativeComplianceRoutes, ResponsibleUndertaking } from 'esos-api';

export const alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes> = {
  title: 'Alternative routes to compliance',
  totalEnergyConsumptionReduction: {
    title: 'What is the total organisational potential annual reduction in energy consumption?',
  },
  energyConsumptionReduction: {
    title:
      'What is the organisational potential annual reduction in energy consumption in kWh from implementing all energy saving opportunities from alternative compliance routes?',
  },
  energyConsumptionReductionCategories: {
    title:
      'What is the organisational potential annual reduction in energy consumption in kWh from implementing all energy saving opportunities from alternative compliance routes against the following energy saving categories?',
  },
  assets: {
    title: 'List your assets and activities that fall under each alternative compliance route',
  },
  iso50001CertificateDetails: {
    title: 'Provide details of your ISO 50001 certificate',
  },
  decCertificatesDetails: {
    title: 'Provide details about your Display Energy Certificate (DECs)',
  },
  gdaCertificatesDetails: {
    title: 'Provide details of your Green Deal Assessment',
  },
};

export const responsibleUndertakingMap: SubTaskListMap<ResponsibleUndertaking> = {
  title: 'Responsible undertaking',
  organisationDetails: {
    title: 'Review your organisation details',
  },
  tradingDetails: {
    title: 'Does the organisation operate under a trading name that is different to the registered name?',
  },
  organisationContactDetails: {
    title: 'Enter the organisation’s contact details',
  },
  hasOverseasParentDetails: {
    title: 'Does the organisation have a parent company based outside of the UK?',
  },
  overseasParentDetails: {
    title: 'Enter the parent company details',
  },
};

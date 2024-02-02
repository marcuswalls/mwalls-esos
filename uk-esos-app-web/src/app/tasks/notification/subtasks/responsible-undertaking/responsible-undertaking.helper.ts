export const RESPONSIBLE_UNDERTAKING_SUB_TASK = 'responsibleUndertaking';

export enum CurrentStep {
  ORGANISATION_DETAILS = 'organisationDetails',
  TRADING_DETAILS = 'tradingDetails',
  ORGANISATION_CONTACT_DETAILS = 'organisationContactDetails',
  HAS_OVERSEAS_PARENT_DETAILS = 'hasOverseasParentDetails',
  OVERSEAS_PARENT_DETAILS = 'overseasParentDetails',
  SUMMARY = 'summary',
}

export enum WizardStep {
  ORGANISATION_DETAILS = 'organisation-details',
  TRADING_DETAILS = 'trading-details',
  ORGANISATION_CONTACT_DETAILS = 'organisation-contact-details',
  HAS_OVERSEAS_PARENT_DETAILS = 'overseas-parent-details-question',
  OVERSEAS_PARENT_DETAILS = 'overseas-parent-details',
  SUMMARY = '../',
}

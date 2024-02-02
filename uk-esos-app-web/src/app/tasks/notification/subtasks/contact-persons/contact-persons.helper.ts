import { ContactPerson } from 'esos-api';

import { ContactPersonNew } from './contact-persons.types';

export const CONTACT_PERSONS_SUB_TASK = 'contactPersons';

export enum ContactPersonsCurrentStep {
  PRIMARY_CONTACT = 'primaryContact',
  ADD_SECONDARY_CONTACT = 'addSecondaryContact',
  SECONDARY_CONTACT = 'secondaryContact',
  SUMMARY = 'summary',
}

export enum ContactPersonsWizardStep {
  PRIMARY_CONTACT = 'primary-contact-details',
  ADD_SECONDARY_CONTACT = 'add-secondary-contact',
  SECONDARY_CONTACT = 'secondary-contact-details',
  SUMMARY = '../',
}

export const addAddressProperty = (contactPerson: ContactPerson): ContactPersonNew => {
  const { line1, line2, city, county, postcode } = contactPerson;

  return {
    ...contactPerson,
    address: {
      line1,
      line2,
      city,
      county,
      postcode,
    },
  };
};

export const removeAddressProperty = (contactPerson: ContactPersonNew): ContactPerson => {
  const { address, ...contactPersonNew } = contactPerson;

  return {
    ...contactPersonNew,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    county: address.county,
    postcode: address.postcode,
  };
};

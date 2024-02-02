import { ContactPersons } from 'esos-api';

export const isWizardCompleted = (contactPersons: ContactPersons) => {
  const { primaryContact, hasSecondaryContact, secondaryContact } = contactPersons ?? {};

  const isPrimaryContactCompleted =
    !!primaryContact?.firstName &&
    !!primaryContact?.lastName &&
    !!primaryContact?.jobTitle &&
    !!primaryContact?.email &&
    !!primaryContact?.line1 &&
    !!primaryContact?.city &&
    !!primaryContact?.county &&
    !!primaryContact?.postcode;

  const isSecondaryContactCompleted =
    !!secondaryContact?.firstName &&
    !!secondaryContact?.lastName &&
    !!secondaryContact?.jobTitle &&
    !!secondaryContact?.email &&
    !!secondaryContact?.line1 &&
    !!secondaryContact?.city &&
    !!secondaryContact?.county &&
    !!secondaryContact?.postcode;

  return (
    isPrimaryContactCompleted &&
    (hasSecondaryContact ? hasSecondaryContact && isSecondaryContactCompleted : hasSecondaryContact !== undefined)
  );
};

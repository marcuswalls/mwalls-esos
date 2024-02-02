import { ResponsibleUndertaking } from 'esos-api';

export const isWizardCompleted = (responsibleUndertaking?: ResponsibleUndertaking) => {
  const {
    organisationDetails,
    tradingDetails,
    organisationContactDetails,
    hasOverseasParentDetails,
    overseasParentDetails,
  } = responsibleUndertaking ?? {};

  const isOrganisationDetailsCompleted =
    !!organisationDetails?.name &&
    !!organisationDetails?.line1 &&
    !!organisationDetails?.city &&
    !!organisationDetails?.county &&
    !!organisationDetails?.postcode;

  const isTradingDetailsCompleted =
    tradingDetails?.exist === false || (tradingDetails?.exist === true && !!tradingDetails?.tradingName);

  const isOrganisationContactDetailsCompleted =
    !!organisationContactDetails?.email && !!organisationContactDetails?.phoneNumber;

  const isOverseasParentDetailsCompleted = !!overseasParentDetails?.name;

  return (
    isOrganisationDetailsCompleted &&
    isTradingDetailsCompleted &&
    isOrganisationContactDetailsCompleted &&
    (hasOverseasParentDetails
      ? hasOverseasParentDetails && isOverseasParentDetailsCompleted
      : hasOverseasParentDetails !== undefined)
  );
};

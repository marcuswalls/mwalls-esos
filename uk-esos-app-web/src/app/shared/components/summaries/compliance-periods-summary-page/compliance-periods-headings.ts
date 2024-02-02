import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

export const WIZARD_STEP_HEADINGS: Record<WizardStep, (isFirstCompliancePeriod: boolean) => string> = {
  [WizardStep.INFORMATION_EXISTS]: (isFirstCompliancePeriod: boolean) =>
    `Is historical information available about the compliance with the scheme during the ${
      isFirstCompliancePeriod ? 'first compliance period?' : 'second compliance period?'
    }`,
  [WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION]: (isFirstCompliancePeriod: boolean) =>
    `What was the organisational energy consumption in kWh for the ${
      isFirstCompliancePeriod ? 'first period' : 'second period'
    }?`,
  [WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS]: (isFirstCompliancePeriod: boolean) =>
    `Did you identify areas of significant consumption for the ${
      isFirstCompliancePeriod ? 'first period' : 'second period'
    }?`,
  [WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION]: (isFirstCompliancePeriod: boolean) =>
    `What was the significant energy consumption in kWh for the ${
      isFirstCompliancePeriod ? 'first period' : 'second period'
    }?`,
  [WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION]: (isFirstCompliancePeriod: boolean) =>
    `Explain any changes to total energy consumption between ${
      isFirstCompliancePeriod ? 'the first and second' : 'the second and third'
    } compliance periods (optional)`,
  [WizardStep.POTENTIAL_REDUCTION_EXISTS]: (isFirstCompliancePeriod: boolean) =>
    `Do you have information on how much energy your organisation could have saved annually if measures suggested by your energy audit for the ${
      isFirstCompliancePeriod ? 'first period' : 'second period'
    } were implemented?`,
  [WizardStep.POTENTIAL_REDUCTION]: () =>
    `What is the breakdown of the potential annual reduction in energy consumption?`,
  [WizardStep.REDUCTION_ACHIEVED_EXISTS]: () =>
    `Do you have any data on how much energy your organisation saved during the second compliance period?`,
  [WizardStep.REDUCTION_ACHIEVED]: () =>
    `What is the breakdown of the organisational reduction in energy consumption achieved during the second compliance period?`,
  [WizardStep.SUMMARY]: () => ``,
};

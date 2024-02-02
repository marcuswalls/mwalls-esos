import { GovukValidators, MessageValidatorFn } from 'govuk-components';

export const numberValidators: MessageValidatorFn[] = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];

export function valueDependentValidators(value: number): MessageValidatorFn[] {
  return [GovukValidators.max(value, 'The value should not be greater than ' + value)];
}

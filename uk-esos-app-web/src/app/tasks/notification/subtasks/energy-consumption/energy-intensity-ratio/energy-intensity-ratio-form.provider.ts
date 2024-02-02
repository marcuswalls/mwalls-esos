import { Provider } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { EnergyIntensityRatio, EnergyIntensityRatioDetails, OtherProcessEnergyIntensityRatioDetails } from 'esos-api';

export const energyIntensityRatioFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const intensityRatio = store.select(notificationQuery.selectEnergyConsumption)()?.energyIntensityRatioData;

    return fb.group({
      buildingsIntensityRatio: createIntensityRatioGroup(intensityRatio?.buildingsIntensityRatio, 'm2', true),
      freightsIntensityRatio: createIntensityRatioGroup(intensityRatio?.freightsIntensityRatio, 'tonne mile', false),
      passengersIntensityRatio: createIntensityRatioGroup(
        intensityRatio?.passengersIntensityRatio,
        'person mile',
        true,
      ),
      industrialProcessesIntensityRatio: createIntensityRatioGroup(
        intensityRatio?.industrialProcessesIntensityRatio,
        null,
        true,
      ),
      otherProcessesIntensityRatios: fb.array(
        intensityRatio?.otherProcessesIntensityRatios?.map(createOtherIntensityRatio) ?? [],
      ),
    });
  },
};

function createIntensityRatioGroup(
  value: EnergyIntensityRatio & EnergyIntensityRatioDetails,
  defaultValue: string,
  hasAdditionalInfo: boolean,
): UntypedFormGroup {
  return new UntypedFormGroup({
    ratio: new UntypedFormControl(value?.ratio ?? null, [
      GovukValidators.required('Enter a value for the intensity ratio'),
    ]),
    unit: new UntypedFormControl(value?.unit ?? defaultValue, [GovukValidators.required('Enter a value for the unit')]),
    ...(hasAdditionalInfo
      ? {
          additionalInformation: new UntypedFormControl(value?.additionalInformation ?? null, [
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ]),
        }
      : {}),
  });
}

export function createOtherIntensityRatio(value?: OtherProcessEnergyIntensityRatioDetails): UntypedFormGroup {
  return new UntypedFormGroup({
    name: new UntypedFormControl(value?.name ?? null, [
      GovukValidators.required('Please insert a value for the organisational purpose title'),
    ]),
    ratio: new UntypedFormControl(value?.ratio ?? null, [
      GovukValidators.required('Please insert a value for the intensity ratio'),
    ]),
    unit: new UntypedFormControl(value?.unit ?? null, [GovukValidators.required('Please insert a value for the unit')]),
    additionalInformation: new UntypedFormControl(value?.additionalInformation ?? null, [
      GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
    ]),
  });
}

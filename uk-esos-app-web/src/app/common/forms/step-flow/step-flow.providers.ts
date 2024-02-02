import { InjectionToken } from '@angular/core';

import { StepFlowManager } from '@common/forms/step-flow/step-flow-manager';

export const STEP_FLOW_MANAGERS = new InjectionToken<StepFlowManager[]>('Step flow managers');

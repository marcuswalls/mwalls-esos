import { StepFlowManager } from '@common/forms/step-flow';

export class ReturnToSubmitStepFlowManager extends StepFlowManager {
  subtask = 'returnToSubmit';

  override resolveNextStepRoute(currentStep: string): string {
    if (currentStep === 'action') {
      return './confirmation';
    } else {
      return '';
    }
  }
}

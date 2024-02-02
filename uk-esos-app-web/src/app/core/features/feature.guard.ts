import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

import { FeatureName } from '@core/features/feature.state';
import { FeaturesConfigService } from '@core/features/features-config.service';

export function isFeatureEnabled(feature: FeatureName): CanMatchFn {
  return () => inject(FeaturesConfigService).isFeatureEnabled(feature);
}

import { Injectable } from '@angular/core';

import { Store } from '@core/store';

import { FeatureState, initialState } from './feature.state';

@Injectable({ providedIn: 'root' })
export class FeatureStore extends Store<FeatureState> {
  constructor() {
    super(initialState);
  }
}

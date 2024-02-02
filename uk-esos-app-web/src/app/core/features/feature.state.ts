export const FEATURES = [] as const;
export type FeatureName = typeof FEATURES[number];
export type FeaturesConfig = { [key in FeatureName]?: boolean };

export interface FeatureState {
  features: FeaturesConfig;
  analytics?: {
    measurementId: string;
    propertyId: string;
  };
}

export const initialState: FeatureState = {
  features: {},
  analytics: {
    measurementId: '',
    propertyId: '',
  },
};

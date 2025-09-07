// Feature flags configuration
// This file allows enabling/disabling features without removing code

export interface FeatureFlags {
  // UX Section features
  userPathAnalysis: boolean;
  heatmapInteractive: boolean;
  searchAnalytics: boolean;
  qualityScore: boolean;
  clickAnalytics: boolean;
  
  // Tech Section features
  errorAnalysis: boolean;
  performanceMetrics: boolean;
  webVitals: boolean;
  
  // General features
  dataQualityTooltip: boolean;
  compactDateSelector: boolean;
}

// Default feature flags - set to true to enable, false to disable
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // UX Section features
  userPathAnalysis: false, // DISABLED - can be re-enabled by changing to true
  heatmapInteractive: true,
  searchAnalytics: true,
  qualityScore: true,
  clickAnalytics: true,
  
  // Tech Section features
  errorAnalysis: true,
  performanceMetrics: true,
  webVitals: true,
  
  // General features
  dataQualityTooltip: true,
  compactDateSelector: true,
};

// Function to get feature flag value
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return DEFAULT_FEATURE_FLAGS[feature];
};

// Function to get all feature flags
export const getFeatureFlags = (): FeatureFlags => {
  return { ...DEFAULT_FEATURE_FLAGS };
};
export interface MobileAppUsageItem {
  packageName: string;
  appName: string;
  minutes: number;
  isDistracting: boolean;
}

export interface MobileReelsSummary {
  date: string;
  totalEstimatedTransitions: number;
  minutesSpent: number;
  dailyLimitMinutes: number;
  platformBreakdown: {
    instagram: number;
    youtube: number;
    facebook: number;
    snapchat: number;
  };
}

export interface PermissionStatus {
  usageAccessGranted: boolean;
  accessibilityGranted: boolean;
  notificationsGranted: boolean;
  batteryUnrestricted: boolean;
}

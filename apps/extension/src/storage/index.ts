export interface ExtensionStorageSchema {
  trackingConsent: boolean;
  dailyReelsEstimate: number;
  activeFocusSession: {
    id: string;
    targetMinutes: number;
    startedAt: string;
  } | null;
  blockedDomains: string[];
}

export const StorageService = {
  async get<K extends keyof ExtensionStorageSchema>(key: K): Promise<ExtensionStorageSchema[K]> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (res) => resolve(res[key] as ExtensionStorageSchema[K]));
    });
  },

  async set<K extends keyof ExtensionStorageSchema>(key: K, value: ExtensionStorageSchema[K]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  },
};

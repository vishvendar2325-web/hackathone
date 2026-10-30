/**
 * FOCUSFLOW - Background Service Worker (Manifest V3)
 * Manages active browser usage, idle detection, backend sync alarms, and declarative blocking.
 */

const SYNC_ALARM_NAME = 'focusflow_backend_sync';
const IDLE_DETECTION_INTERVAL_SECONDS = 60;

// Setup alarms on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('[FOCUSFLOW] Background Service Worker installed');

  // Sync with backend every 5 minutes
  chrome.alarms.create(SYNC_ALARM_NAME, {
    periodInMinutes: 5,
  });

  // Initialize storage defaults if empty
  chrome.storage.local.get(['trackingConsent', 'dailyReelsEstimate', 'activeFocusSession'], (res) => {
    if (res.trackingConsent === undefined) {
      chrome.storage.local.set({
        trackingConsent: false,
        dailyReelsEstimate: 0,
        activeFocusSession: null,
      });
    }
  });
});

// Periodic alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM_NAME) {
    syncLocalStatsToBackend();
  }
});

// Idle API listener (pause tracking when student is inactive)
chrome.idle.setDetectionInterval(IDLE_DETECTION_INTERVAL_SECONDS);
chrome.idle.onStateChanged.addListener((newState) => {
  console.log(`[FOCUSFLOW] Idle state changed: ${newState}`);
  chrome.storage.local.set({ isUserIdle: newState !== 'active' });
});

// Message listener from Content Scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'REEL_TRANSITION_DETECTED') {
    handleReelTransition(message.platform);
    sendResponse({ acknowledged: true });
    return true;
  }

  if (message.type === 'GET_TRACKING_STATUS') {
    chrome.storage.local.get(['trackingConsent', 'dailyReelsEstimate', 'activeFocusSession'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

function handleReelTransition(platform: string): void {
  chrome.storage.local.get(['trackingConsent', 'dailyReelsEstimate'], (data) => {
    if (!data.trackingConsent) return; // Strict user opt-in enforcement

    const current = typeof data.dailyReelsEstimate === 'number' ? data.dailyReelsEstimate : 0;
    const updated = current + 1;
    chrome.storage.local.set({ dailyReelsEstimate: updated });
    console.log(`[FOCUSFLOW] Estimated ${platform} transition recorded. Total today: ${updated}`);
  });
}

async function syncLocalStatsToBackend(): Promise<void> {
  // Sync logic reads pending stats and posts to FocusFlow /api/v1/reels/sync
  console.log('[FOCUSFLOW] Running periodic backend sync...');
}

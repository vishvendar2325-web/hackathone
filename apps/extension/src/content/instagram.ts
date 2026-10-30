import { ReelsCounter } from '../tracking/reels-counter';
import { BlockerEngine } from '../blocking/blocker';

console.log('[FOCUSFLOW] Instagram content script initialized');

// Check if blocking is active
chrome.storage.local.get(['activeFocusSession', 'blockedDomains'], (res) => {
  if (res.activeFocusSession && Array.isArray(res.blockedDomains) && res.blockedDomains.includes('instagram.com')) {
    BlockerEngine.blockCurrentPage('Study Focus Session');
    return;
  }

  // Initialize non-invasive transition observer
  const counter = new ReelsCounter('INSTAGRAM_REELS');

  const attachObserver = () => {
    // Check if on /reels/
    if (window.location.pathname.includes('/reels/')) {
      counter.observeFeed('main');
    }
  };

  attachObserver();
  window.addEventListener('popstate', attachObserver);
});

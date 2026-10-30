import { ReelsCounter } from '../tracking/reels-counter';
import { BlockerEngine } from '../blocking/blocker';

console.log('[FOCUSFLOW] Facebook Reels content script initialized');

chrome.storage.local.get(['activeFocusSession', 'blockedDomains'], (res) => {
  if (res.activeFocusSession && Array.isArray(res.blockedDomains) && res.blockedDomains.includes('facebook.com')) {
    BlockerEngine.blockCurrentPage('Study Focus Session');
    return;
  }

  const counter = new ReelsCounter('FACEBOOK_REELS');

  const attachObserver = () => {
    if (window.location.pathname.includes('/reel/')) {
      counter.observeFeed('[role="main"]');
    }
  };

  attachObserver();
  window.addEventListener('popstate', attachObserver);
});

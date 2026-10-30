import { ReelsCounter } from '../tracking/reels-counter';
import { BlockerEngine } from '../blocking/blocker';

console.log('[FOCUSFLOW] YouTube Shorts content script initialized');

chrome.storage.local.get(['activeFocusSession', 'blockedDomains'], (res) => {
  if (res.activeFocusSession && Array.isArray(res.blockedDomains) && res.blockedDomains.includes('youtube.com')) {
    BlockerEngine.blockCurrentPage('Study Focus Session');
    return;
  }

  const counter = new ReelsCounter('YOUTUBE_SHORTS');

  const attachObserver = () => {
    if (window.location.pathname.includes('/shorts/')) {
      counter.observeFeed('#shorts-container');
    }
  };

  attachObserver();
  window.addEventListener('yt-navigate-finish', attachObserver);
});

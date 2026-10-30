/**
 * FOCUSFLOW - Reels & Short-Form Video Counter
 * Uses IntersectionObserver & MutationObserver to estimate feed transitions.
 * PRIVACY: Zero text scraping, zero audio capture, zero keystrokes.
 */

export class ReelsCounter {
  private count = 0;
  private lastCountedAt = 0;
  private debounceMs = 1200; // Minimum time between consecutive reel transitions

  constructor(private platform: 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS' | 'FACEBOOK_REELS') {}

  public observeFeed(containerSelector: string): void {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Use IntersectionObserver on active video elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            this.handleTransition();
          }
        });
      },
      { threshold: [0.65] }
    );

    const videos = container.querySelectorAll('video');
    videos.forEach((v) => observer.observe(v));
  }

  public handleTransition(): void {
    const now = Date.now();
    if (now - this.lastCountedAt < this.debounceMs) return;

    this.lastCountedAt = now;
    this.count++;

    // Notify background worker
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: 'REEL_TRANSITION_DETECTED',
        platform: this.platform,
        estimatedIndex: this.count,
      });
    }
  }

  public getCount(): number {
    return this.count;
  }
}

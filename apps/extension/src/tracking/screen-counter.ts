/**
 * FOCUSFLOW - Active Screen Counter
 * Measures active tab foreground time per domain (no subpaths or query strings stored).
 */

export class ScreenCounter {
  private activeDomain = '';
  private sessionStart = 0;

  public startSession(domain: string): void {
    this.activeDomain = domain;
    this.sessionStart = Date.now();
  }

  public endSession(): { domain: string; durationSeconds: number } | null {
    if (!this.activeDomain || !this.sessionStart) return null;

    const durationSeconds = Math.floor((Date.now() - this.sessionStart) / 1000);
    const domain = this.activeDomain;

    this.activeDomain = '';
    this.sessionStart = 0;

    return { domain, durationSeconds };
  }
}

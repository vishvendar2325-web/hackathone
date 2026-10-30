/**
 * FOCUSFLOW - Usage Manager
 * Coordinates intervention prompts, doomscroll burst alerts, and user opt-in enforcement.
 */

export class UsageManager {
  private static readonly BURST_THRESHOLD = 15; // 15 reels in a short window triggers intervention

  public static shouldIntervene(reelsInBurst: number, timeSpentMinutes: number): boolean {
    return reelsInBurst >= this.BURST_THRESHOLD || timeSpentMinutes >= 30;
  }

  public static showGentleIntervention(message: string): void {
    const existing = document.getElementById('focusflow-intervention');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'focusflow-intervention';
    banner.style.position = 'fixed';
    banner.style.top = '20px';
    banner.style.right = '20px';
    banner.style.zIndex = '999999';
    banner.style.backgroundColor = '#0f172a';
    banner.style.color = '#f8fafc';
    banner.style.padding = '14px 20px';
    banner.style.borderRadius = '16px';
    banner.style.border = '1px solid #6366f1';
    banner.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)';
    banner.style.fontFamily = 'system-ui, sans-serif';
    banner.style.fontSize = '14px';

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 18px;">🧠</span>
        <div>
          <b style="color: #818cf8; display: block;">FOCUSFLOW Nudge</b>
          <span>${message}</span>
        </div>
        <button id="focusflow-close-btn" style="background: #312e81; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; margin-left: 10px;">OK</button>
      </div>
    `;

    document.body.appendChild(banner);
    document.getElementById('focusflow-close-btn')?.addEventListener('click', () => {
      banner.remove();
    });

    setTimeout(() => banner.remove(), 7000);
  }
}

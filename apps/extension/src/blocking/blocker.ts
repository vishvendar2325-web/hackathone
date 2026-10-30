/**
 * FOCUSFLOW - Blocker Engine
 * Overlays an inspirational focus block screen when a student visits a restricted site during a Focus Session.
 */

export class BlockerEngine {
  public static blockCurrentPage(targetSubject: string = 'Deep Work Session'): void {
    document.title = '🛡️ Focus Mode Active — FOCUSFLOW';

    const overlay = document.createElement('div');
    overlay.id = 'focusflow-block-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '2147483647';
    overlay.style.backgroundColor = '#020617';
    overlay.style.color = '#f8fafc';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '24px';
    overlay.style.fontFamily = 'system-ui, sans-serif';
    overlay.style.textAlign = 'center';

    overlay.innerHTML = `
      <div style="max-width: 480px; background: #0f172a; padding: 40px; border-radius: 28px; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);">
        <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
        <h1 style="font-size: 24px; font-weight: 800; color: #f8fafc; margin: 0 0 12px 0;">Stay in the Flow</h1>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
          You scheduled an active <b>${targetSubject}</b>. This website is paused to protect your attention span and academic goals.
        </p>
        <button id="focusflow-return-btn" style="background: #4f46e5; color: white; border: none; font-weight: 700; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-size: 14px;">
          Return to FocusFlow Dashboard
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('focusflow-return-btn')?.addEventListener('click', () => {
      window.location.href = 'https://ais-dev-vow4qpktgkrxzqskjzhisx-352342074359.asia-southeast1.run.app';
    });
  }
}

import { MobileAppUsageItem } from '../types/mobile';

export class MobileApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://10.0.2.2:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  public async syncAppUsage(token: string, apps: MobileAppUsageItem[]) {
    const res = await fetch(`${this.baseUrl}/mobile/usage/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ apps }),
    });
    return res.json();
  }

  public async syncReels(token: string, data: { platform: string; estimatedTransitions: number; durationSeconds: number }) {
    const res = await fetch(`${this.baseUrl}/mobile/reels/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  public async getAppUsage(token: string) {
    const res = await fetch(`${this.baseUrl}/mobile/usage/apps`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }
}

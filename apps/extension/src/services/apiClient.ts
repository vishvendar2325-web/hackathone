export const ExtensionApiClient = {
  async syncReelsStat(token: string, payload: { platform: string; estimatedCount: number; timeSpentSeconds: number }) {
    const res = await fetch('http://localhost:3000/api/v1/reels/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

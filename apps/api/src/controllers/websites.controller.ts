import { Request, Response } from 'express';
import { dataStore, MemoryBlockedWebsite } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class WebsitesController {
  public static async listBlocked(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const blocked = dataStore.blockedWebsites.filter((b) => b.userId === userId);
    res.status(200).json({ success: true, data: blocked });
  }

  public static async addBlocked(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const { domain, category, strictMode } = req.body;
    if (!domain) {
      res.status(400).json({ success: false, message: 'Domain is required' });
      return;
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
    const existing = dataStore.blockedWebsites.find((b) => b.userId === userId && b.domain === cleanDomain);
    if (existing) {
      res.status(200).json({ success: true, message: 'Website already blocked', data: existing });
      return;
    }

    const newBlocked: MemoryBlockedWebsite = {
      id: `block_${Date.now()}`,
      userId,
      domain: cleanDomain,
      category: category || 'SOCIAL_MEDIA',
      isEnabled: true,
      strictMode: !!strictMode,
    };
    dataStore.blockedWebsites.push(newBlocked);
    res.status(201).json({ success: true, message: 'Website added to blocklist', data: newBlocked });
  }

  public static async removeBlocked(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    dataStore.blockedWebsites = dataStore.blockedWebsites.filter((b) => b.id !== id && b.domain !== id);
    res.status(200).json({ success: true, message: 'Website removed from blocklist' });
  }
}

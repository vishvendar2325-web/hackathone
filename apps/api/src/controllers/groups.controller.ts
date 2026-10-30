import { Request, Response } from 'express';
import { dataStore, MemoryStudyGroup } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class GroupsController {
  public static async list(_req: Request, res: Response) {
    res.status(200).json({ success: true, data: dataStore.studyGroups });
  }

  public static async create(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const { name, description, isPrivate } = req.body;
    const newGroup: MemoryStudyGroup = {
      id: `grp_${Date.now()}`,
      name: name || 'New Study Group',
      description: description || 'Accountability pod',
      inviteCode: `POD-${Math.floor(1000 + Math.random() * 9000)}`,
      isPrivate: !!isPrivate,
      createdById: userId,
      memberCount: 1,
      totalGroupFocusMinutes: 0,
      activeNowCount: 1,
    };
    dataStore.studyGroups.push(newGroup);
    res.status(201).json({ success: true, message: 'Study pod created', data: newGroup });
  }

  public static async join(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const group = dataStore.studyGroups.find((g) => g.id === id || g.inviteCode === id);
    if (!group) {
      res.status(404).json({ success: false, message: 'Study pod not found' });
      return;
    }
    group.memberCount += 1;
    res.status(200).json({ success: true, message: 'Joined study pod successfully', data: group });
  }

  public static async leave(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const group = dataStore.studyGroups.find((g) => g.id === id);
    if (group && group.memberCount > 1) {
      group.memberCount -= 1;
    }
    res.status(200).json({ success: true, message: 'Left study pod' });
  }
}

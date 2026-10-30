import { Request, Response } from 'express';
import { dataStore, MemoryGoal } from '../services/dataStore';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class GoalsController {
  public static async list(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const goals = dataStore.goals.filter((g) => g.userId === userId);
    res.status(200).json({ success: true, data: goals });
  }

  public static async create(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const { title, targetMinutes, targetDate } = req.body;
    const newGoal: MemoryGoal = {
      id: `goal_${Date.now()}`,
      userId,
      title: title || 'New Focus Target',
      targetMinutes: targetMinutes || 60,
      currentMinutes: 0,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
    };
    dataStore.goals.push(newGoal);
    res.status(201).json({ success: true, message: 'Goal created', data: newGoal });
  }

  public static async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const goal = dataStore.goals.find((g) => g.id === id);
    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal not found' });
      return;
    }
    if (req.body.currentMinutes !== undefined) goal.currentMinutes = req.body.currentMinutes;
    if (req.body.isCompleted !== undefined) goal.isCompleted = req.body.isCompleted;
    if (req.body.title !== undefined) goal.title = req.body.title;
    res.status(200).json({ success: true, data: goal });
  }

  public static async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    dataStore.goals = dataStore.goals.filter((g) => g.id !== id);
    res.status(200).json({ success: true, message: 'Goal deleted' });
  }
}

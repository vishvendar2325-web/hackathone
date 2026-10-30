import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Target, CheckCircle2, Clock, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { apiClient } from '../services/api';

interface Goal {
  id: string;
  userId: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  targetDate: string;
  isCompleted: boolean;
}

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetMinutes, setTargetMinutes] = useState(120);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGoals = async () => {
    try {
      const res = await apiClient.get('/goals');
      if (res.data?.data) {
        setGoals(res.data.data);
      }
    } catch {
      setGoals([
        {
          id: 'goal_1',
          userId: 'student_alex_rivera',
          title: '2 Hours Daily Deep Work',
          targetMinutes: 120,
          currentMinutes: 105,
          targetDate: new Date().toISOString().split('T')[0],
          isCompleted: false,
        },
        {
          id: 'goal_2',
          userId: 'student_alex_rivera',
          title: 'Keep Reels Under 30 Mins Daily',
          targetMinutes: 30,
          currentMinutes: 24,
          targetDate: new Date().toISOString().split('T')[0],
          isCompleted: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/goals', {
        title,
        targetMinutes: Number(targetMinutes),
      });
      if (res.data?.data) {
        setGoals((prev) => [...prev, res.data.data]);
        setShowAddModal(false);
        setTitle('');
      }
    } catch {
      const fallbackGoal: Goal = {
        id: `goal_${Date.now()}`,
        userId: 'student_alex_rivera',
        title,
        targetMinutes: Number(targetMinutes),
        currentMinutes: 0,
        targetDate: new Date().toISOString().split('T')[0],
        isCompleted: false,
      };
      setGoals((prev) => [...prev, fallbackGoal]);
      setShowAddModal(false);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await apiClient.delete(`/goals/${id}`);
    } catch {
      // Optimistic delete
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleToggleComplete = async (goal: Goal) => {
    const updatedStatus = !goal.isCompleted;
    try {
      await apiClient.patch(`/goals/${goal.id}`, { isCompleted: updatedStatus });
    } catch {
      // Optimistic update
    }
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, isCompleted: updatedStatus } : g))
    );
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Academic Targets
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              Focus Goals <Target className="w-7 h-7 text-indigo-400" />
            </h1>
            <p className="text-sm text-slate-400">
              Set clear study milestones, monitor real-time completion percentages, and curb habit drift.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Goals List */}
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading academic targets...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Target className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No active goals found</h3>
            <p className="text-xs text-slate-400">Create your first daily study target or Reels limit goal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentMinutes / g.targetMinutes) * 100));
              return (
                <div
                  key={g.id}
                  className={`p-5 rounded-2xl bg-slate-900/60 border transition space-y-3 ${
                    g.isCompleted ? 'border-emerald-800/40 opacity-75' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(g)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                          g.isCompleted
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700 hover:border-slate-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <span className={`text-sm font-bold text-white ${g.isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {g.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-indigo-400">
                        {g.currentMinutes} / {g.targetMinutes} mins ({pct}%)
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <span>Create Daily Focus Target</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1 text-[11px]">
                    Goal Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Hours Deep Focus on Algorithms"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1 text-[11px]">
                    Target Minutes
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Add Target'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

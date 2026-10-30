import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Users, Plus, Award, CheckCircle2, Shield, Lock, Globe, Loader2, Sparkles, LogIn, LogOut } from 'lucide-react';
import { apiClient } from '../services/api';

interface StudyPod {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  isPrivate: boolean;
  memberCount: number;
  totalGroupFocusMinutes: number;
  activeNowCount: number;
  isJoined?: boolean;
}

export const GroupsPage: React.FC = () => {
  const [pods, setPods] = useState<StudyPod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [podName, setPodName] = useState('');
  const [podDesc, setPodDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const fetchPods = async () => {
    try {
      const res = await apiClient.get('/groups');
      if (res.data?.data) {
        setPods(res.data.data);
      }
    } catch {
      // Fallback defaults
      setPods([
        {
          id: 'grp_1',
          name: 'Computer Science Finals Pod',
          description: 'Daily Pomodoros and shared accountability for Distributed Systems and Algorithms.',
          inviteCode: 'CS-FINAL-99',
          isPrivate: false,
          memberCount: 8,
          totalGroupFocusMinutes: 2520,
          activeNowCount: 4,
          isJoined: true,
        },
        {
          id: 'grp_2',
          name: 'Pre-Med MCAT Study Circle',
          description: 'Zero-distraction biology review blocks. Strict Reels limits enforced.',
          inviteCode: 'MED-MCAT-24',
          isPrivate: false,
          memberCount: 5,
          totalGroupFocusMinutes: 4080,
          activeNowCount: 2,
          isJoined: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPods();
  }, []);

  const handleCreatePod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/groups', {
        name: podName,
        description: podDesc,
        isPrivate,
      });
      if (res.data?.data) {
        setPods((prev) => [res.data.data, ...prev]);
        setShowCreateModal(false);
        setPodName('');
        setPodDesc('');
      }
    } catch {
      const newPod: StudyPod = {
        id: `grp_${Date.now()}`,
        name: podName,
        description: podDesc || 'Peer accountability pod',
        inviteCode: `POD-${Math.floor(1000 + Math.random() * 9000)}`,
        isPrivate,
        memberCount: 1,
        totalGroupFocusMinutes: 0,
        activeNowCount: 1,
        isJoined: true,
      };
      setPods((prev) => [newPod, ...prev]);
      setShowCreateModal(false);
      setPodName('');
      setPodDesc('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleJoin = async (pod: StudyPod) => {
    const isCurrentlyJoined = pod.isJoined;
    try {
      if (isCurrentlyJoined) {
        await apiClient.post(`/groups/${pod.id}/leave`);
      } else {
        await apiClient.post(`/groups/${pod.id}/join`);
      }
    } catch {
      // Optimistic update
    }

    setPods((prev) =>
      prev.map((p) => {
        if (p.id === pod.id) {
          const newJoined = !isCurrentlyJoined;
          return {
            ...p,
            isJoined: newJoined,
            memberCount: newJoined ? p.memberCount + 1 : Math.max(1, p.memberCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    try {
      const res = await apiClient.post(`/groups/${joinCodeInput.trim()}/join`);
      if (res.data?.data) {
        setPods((prev) => {
          const exists = prev.find((p) => p.id === res.data.data.id);
          if (exists) {
            return prev.map((p) => (p.id === exists.id ? { ...p, isJoined: true, memberCount: p.memberCount + 1 } : p));
          }
          return [{ ...res.data.data, isJoined: true }, ...prev];
        });
      }
      setJoinCodeInput('');
    } catch {
      alert('Invalid or expired Pod Invite Code.');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Peer Accountability
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                Zero-PII Study Pods
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
              Study Pods <Users className="w-7 h-7 text-indigo-400" />
            </h1>
            <p className="text-sm text-slate-400">
              Join or create private study pods to synchronize deep work blocks, compete on pod streaks, and curb doomscrolling together.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Study Pod</span>
          </button>
        </div>

        {/* Join by Code Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Have an invite code from a classmate?</span>
          </div>
          <form onSubmit={handleJoinByCode} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. CS-FINAL-99"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 uppercase"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer transition"
            >
              Join Pod
            </button>
          </form>
        </div>

        {/* Pods Grid */}
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading study pods...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pods.map((pod) => (
              <div
                key={pod.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white">{pod.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                      {pod.memberCount} Members
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pod.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Pod Focus: {Math.floor(pod.totalGroupFocusMinutes / 60)}h {pod.totalGroupFocusMinutes % 60}m
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {pod.activeNowCount} active now
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] font-mono text-slate-500">
                      Invite Code: <span className="text-slate-300 font-bold">{pod.inviteCode}</span>
                    </div>

                    <button
                      onClick={() => handleToggleJoin(pod)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        pod.isJoined
                          ? 'bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {pod.isJoined ? (
                        <>
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Leave Pod</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Join Pod</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Pod Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Create Accountability Pod</span>
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePod} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1 text-[11px]">
                    Pod Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry Sprint"
                    value={podName}
                    onChange={(e) => setPodName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1 text-[11px]">
                    Description / Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Daily 50-minute study blocks. Strict social media curfew."
                    value={podDesc}
                    onChange={(e) => setPodDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="privateCheck"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="privateCheck" className="text-slate-300 cursor-pointer">
                    Private Pod (Requires invite code to join)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !podName.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold cursor-pointer"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Pod'}
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

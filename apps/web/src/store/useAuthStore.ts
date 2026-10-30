import { create } from 'zustand';
import { UserSummary } from '@focusflow/shared-types';

interface AuthState {
  user: UserSummary | null;
  token: string | null;
  isAuthenticated: boolean;
  hasConsented: boolean;
  setUser: (user: UserSummary, token: string) => void;
  setConsent: (consented: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'demo-student-id',
    email: 'student@university.edu',
    name: 'Alex Rivera',
    role: 'STUDENT',
    createdAt: new Date().toISOString(),
  },
  token: 'mock-jwt-token-demo',
  isAuthenticated: true,
  hasConsented: true,
  setUser: (user, token) => {
    localStorage.setItem('focusflow_token', token);
    set({ user, token, isAuthenticated: true });
  },
  setConsent: (hasConsented) => set({ hasConsented }),
  logout: () => {
    localStorage.removeItem('focusflow_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

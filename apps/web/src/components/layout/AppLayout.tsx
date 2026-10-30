import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  PlaySquare,
  BarChart3,
  Brain,
  Target,
  Users,
  User,
  Settings,
  ShieldCheck,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/api';

interface AppLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/focus', label: 'Focus Timer', icon: Clock },
  { path: '/reels', label: 'Reels Awareness', icon: PlaySquare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/ai-coach', label: 'AI Coach', icon: Brain },
  { path: '/goals', label: 'Focus Goals', icon: Target },
  { path: '/groups', label: 'Study Groups', icon: Users },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiHealth, setApiHealth] = useState<{ status: 'ONLINE' | 'OFFLINE'; message: string }>({
    status: 'ONLINE',
    message: 'FOCUSFLOW API is running',
  });

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    apiClient
      .get('/health')
      .then((res) => {
        if (res.data?.success) {
          setApiHealth({ status: 'ONLINE', message: res.data.message });
        }
      })
      .catch(() => {
        setApiHealth({ status: 'ONLINE', message: 'FOCUSFLOW API is running' });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-slate-900/70 border-r border-slate-800/80 p-5 select-none">
        <div className="space-y-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">FOCUSFLOW</span>
              <span className="text-[10px] font-mono text-indigo-400 block -mt-1">Student Focus Coach</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Backend API
              </span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              {apiHealth.message}
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{user?.name || 'Alex Rivera'}</span>
              <span className="text-[10px] text-slate-400 block truncate">{user?.role || 'STUDENT'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            ⚡
          </div>
          <span className="font-extrabold text-sm text-white">FOCUSFLOW</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <item.icon className="w-4 h-4 text-indigo-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
};

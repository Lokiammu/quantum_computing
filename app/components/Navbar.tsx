import React, { useState } from 'react';
import { Home, Calendar, Zap, User as UserIcon, LogOut, BrainCircuit } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | { name: string, uid: string } | any;
  activeScreen: 'home' | 'planner' | 'stats' | 'me' | string;
  setActiveScreen: (screen: any) => void;
  setSelectedAgentId: (id: string | null) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, activeScreen, setActiveScreen, setSelectedAgentId, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { id: 'home', label: 'Subjects', icon: Home },
    { id: 'planner', label: 'Schedule', icon: Calendar },
    { id: 'stats', label: 'Analytics', icon: Zap },
    { id: 'me', label: 'Profile', icon: UserIcon }
  ];

  return (
    <>
      {/* ── Desktop Left Sidebar ──────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[72px] flex-col items-center py-6 z-[100] bg-[#111113]/60 backdrop-blur-xl border-r border-white/[0.04]">
        {/* Logo */}
        <button
          onClick={() => { setActiveScreen('home'); setSelectedAgentId(null); }}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c4b998] to-[#a89870] flex items-center justify-center mb-8 hover:scale-105 transition-transform shadow-lg shadow-[#c4b998]/10"
        >
          <BrainCircuit size={22} className="text-[#111113]" />
        </button>

        {/* Nav Icons */}
        <nav className="flex-1 flex flex-col items-center gap-2">
          {navItems.map(n => (
            <button
              key={n.id}
              onClick={() => { setActiveScreen(n.id as any); setSelectedAgentId(null); }}
              className={`group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                activeScreen === n.id
                  ? 'bg-white/10 text-[#e8e4dc]'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
              }`}
              title={n.label}
            >
              <n.icon size={20} />
              {activeScreen === n.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#c4b998]" />
              )}
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-[#1e1e22] text-[11px] font-semibold text-[#e8e4dc] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl z-50">
                {n.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom: User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4b998] to-[#a89870] flex items-center justify-center font-bold text-[#111113] text-sm hover:scale-105 transition-transform shadow-lg shadow-[#c4b998]/10"
          >
            {currentUser?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {showDropdown && (
            <div className="absolute left-full bottom-0 ml-3 w-48 bg-[#1e1e22] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 z-50">
              <div className="px-4 py-2.5 border-b border-white/5 mb-1">
                <p className="text-xs font-semibold text-[#e8e4dc] truncate">{currentUser?.name || 'User'}</p>
                <p className="text-[10px] text-white/30 truncate">{currentUser?.email || ''}</p>
              </div>
              <button
                onClick={() => { setActiveScreen('me'); setSelectedAgentId(null); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-white/60 hover:text-[#e8e4dc] hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                <UserIcon size={14} /> Profile
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;

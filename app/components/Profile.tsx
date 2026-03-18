
import React, { useState } from 'react';
import { User, LearningAgent } from '../types';
import { firebaseService } from '../services/firebaseService';

interface ProfileProps {
  user: User;
  agents: LearningAgent[];
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, agents, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name
  });
  const [isSaving, setIsSaving] = useState(false);

  const totalFocus = agents.reduce((acc, a) => acc + (a.total_focus_time || 0), 0);
  const completedNodes = agents.reduce((acc, a) => 
    acc + a.roadmap.reduce((sum, m) => sum + m.subtopics.filter(s => s.is_completed).length, 0), 0
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await firebaseService.updateUser(user.uid, editData);
      onUpdateUser(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert("We couldn't save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent -z-10 rounded-[3rem] blur-3xl" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full -z-10 animate-float" />
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 figma-glass-blue p-10 md:p-12 rounded-[3rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10 w-36 h-36 rounded-full p-2 bg-gradient-to-br from-indigo-300 via-white/50 to-fuchsia-300 shadow-2xl animate-float">
          <div className="w-full h-full bg-slate-900/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-6xl font-black italic shadow-inner border border-white/30">
            {user.name[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        
        <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
          {isEditing ? (
            <div className="space-y-2">
              <input 
                className="text-4xl md:text-5xl font-black bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 outline-none w-full text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/60 transition-all shadow-inner"
                value={editData.name}
                onChange={e => setEditData({...editData, name: e.target.value})}
                placeholder="Your Name"
              />
            </div>
          ) : (
            <h2 className="text-4xl md:text-5xl font-black drop-shadow-lg text-white tracking-tight">{user.name}</h2>
          )}
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              {user.email}
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="relative z-10 px-8 py-4 bg-white/10 border border-white/30 hover:bg-white hover:text-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-xl backdrop-blur-md flex items-center gap-2 group/edit">
            <span className="opacity-70 group-hover/edit:opacity-100">✏️</span> Edit Profile
          </button>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-top-4 duration-300">
          <button onClick={handleSave} disabled={isSaving} className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all border border-white/20">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all hover:-translate-y-1">
            Cancel
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="figma-glass p-8 md:p-10 rounded-[3rem] text-white hover:shadow-2xl hover:bg-white/10 transition-all duration-500 border border-white/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-400/30 transition-colors" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-200 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Study Stats
          </h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-5xl font-black italic bg-clip-text text-transparent bg-gradient-to-br from-white to-indigo-200 flex items-baseline gap-1">
                {Math.floor(totalFocus / 60)}<span className="text-2xl not-italic text-indigo-300">h</span> 
                {totalFocus % 60}<span className="text-xl not-italic text-indigo-300">m</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/70">Focus Time</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black italic bg-clip-text text-transparent bg-gradient-to-br from-white to-violet-200">{completedNodes}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-200/70">Lessons Done</p>
            </div>
          </div>
        </div>

        <div className="figma-glass p-8 md:p-10 rounded-[3rem] text-white hover:shadow-2xl hover:bg-white/10 transition-all duration-500 border border-white/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-violet-400/30 transition-colors" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-violet-200 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" /> Learning Journey
          </h3>
          <div className="flex items-end gap-3">
            <p className="text-6xl font-black italic text-white leading-none">{agents.length}</p>
            <p className="text-lg font-bold text-violet-200/80 mb-1 leading-snug">Active<br/>Subjects</p>
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="space-y-8 relative">
        <h3 className="text-2xl font-black text-white px-2 flex items-center gap-3">
          My Subjects <span className="bg-white/20 text-white text-xs py-1 px-3 rounded-full font-bold">{agents.length}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {agents.map((a, i) => (
            <div key={a.id} className="group relative p-6 md:p-8 figma-glass border border-white/20 rounded-[2.5rem] hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-white/40 transition-all duration-300 overflow-hidden">
              {/* Subtle gradient background based on index */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${i % 2 === 0 ? 'from-indigo-400 to-violet-400' : 'from-violet-400 to-fuchsia-400'}`} />
              
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-black text-white/70 group-hover:bg-white group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-inner border border-white/20">
                  {a.subject[0]?.toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-black text-xl text-white group-hover:text-white transition-colors truncate">{a.subject}</p>
                  
                  {/* Custom Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-indigo-200">Progress</span>
                      <span className="text-white">{a.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full relative"
                        style={{ width: `${a.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Logout Area */}
      <div className="pt-8">
        <button 
          onClick={onLogout} 
          className="w-full relative group overflow-hidden py-5 px-8 rounded-3xl text-[11px] font-black uppercase tracking-widest text-rose-300 transition-all hover:text-white"
        >
          <div className="absolute inset-0 bg-rose-500/10 border-2 border-rose-500/30 rounded-3xl group-hover:bg-rose-500 group-hover:border-rose-500 transition-all duration-300 backdrop-blur-sm" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out Account
          </span>
        </button>
      </div>
    </div>
  );
};

export default Profile;

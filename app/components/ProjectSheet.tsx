
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Zap, Code2, Rocket, BrainCircuit, Layout } from 'lucide-react';

const MILESTONES = [
  { day: 1, phase: 'Phase 1: Core', title: 'Scheduler Initialization', desc: 'Fix session rendering & event population.', icon: <Code2 size={16}/> },
  { day: 2, phase: 'Phase 1: Core', title: 'Data Persistence Audit', desc: 'Refine local storage & state sync.', icon: <Code2 size={16}/> },
  { day: 3, phase: 'Phase 1: Core', title: 'Telemetry Reliability', desc: 'Finalize distraction & focus listeners.', icon: <Code2 size={16}/> },
  { day: 4, phase: 'Phase 2: Intelligence', title: 'QSVM Kernel Tuning', desc: 'Adjust ZZ Feature Map math weights.', icon: <BrainCircuit size={16}/> },
  { day: 5, phase: 'Phase 2: Intelligence', title: 'QAOA Visualization', desc: 'Implement energy minimization curves.', icon: <BrainCircuit size={16}/> },
  { day: 6, phase: 'Phase 2: Intelligence', title: 'Adaptive Content Loop', desc: 'Connect load state to Gemini synthesis.', icon: <BrainCircuit size={16}/> },
  { day: 7, phase: 'Phase 3: Mastery', title: 'Library Sourcing', desc: 'Optimize Google Search grounding prompts.', icon: <Layout size={16}/> },
  { day: 8, phase: 'Phase 3: Mastery', title: 'Final Assessment Node', desc: 'Build 30-question evaluation logic.', icon: <Layout size={16}/> },
  { day: 9, phase: 'Phase 3: Mastery', title: 'Analytics Dashboard', desc: 'Populate velocity & efficiency metrics.', icon: <Layout size={16}/> },
  { day: 10, phase: 'Phase 4: Delivery', title: 'Responsive Design Audit', desc: 'Polish UI for mobile & desktop views.', icon: <Rocket size={16}/> },
  { day: 11, phase: 'Phase 4: Delivery', title: 'Edge Case Handling', desc: 'Add error boundaries & loading states.', icon: <Rocket size={16}/> },
  { day: 12, phase: 'Phase 4: Delivery', title: 'Presentation Prep', desc: 'Record demo & final architect audit.', icon: <Rocket size={16}/> },
];

const ProjectSheet: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('project_milestones');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      try {
        localStorage.setItem('project_milestones', '[]');
      } catch {
        // ignore
      }
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('project_milestones', JSON.stringify(completedDays));
  }, [completedDays]);

  const toggleDay = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const progress = Math.round((completedDays.length / MILESTONES.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10 mix-blend-screen" />
      
      <div className="figma-glass-blue p-10 md:p-14 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 transition-colors group-hover:bg-cyan-300/30"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-5xl font-black italic tracking-tighter drop-shadow-md">Project Roadmap</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mt-4 border border-white/20 shadow-sm">
              <Zap size={14} className="text-cyan-300 animate-pulse"/> 
              <span className="text-cyan-50 text-[10px] font-black uppercase tracking-widest">
                Execution Phase: {progress < 100 ? 'In Development' : 'Launch Ready'}
              </span>
            </div>
          </div>
          <div className="text-center md:text-right bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-inner">
            <p className="text-6xl font-black italic bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-blue-500">{progress}%</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-100/70 mt-2">Completion Progress</p>
          </div>
        </div>
        <div className="w-full bg-black/30 h-3 rounded-full mt-10 overflow-hidden border border-white/10 relative p-0.5">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
             <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {MILESTONES.map((m, i) => {
          const isDone = completedDays.includes(m.day);
          return (
            <button 
              key={m.day} 
              onClick={() => toggleDay(m.day)}
              className={`p-8 rounded-[2.5rem] text-left transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden backdrop-blur-xl border border-transparent shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                isDone 
                  ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/30 hover:border-cyan-400/60 shadow-cyan-500/5' 
                  : 'bg-white/80 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {isDone && (
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-2xl rounded-full -m-10 group-hover:bg-cyan-400/20 transition-colors pointer-events-none" />
              )}
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-300 group-hover:scale-110 ${isDone ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {m.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm border ${isDone ? 'bg-cyan-100 text-cyan-800 border-cyan-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                    Day {m.day}
                  </span>
                </div>
                <h4 className={`font-black text-lg leading-tight mb-2 tracking-tight ${isDone ? 'text-cyan-950' : 'text-slate-900'}`}>{m.title}</h4>
                <p className={`text-[11px] font-bold leading-relaxed line-clamp-2 ${isDone ? 'text-cyan-800/80' : 'text-slate-500'}`}>{m.desc}</p>
              </div>
              
              <div className={`flex items-center gap-3 mt-4 pt-4 border-t relative z-10 transition-colors ${isDone ? 'border-cyan-200/50' : 'border-slate-100'}`}>
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-cyan-600" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
                    <Circle size={10} className="text-transparent" />
                  </div>
                )}
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-cyan-700' : 'text-slate-400'}`}>
                  {isDone ? 'Milestone Built' : 'Pending Build'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectSheet;

import React from 'react';
import { BrainCircuit, Cpu, Sparkles, Zap, BookOpen, Shield, ArrowRight, Code, Database, Server } from 'lucide-react';

interface AboutProps {
  onEnter?: () => void;
}

const About: React.FC<AboutProps> = ({ onEnter }) => {
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Roadmaps',
      description: 'Personalized day-by-day study roadmaps tailored to your subject, timeframe, and learning style.',
      color: '#c4b998',
    },
    {
      icon: Cpu,
      title: 'Quantum ML (QSVM)',
      description: 'Quantum Support Vector Machine classifies your cognitive load and mastery level in real-time.',
      color: '#8baa6e',
    },
    {
      icon: Zap,
      title: 'QAOA Scheduler',
      description: 'Quantum optimization resolves schedule conflicts and finds your optimal study timetable.',
      color: '#d4a574',
    },
    {
      icon: BookOpen,
      title: 'Adaptive Content',
      description: 'Every lesson generates notes, videos, flashcards, and quizzes — adapting to your weak areas.',
      color: '#7a9ec4',
    },
    {
      icon: Shield,
      title: 'Smart Review System',
      description: 'Struggled on a quiz? Targeted review lessons reinforce weak concepts automatically.',
      color: '#c97070',
    },
    {
      icon: Sparkles,
      title: 'AI Tutor Chat',
      description: 'An always-available AI tutor provides contextual help and guidance throughout your journey.',
      color: '#a88bc4',
    },
  ];

  const techStack = [
    { icon: Code, label: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'TailwindCSS'] },
    { icon: BrainCircuit, label: 'AI Engine', items: ['OpenRouter', 'Ollama Fallback', 'arcee-ai/trinity'] },
    { icon: Cpu, label: 'Quantum ML', items: ['Qiskit QSVM', 'QAOA Optimizer', 'ZZFeatureMap'] },
    { icon: Server, label: 'Backend', items: ['Express.js', 'MongoDB', 'Nodemailer'] },
  ];

  const teamMembers = [
    { name: 'Veera Kalyani Hema Tayaru Padala', role: 'Team Member' },
    { name: 'Relli Gopikanjali', role: 'Team Member' },
    { name: 'Teegireddy Sujitha', role: 'Team Member' },
    { name: 'Pani Siri', role: 'Team Member' },
  ];

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden selection:bg-[#c4b998]/30 selection:text-white">
      {/* Absolute Ambient Backgrounds */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#c4b998]/[0.05] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#7a9ec4]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] bg-[#8baa6e]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <div className="pt-24 lg:pt-36 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl">
              <span className="flex h-2 w-2 rounded-full bg-[#c4b998] animate-pulse"></span>
              <span className="text-xs font-medium tracking-wide text-white/70 uppercase">Next-Gen Education</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.05]">
              Learn Smarter <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c4b998] via-[#e6dfcc] to-[#8baa6e]">
                With Quantum AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl font-light">
              SmartLearn is a pioneer adaptive learning platform. By merging quantum machine learning with personalized study roadmaps, we orchestrate the perfect educational journey for you.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (onEnter) onEnter(); 
                  else window.location.href='/dashboard';
                }} 
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#c4b998] to-[#9a8e6b] text-black font-semibold tracking-wide hover:shadow-[0_0_40px_rgba(196,185,152,0.4)] transition-all duration-300 flex items-center gap-2 group"
              >
                Enter Platform
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#c4b998]/40 to-[#7a9ec4]/40 rounded-3xl blur-2xl opacity-50 z-0 animate-pulse"></div>
            <div className="relative z-10 p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-sm shadow-2xl">
              <img 
                src="/images/quantum_ai_learning_hero_1774814282300.png" 
                alt="Quantum AI Brain Hero" 
                className="rounded-[22px] w-full object-cover h-[400px] lg:h-[600px] shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* ── 2. How It Works (Split Layout) ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#8baa6e]/20 to-[#7a9ec4]/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-0"></div>
            <div className="relative z-10 p-2 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl">
              <img 
                src="/images/smart_education_concept_1774814299533.png" 
                alt="Smart Education Interface" 
                className="rounded-[2rem] w-full object-cover h-[350px] lg:h-[500px]"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c4b998]"></div>
                <h3 className="text-sm font-semibold tracking-widest text-[#c4b998] uppercase">The Process</h3>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Four Simple Steps</h2>
              <p className="text-white/40 text-lg leading-relaxed max-w-md">Our quantum engine continuously recalibrates your learning path. Simply define your goal and start executing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { step: '01', title: 'Create Subject', desc: 'Define your subject, timeline & goals' },
                { step: '02', title: 'AI Roadmap', desc: 'Day-by-day modules generated by AI' },
                { step: '03', title: 'Study & Learn', desc: 'Videos, notes, quizzes & flashcards' },
                { step: '04', title: 'Quantum Adapt', desc: 'QSVM tracks mastery & adjusts path' },
              ].map((item, i) => (
                <div key={i} className="group relative p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300">
                  <div className="absolute top-0 right-0 p-6 opacity-10 font-bold text-6xl text-white group-hover:text-[#c4b998] transition-colors">{item.step}</div>
                  <div className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</div>
                  <p className="text-sm text-white/50 relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. Core Features ───────────────────────────────────────── */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Powered by AI & Quantum ML</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">Discover the state-of-the-art tools we've integrated to make your education seamless, deeply personalized, and adaptive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-md overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl" style={{ boxShadow: `0 10px 40px -10px ${f.color}15` }}>
                {/* Glow behind icon */}
                <div className="absolute top-8 left-8 w-20 h-20 rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: f.color }} />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border bg-black/40 backdrop-blur-xl" style={{ borderColor: `${f.color}30` }}>
                    <f.icon size={26} style={{ color: f.color }} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-white text-xl mb-3">{f.title}</h3>
                  <p className="text-base text-white/50 leading-relaxed font-light">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Tech Stack ──────────────────────────────────────────── */}
        <div className="relative p-10 md:p-14 rounded-[3rem] border border-white/10 overflow-hidden group">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl z-0"></div>
          {/* Subtle radial glow inside the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#c4b998]/10 to-[#7a9ec4]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <div className="relative z-10 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Technology Stack</h2>
              <p className="text-white/40">The architecture powering our quantum adaptation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {techStack.map((group, i) => (
                <div key={i} className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-3">
                    <group.icon size={20} className="text-[#c4b998]" />
                    <h4 className="text-sm font-semibold tracking-wider text-white uppercase">{group.label}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, j) => (
                      <span key={j} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white/60">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. Project Team ────────────────────────────────────────── */}
        <div className="relative rounded-[3rem] overflow-hidden border border-white/10 group">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/team_collaboration_abstract_1774814326688.png" 
              alt="Team Abstract DB" 
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/80 to-transparent"></div>
          </div>

          <div className="relative z-10 p-10 md:p-20 space-y-16">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c4b998]"></div>
                <h3 className="text-sm font-semibold tracking-widest text-[#c4b998] uppercase">The Visionaries</h3>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c4b998]"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Project Credits</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* Project Guide */}
              <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group-hover:bg-white/[0.05] transition-colors">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c4b998] to-transparent opacity-50"></div>
                
                <div className="w-20 h-20 bg-gradient-to-br from-[#c4b998] to-[#9a8e6b] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(196,185,152,0.3)] text-black font-bold text-2xl">
                  PVS
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#c4b998] mb-2">Project Guide</p>
                <h3 className="text-2xl font-bold text-white">Dr. P.V.S. Lakshmi Jagadamba</h3>
              </div>

              {/* Team Members */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, i) => {
                  const initials = member.name.split(' ').map(w => w[0]).slice(0, 2).join('');
                  const colors = ['#c4b998', '#8baa6e', '#7a9ec4', '#a88bc4'];
                  const c = colors[i % colors.length];
                  return (
                    <div key={i} className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 block">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg"
                        style={{ backgroundColor: `${c}10`, border: `1px solid ${c}40`, color: c, boxShadow: `inset 0 0 20px ${c}10` }}
                      >
                        {initials}
                      </div>
                      <h4 className="font-semibold text-white text-sm leading-tight mb-1">{member.name}</h4>
                      <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{member.role}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="text-center space-y-6 pt-12 border-t border-white/5 pb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <BrainCircuit size={20} className="text-[#c4b998]" />
          </div>
          <div className="space-y-2">
            <div className="font-bold text-white text-lg tracking-tight">SmartLearn</div>
            <p className="text-white/30 text-sm max-w-sm mx-auto">
              Transforming education through quantum intelligence and personalized mastery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

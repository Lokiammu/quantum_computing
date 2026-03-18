import React, { useState } from 'react';
import { LearningAgent, FinalAssessment, QuizItem, SubjectiveItem } from '../types';
import { GraduationCap, CheckCircle2, AlertCircle, Send, ChevronRight, Trophy, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  agent: LearningAgent;
  onComplete: (result: { score: number, feedback: string, weak_areas: string[] }) => void;
  onClose: () => void;
}

const FinalAssessmentView: React.FC<Props> = ({ agent, onComplete, onClose }) => {
  const [assessment, setAssessment] = useState<FinalAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'intro' | 'objective' | 'subjective' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [objectiveAnswers, setObjectiveAnswers] = useState<Record<number, string>>({});
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<{ score: number, feedback: string, weak_areas: string[] } | null>(null);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/final-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: agent.subject, syllabus: agent.syllabus || 'Standard mastery path' })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed');
      setAssessment(json.assessment);
      setStage('objective');
    } catch (e) {
      alert("Failed to synthesize assessment nodes.");
    } finally {
      setLoading(false);
    }
  };

  const handleObjectiveNext = () => {
    if (currentIdx < (assessment?.objective_questions.length || 0) - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStage('subjective');
      setCurrentIdx(0);
    }
  };

  const submitFinal = async () => {
    setSubmitting(true);
    try {
      const objResults = assessment!.objective_questions.map((q, idx) => ({
        question: q.question,
        score: objectiveAnswers[idx] === q.answer ? 1 : 0
      }));
      const subjResults = assessment!.subjective_questions.map((q, idx) => ({
        question: q.question,
        answer: subjectiveAnswers[idx] || ''
      }));

      const res = await fetch('/api/ai/evaluate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: agent.subject, objectiveResults: objResults, subjectiveAnswers: subjResults })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed');
      setEvalResult(json.result);
      setStage('result');
      onComplete(json.result);
    } catch (e) {
      alert("Evaluation engine failure.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center p-10 text-center">
      <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-3xl font-black italic tracking-tighter">Generating Mastery Node...</h2>
      <p className="text-slate-500 font-medium mt-3">Compiling 30 rigorous objective and subjective challenges.</p>
    </div>
  );

  return (
      <div className="fixed inset-0 bg-white z-[250] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 -z-10 pointer-events-none" />
      
      <header className="h-24 border-b border-indigo-100/50 flex items-center justify-between px-10 bg-white/60 backdrop-blur-2xl shrink-0 relative z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 rounded-full transition-all border border-slate-200 shadow-sm text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:shadow-md">✕</button>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase text-slate-900">{agent.subject}: Mastery Exam</h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Final Performance Validation</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/50">
          <Trophy size={22} className="drop-shadow-sm" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 md:p-12 relative custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto h-full relative z-10 w-full">
          {stage === 'intro' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-10 animate-in zoom-in-95 duration-700 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
               
               <div className="w-32 h-32 bg-white/80 backdrop-blur-xl border border-white/50 rounded-[3rem] flex items-center justify-center text-indigo-600 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] relative group">
                 <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/50 rounded-[3rem]" />
                 <GraduationCap size={56} className="relative z-10 group-hover:scale-110 transition-transform duration-500 text-indigo-600 drop-shadow-md" />
               </div>
               <div className="space-y-4 relative z-10">
                 <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight text-slate-900 drop-shadow-sm">Mastery Awaits</h2>
                 <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                   This assessment consists of <span className="font-black text-indigo-600">30 questions</span> designed to validate your total understanding. 
                   You will encounter both objective choices and subjective application tasks.
                 </p>
               </div>
               <div className="grid grid-cols-2 gap-6 w-full max-w-lg relative z-10">
                  <div className="p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl hover:-translate-y-1 transition-transform text-center group cursor-default">
                    <p className="text-5xl font-black italic bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-violet-600 drop-shadow-sm">20</p>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-2">Objective</p>
                  </div>
                  <div className="p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl hover:-translate-y-1 transition-transform text-center group cursor-default">
                    <p className="text-5xl font-black italic bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-teal-500 drop-shadow-sm">10</p>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-2">Subjective</p>
                  </div>
               </div>
               <button onClick={startAssessment} className="w-full max-w-lg py-6 mt-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[2.5rem] font-black tracking-widest uppercase text-sm shadow-2xl hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 relative overflow-hidden group/btn">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10">Start Final Node</span>
               </button>
            </div>
          )}

          {stage === 'objective' && assessment && (
            <div className="space-y-10 animate-in fade-in duration-700 w-full relative">
              <div className="flex justify-between items-center border-b border-indigo-100 pb-6 relative z-10">
                 <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">Part 1: Objective Logic</span>
                 <span className="text-sm font-black italic text-slate-400 bg-white shadow-sm border border-slate-100 px-4 py-1.5 rounded-full">Q{currentIdx + 1} / 20</span>
              </div>
              <div className="p-10 md:p-14 border border-white/50 rounded-[3.5rem] bg-white/80 backdrop-blur-xl shadow-2xl relative">
                 <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-12 text-slate-900 drop-shadow-sm">{assessment.objective_questions[currentIdx].question}</h3>
                 <div className="space-y-5">
                    {assessment.objective_questions[currentIdx].options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setObjectiveAnswers({...objectiveAnswers, [currentIdx]: opt})}
                        className={`w-full text-left p-6 md:p-8 rounded-[2rem] border-2 font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                          objectiveAnswers[currentIdx] === opt 
                            ? 'border-indigo-500 bg-indigo-50/80 shadow-[0_8px_30px_rgb(99,102,241,0.15)] text-indigo-900' 
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 hover:shadow-md'
                        }`}
                      >
                        {objectiveAnswers[currentIdx] === opt && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                        )}
                        <span className="relative z-10 flex items-start gap-4">
                          <span className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-full text-sm mt-0.5 font-bold transition-colors ${
                            objectiveAnswers[currentIdx] === opt ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300 group-hover:text-slate-900'
                          }`}>{String.fromCharCode(65 + i)}</span>
                          <span className="leading-relaxed">{opt}</span>
                        </span>
                      </button>
                    ))}
                 </div>
              </div>
              <button 
                onClick={handleObjectiveNext} 
                disabled={!objectiveAnswers[currentIdx]} 
                className="w-full py-6 md:py-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                 {currentIdx === 19 ? 'Next Part →' : 'Confirm & Continue'}
              </button>
            </div>
          )}

          {stage === 'subjective' && assessment && (
            <div className="space-y-10 animate-in fade-in duration-700 w-full relative">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-rose-100 pb-6 relative z-10">
                 <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100">Part 2: Synthesis & Application</span>
                 <span className="text-sm font-black italic text-slate-400 bg-white shadow-sm border border-slate-100 px-4 py-1.5 rounded-full">Q{currentIdx + 1} / 10</span>
              </div>
              <div className="p-10 md:p-14 border border-white/50 rounded-[3.5rem] bg-white/80 backdrop-blur-xl shadow-2xl relative">
                 <h3 className="text-3xl font-black tracking-tight leading-tight mb-10 text-slate-900 drop-shadow-sm">{assessment.subjective_questions[currentIdx].question}</h3>
                 <div className="relative group">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none rounded-[2rem] z-10 transition-opacity opacity-0 group-focus-within:opacity-100" />
                   <textarea 
                     className="w-full h-56 p-8 bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200 rounded-[2.5rem] outline-none font-medium text-lg text-slate-800 focus:bg-white focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] transition-all resize-none relative z-0"
                     placeholder="Synthesize your comprehensive response here..."
                     value={subjectiveAnswers[currentIdx] || ''}
                     onChange={e => setSubjectiveAnswers({...subjectiveAnswers, [currentIdx]: e.target.value})}
                   />
                 </div>
              </div>
              <div className="flex gap-4 md:gap-6 relative z-10">
                 <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} className="flex-1 py-6 md:py-8 bg-white border border-slate-200 text-slate-600 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-slate-50 hover:shadow-md transition-all disabled:opacity-40 disabled:hover:shadow-none disabled:hover:bg-white">← Prev</button>
                 {currentIdx < 9 ? (
                   <button onClick={() => setCurrentIdx(currentIdx + 1)} className="flex-[2] py-6 md:py-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0">Next Challenge →</button>
                 ) : (
                   <button onClick={submitFinal} disabled={submitting} className="flex-[2] py-6 md:py-8 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden">
                     {submitting ? (
                        <span className="flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Evaluating...</span>
                     ) : 'Final Submission'}
                   </button>
                 )}
              </div>
            </div>
          )}

          {stage === 'result' && evalResult && (
            <div className="space-y-12 animate-in zoom-in-95 duration-700 text-center max-w-3xl mx-auto py-10">
               <div className="w-40 h-40 bg-gradient-to-br from-indigo-50 to-white rounded-[3.5rem] flex items-center justify-center mx-auto text-7xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.2)] border border-white/50 mb-8 relative group cursor-default">
                 <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-[3.5rem]" />
                 <span className="relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 drop-shadow-md">🏆</span>
               </div>
               <div>
                 <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 drop-shadow-sm leading-tight">Mastery Analysis Complete</h2>
                 <p className="text-slate-500 font-bold mt-4 text-lg">Combined Logic & Synthesis Score</p>
               </div>
               
               <div className="relative inline-block">
                 <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
                 <div className="text-[8rem] md:text-[10rem] font-black italic bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-indigo-700 leading-none drop-shadow-sm relative z-10">{evalResult.score}<span className="text-6xl text-indigo-400 align-top ml-2">%</span></div>
               </div>

               <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white shadow-2xl text-left space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-50/50 rounded-full -m-20 blur-3xl pointer-events-none -z-10" />
                  <div>
                    <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={16}/> Neural Feedback</p>
                    <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed italic pr-4">"{evalResult.feedback}"</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={16}/> Weak Nodes (Review Suggested)</p>
                    <div className="flex flex-wrap gap-3">
                       {evalResult.weak_areas.map((area, i) => (
                         <span key={i} className="px-5 py-2.5 bg-rose-50 border border-rose-100/50 rounded-2xl text-[13px] font-bold text-rose-700 shadow-sm">{area}</span>
                       ))}
                       {evalResult.weak_areas.length === 0 && (
                          <span className="px-5 py-2.5 bg-emerald-50 border border-emerald-100/50 rounded-2xl text-[13px] font-bold text-emerald-700 shadow-sm flex items-center gap-2"><CheckCircle2 size={16}/> Perfect understanding</span>
                       )}
                    </div>
                  </div>
               </div>

               <button onClick={onClose} className="w-full max-w-md py-7 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[3rem] font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300">Finalize Mastery Node</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FinalAssessmentView;


import React, { useState, useMemo, useEffect } from 'react';
import { Task, ScheduleEvent, LearningAgent, User } from '../types';
import { Clock, Settings2, Bell, BellOff } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';

interface PlannerProps {
  tasks: Task[];
  schedule: ScheduleEvent[];
  agents: LearningAgent[];
  currentUser: User | null;
  onStartSession: (agentId: string, subtopicId: string) => void;
  onUpdateSchedule: (updated: ScheduleEvent[]) => void;
}

const Planner: React.FC<PlannerProps> = ({ tasks, schedule, agents, currentUser, onStartSession, onUpdateSchedule }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [showScheduler, setShowScheduler] = useState(false);
  const [studyHour, setStudyHour] = useState(() => {
    const first = schedule.find(e => e.type === 'study');
    return first ? new Date(first.start_time).getHours() : 10;
  });
  const [studyMinute, setStudyMinute] = useState(() => {
    const first = schedule.find(e => e.type === 'study');
    return first ? new Date(first.start_time).getMinutes() : 0;
  });
  const [sessionDuration, setSessionDuration] = useState(() => {
    const first = schedule.find(e => e.type === 'study');
    if (first) {
      const diff = (new Date(first.end_time).getTime() - new Date(first.start_time).getTime()) / 60000;
      return Math.round(diff) || 120;
    }
    return 120;
  });

  // Reminder preferences
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(60);
  const [reminderSaving, setReminderSaving] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      firebaseService.getReminderPrefs(currentUser.uid).then(prefs => {
        setReminderEnabled(prefs.enabled);
        setReminderMinutes(prefs.minutesBefore);
      }).catch(() => {});
    }
  }, [currentUser?.uid]);

  const saveReminderPrefs = async (enabled: boolean, minutes: number) => {
    if (!currentUser?.uid) return;
    setReminderSaving(true);
    try {
      const updated = await firebaseService.saveReminderPrefs(currentUser.uid, { enabled, minutesBefore: minutes });
      setReminderEnabled(updated.enabled);
      setReminderMinutes(updated.minutesBefore);
    } catch (e) {
      console.error('Failed to save reminder prefs:', e);
    } finally {
      setReminderSaving(false);
    }
  };

  // Generate 14 days for the horizontal picker
  const dates = useMemo(() => {
    const arr = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const selectedDayEvents = useMemo(() => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    return schedule.filter(e => {
      const d = new Date(e.start_time);
      return d >= start && d <= end;
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [selectedDate, schedule]);

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date.getTime() === today.getTime()) return "Today";

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const applyScheduleChange = () => {
    const updated = schedule.map(e => {
      if (e.type !== 'study') return e;
      const old = new Date(e.start_time);
      const newStart = new Date(old);
      newStart.setHours(studyHour, studyMinute, 0, 0);
      const newEnd = new Date(newStart.getTime() + sessionDuration * 60000);
      return { ...e, start_time: newStart.toISOString(), end_time: newEnd.toISOString() };
    });
    onUpdateSchedule(updated);
    setShowScheduler(false);
  };

  const dayEventCount = (date: Date) => {
    const start = new Date(date); start.setHours(0,0,0,0);
    const end = new Date(date); end.setHours(23,59,59,999);
    return schedule.filter(e => { const d = new Date(e.start_time); return d >= start && d <= end; }).length;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header with scheduler toggle */}
      <div className="sticky top-0 z-10 figma-glass mx-6 mt-6 rounded-[2rem] px-6 py-6 mb-4 shadow-sm border-white/20">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-3xl font-black tracking-tighter text-white">Daily Schedule</h2>
          <button
            onClick={() => setShowScheduler(!showScheduler)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              showScheduler
                ? 'bg-white text-[#0d62bb] border-transparent shadow-lg'
                : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Settings2 size={14} />
            {showScheduler ? 'Close' : 'Settings'}
          </button>
        </div>

        {/* Scheduler Settings Panel */}
        {showScheduler && (
          <div className="mb-6 px-2 animate-in slide-in-from-top-2 duration-300">
            <div className="figma-glass-blue p-6 rounded-2xl space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-indigo-300" />
                <h3 className="text-sm font-black text-white">Study Schedule Settings</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Start Time */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Start Time</label>
                  <div className="flex gap-2">
                    <select
                      value={studyHour}
                      onChange={e => setStudyHour(Number(e.target.value))}
                      className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm outline-none focus:border-white/50 transition-colors"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i} className="bg-slate-900">{(i % 12 || 12).toString().padStart(2, '0')} {i >= 12 ? 'PM' : 'AM'}</option>
                      ))}
                    </select>
                    <select
                      value={studyMinute}
                      onChange={e => setStudyMinute(Number(e.target.value))}
                      className="w-20 p-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm outline-none focus:border-white/50 transition-colors"
                    >
                      {[0, 15, 30, 45].map(m => (
                        <option key={m} value={m} className="bg-slate-900">{m.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Session Duration</label>
                  <select
                    value={sessionDuration}
                    onChange={e => setSessionDuration(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm outline-none focus:border-white/50 transition-colors"
                  >
                    {[30, 45, 60, 90, 120, 150, 180].map(d => (
                      <option key={d} value={d} className="bg-slate-900">{d >= 60 ? `${Math.floor(d / 60)}h${d % 60 ? ` ${d % 60}m` : ''}` : `${d}m`}</option>
                    ))}
                  </select>
                </div>

                {/* Apply */}
                <div className="flex items-end">
                  <button
                    onClick={applyScheduleChange}
                    className="w-full p-3 bg-white text-[#0d62bb] rounded-xl font-black text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Apply to All
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-white/30 font-medium">
                Currently: {formatTime(studyHour, studyMinute)} daily · {sessionDuration >= 60 ? `${Math.floor(sessionDuration / 60)}h${sessionDuration % 60 ? ` ${sessionDuration % 60}m` : ''}` : `${sessionDuration}m`} per session
              </p>
            </div>

            {/* Email Reminder Settings */}
            <div className="figma-glass-blue p-6 rounded-2xl space-y-5 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reminderEnabled ? <Bell size={16} className="text-emerald-300" /> : <BellOff size={16} className="text-white/40" />}
                  <h3 className="text-sm font-black text-white">Email Reminders</h3>
                </div>
                <button
                  onClick={() => saveReminderPrefs(!reminderEnabled, reminderMinutes)}
                  disabled={reminderSaving}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    reminderEnabled ? 'bg-emerald-400' : 'bg-white/20'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                    reminderEnabled ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>

              {reminderEnabled && (
                <div className="flex items-center gap-4 animate-in fade-in duration-200">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 shrink-0">Remind me</label>
                  <select
                    value={reminderMinutes}
                    onChange={e => saveReminderPrefs(true, Number(e.target.value))}
                    className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm outline-none focus:border-white/50 transition-colors"
                  >
                    {[10, 15, 30, 45, 60, 120].map(m => (
                      <option key={m} value={m} className="bg-slate-900">
                        {m >= 60 ? `${m / 60} hour${m > 60 ? 's' : ''}` : `${m} minutes`} before
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <p className="text-[10px] text-white/30 font-medium">
                {reminderEnabled
                  ? `You'll receive an email ${reminderMinutes >= 60 ? `${reminderMinutes / 60}h` : `${reminderMinutes}min`} before each study session`
                  : 'Email reminders are turned off'}
              </p>
            </div>
          </div>
        )}

        {/* Date Picker */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-2">
          {dates.map((date, idx) => {
            const isSelected = date.getTime() === selectedDate.getTime();
            const count = dayEventCount(date);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[75px] py-4 rounded-3xl transition-all duration-300 border relative ${
                  isSelected
                  ? 'bg-white text-[#0d62bb] border-transparent shadow-lg shadow-black/20 -translate-y-1'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 hover:-translate-y-1'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-90">
                  {formatDateLabel(date)}
                </span>
                <span className="text-2xl font-black">{date.getDate()}</span>
                {count > 0 && (
                  <div className={`mt-1 flex gap-0.5 ${isSelected ? '' : ''}`}>
                    {Array.from({ length: Math.min(count, 4) }, (_, i) => (
                      <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#0d62bb]/40' : 'bg-white/30'}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline View */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-32 custom-scrollbar">
        {selectedDayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-sm mx-auto">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md shadow-sm rounded-full flex items-center justify-center text-5xl">🏜️</div>
            <div>
              <p className="text-2xl font-black text-white drop-shadow-sm">All Clear!</p>
              <p className="text-sm font-bold text-white/50 mt-2 leading-relaxed">No sessions scheduled for this day. Enjoy your free time or schedule a new module.</p>
            </div>
          </div>
        ) : (
          <div className="mx-4 lg:mx-8 space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-1 before:bg-white/10 before:rounded-full">
            {selectedDayEvents.map((event, idx) => {
              const isStudy = event.type === 'study';
              const agent = isStudy ? agents.find(a => a.id === event.agent_id) : null;
              const subtopic = agent ? agent.roadmap.flatMap(m => m.subtopics).find(s => s.id === event.subtopic_id) : null;
              const isCompleted = subtopic?.is_completed ?? false;
              const startTime = new Date(event.start_time);
              const endTime = new Date(event.end_time);
              const durationMin = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

              return (
                <div key={event.id} className="relative pl-14 group animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-6 w-9 h-9 rounded-full border-4 border-[#0d62bb] shadow-md z-10 transition-transform group-hover:scale-125 ${
                    isCompleted ? 'bg-emerald-400' : isStudy ? 'bg-white' : 'bg-rose-400'
                  }`} />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 pl-1">
                      <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-white/20">—</span>
                      <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">
                        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
                      isCompleted
                      ? 'figma-glass border-emerald-400/30'
                      : isStudy
                      ? 'figma-glass hover:border-white/50 hover:shadow-xl hover:-translate-y-1'
                      : 'bg-rose-500/20 backdrop-blur-md border-rose-300/30 shadow-sm hover:shadow-md'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex-1">
                          {agent && (
                            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-3 border border-white/20">
                              {agent.subject}
                            </div>
                          )}
                          <h4 className="text-xl font-black text-white leading-tight">
                            {event.title.split(': ').length > 1 ? event.title.split(': ')[1] : event.title}
                          </h4>
                        </div>

                        {isStudy && event.agent_id && event.subtopic_id && (
                          isCompleted ? (
                            <span className="shrink-0 px-6 py-3 bg-emerald-500/20 text-emerald-300 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-400/30">
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => onStartSession(event.agent_id!, event.subtopic_id!)}
                              className="shrink-0 px-6 py-3 bg-white text-[#0d62bb] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg hover:shadow-white/20 active:scale-95"
                            >
                              Launch Lesson
                            </button>
                          )
                        )}
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20'
                          : isStudy ? 'bg-white/20 text-white' : 'bg-rose-500/30 text-rose-100 border border-rose-400/20'
                        }`}>
                          {isCompleted ? 'done' : event.type}
                        </span>
                        <span className="text-xs font-bold text-white/50 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                          {durationMin >= 60 ? `${Math.floor(durationMin / 60)}h${durationMin % 60 ? ` ${durationMin % 60}m` : ''}` : `${durationMin}m`}
                        </span>
                        {typeof subtopic?.quiz_score === 'number' && (
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg ${
                            subtopic.quiz_score >= 70
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                          }`}>{subtopic.quiz_score}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Deadlines Section */}
        {tasks.length > 0 && (
          <div className="mt-8 pt-8 mx-4 lg:mx-8 border-t border-white/10">
            <h3 className="text-xs font-black uppercase text-white/50 tracking-widest mb-6 px-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-400 rounded-full"></span>
              Upcoming Deadlines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.slice(0, 4).map(task => (
                <div key={task.id} className="p-6 figma-glass rounded-3xl group hover:shadow-md transition-all flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-sm font-black text-white leading-tight mb-1 group-hover:text-white/80 transition-colors">{task.title}</p>
                    <p className="text-[10px] font-bold text-white/50">{new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0 ${
                    task.priority === 'high' ? 'bg-rose-500/20 text-rose-100 border border-rose-400/30' : 'bg-white/10 text-white/80 border border-white/20'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;

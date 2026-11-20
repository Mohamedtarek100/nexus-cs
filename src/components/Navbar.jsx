import React, { useState, useEffect } from 'react';
import { 
  Terminal, Volume2, VolumeX, Download, Plus, 
  Sparkles, CheckCircle2, Award, Zap, Code, BookOpen, Clock, 
  Flame, LayoutDashboard, CheckSquare, Layers, Brain, FileText, Monitor
} from 'lucide-react';
import { sound } from '../utils/audioSynth';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  profile, 
  onOpenTaskModal, 
  onToggleTerminal,
  soundEnabled,
  setSoundEnabled,
  installPrompt,
  onInstallApp
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'لوحة القيادة (HUD)', icon: LayoutDashboard },
    { id: 'tasks', label: 'المهام ومشاريع الكود', icon: CheckSquare },
    { id: 'academic', label: 'الكلية والمواد والأكاديميا', icon: BookOpen },
    { id: 'leetcode', label: 'LeetCode ومسائل الخوارزميات', icon: Brain },
    { id: 'focus', label: 'منطقة التركيز (Pomodoro)', icon: Clock },
    { id: 'scratchpad', label: 'الملاحظات والاسكراتش باد', icon: FileText },
  ];

  const handleTabChange = (id) => {
    sound.playClick();
    setCurrentTab(id);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.toggleSound(next);
    if (next) sound.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl">
      {/* Top Ticker / Meta Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/40 px-4 py-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            SYSTEM ONLINE
          </span>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <span className="hidden font-mono text-slate-400 sm:inline">
            SYS_TIME: <span className="text-emerald-400">{timeStr}</span>
          </span>
          <span className="hidden text-slate-600 md:inline">|</span>
          <span className="hidden items-center gap-1 text-amber-400 md:flex">
            <Flame className="h-3.5 w-3.5" />
            <span>Streak: {profile.streakDays} يوم متواصل</span>
          </span>
        </div>

        {/* User XP & Level Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-2.5 py-0.5 text-xs text-indigo-300">
            <Award className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold">{profile.name}</span>
            <span className="rounded bg-indigo-500/20 px-1 py-0.2 font-mono text-[10px] text-indigo-300">
              LVL {profile.level}
            </span>
            <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-800 sm:block">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" 
                style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
              />
            </div>
            <span className="hidden font-mono text-[10px] text-slate-400 sm:inline">
              {profile.xp}/{profile.nextLevelXp} XP
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
          </button>

          {/* Terminal Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleTerminal();
            }}
            title="فتح الـ Terminal التفاعلي (CLI)"
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-xs font-mono text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-cyan-200"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">&gt;_ CLI</span>
          </button>

          {/* Install PWA App Button */}
          <button
            onClick={() => {
              sound.playClick();
              onInstallApp();
            }}
            title="تثبيت المنصة كتطبيق سطح مكتب منفصل (Desktop App)"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
          >
            <Monitor className="h-3.5 w-3.5 text-emerald-400" />
            <span>تثبيت كتطبيق</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#090d16]">
              <Code className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white">
                NEXUS<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">CS</span>
              </h1>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase text-cyan-300">
                v2.6 PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              نظام إدارة مهام علوم الحاسب والكلية • CS Student Mission Control
            </p>
          </div>
        </div>

        {/* Global Action: Add Task */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenTaskModal();
            }}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-95"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>إضافة مهمة / تكليف جديد</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex space-x-1 space-x-reverse overflow-x-auto border-t border-slate-800/60 px-4 py-1.5 scrollbar-none md:px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}

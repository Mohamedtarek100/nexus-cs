import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  Flame, Award, CheckCircle2, Headphones, Radio, Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioSynth';

export default function PomodoroFocus({ data, onAddFocusXp }) {
  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak' | 'sprint'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(2);
  const [ambientSound, setAmbientSound] = useState('off'); // 'off' | 'binaural-gamma' | 'cyber-rain' | 'cyber-drone'
  const [focusTask, setFocusTask] = useState('حل مسائل الـ Trees والـ Graph');

  const timerRef = useRef(null);

  const modeTimes = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    sprint: 50 * 60 // 50m CS deep coding sprint
  };

  const handleModeChange = (newMode) => {
    sound.playClick();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeTimes[newMode]);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    sound.playSuccess();
    confetti({ particleCount: 60, spread: 70 });
    
    if (mode === 'work' || mode === 'sprint') {
      setSessionsCompleted(prev => prev + 1);
      if (onAddFocusXp) {
        onAddFocusXp(50); // reward XP for CS focus
      }
    }
  };

  const toggleTimer = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const handleAmbientChange = (type) => {
    sound.playClick();
    if (ambientSound === type) {
      setAmbientSound('off');
      sound.stopAmbient();
    } else {
      setAmbientSound(type);
      sound.startAmbient(type);
    }
  };

  // Clean up ambient sound on unmount
  useEffect(() => {
    return () => {
      sound.stopAmbient();
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((modeTimes[mode] - timeLeft) / modeTimes[mode]) * 100;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
              DEEP WORK MATRIX
            </span>
            <span className="text-xs text-slate-400">منطقة التركيز العالي بدون تشتيت</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-white">مؤقت الـ Pomodoro والصوت المحيطي (Cyber Focus)</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs text-amber-300">
            <Flame className="h-4 w-4" />
            <span>جلسات اليوم المكتملة: <strong className="font-mono">{sessionsCompleted}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Timer Display (2 cols) */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 lg:col-span-2">
          {/* Mode Selector */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
            <button
              onClick={() => handleModeChange('work')}
              className={`rounded-lg px-4 py-2 font-bold transition-all ${
                mode === 'work' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              تركيز عادي (25m)
            </button>
            <button
              onClick={() => handleModeChange('sprint')}
              className={`rounded-lg px-4 py-2 font-bold transition-all ${
                mode === 'sprint' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              ماراثون كود (50m)
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`rounded-lg px-4 py-2 font-bold transition-all ${
                mode === 'shortBreak' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              استراحة قصيرة (5m)
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`rounded-lg px-4 py-2 font-bold transition-all ${
                mode === 'longBreak' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              استراحة طويلة (15m)
            </button>
          </div>

          {/* Big Countdown Clock */}
          <div className="relative my-8 flex h-64 w-64 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-950/80 shadow-2xl">
            {/* Pulsing glow ring if running */}
            {isRunning && (
              <div className="absolute inset-0 rounded-full border border-cyan-400 opacity-40 animate-ping" />
            )}
            
            <div className="text-center">
              <div className="font-mono text-6xl font-black tracking-wider text-white">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-2 text-xs font-semibold text-cyan-400">
                {isRunning ? '• جاري التركيز...' : '• متوقف مؤقتاً'}
              </div>
            </div>
          </div>

          {/* Current Focus Task Input */}
          <div className="w-full max-w-md">
            <label className="text-xs text-slate-400">الهدف الحالي للجلسة:</label>
            <input
              type="text"
              value={focusTask}
              onChange={e => setFocusTask(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold shadow-xl transition-all ${
                isRunning
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 shadow-cyan-500/30'
              }`}
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span>{isRunning ? 'إيقاف مؤقت' : 'بدء التركيز'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
              title="إعادة ضبط المؤقت"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Ambient Synthesizer Box (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Headphones className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">مولد الصوت المحيطي (Web Audio Synth)</h3>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              ترددات مولدة برمجياً لعزل الضوضاء وتحفيز التركيز في المخ. شغالة أوفلاين بدون أي نت:
            </p>

            <div className="mt-4 space-y-2.5">
              {/* Option 1: 40Hz Gamma */}
              <button
                onClick={() => handleAmbientChange('binaural-gamma')}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-right text-xs transition-all ${
                  ambientSound === 'binaural-gamma'
                    ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <p className="font-bold">موجات 40Hz Gamma (Binaural)</p>
                  <p className="text-[10px] text-slate-400">لحل المشاكل المعقدة والـ Problem Solving</p>
                </div>
                {ambientSound === 'binaural-gamma' ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-slate-600" />}
              </button>

              {/* Option 2: Cyber Rain */}
              <button
                onClick={() => handleAmbientChange('cyber-rain')}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-right text-xs transition-all ${
                  ambientSound === 'cyber-rain'
                    ? 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <p className="font-bold">صوت المطر الرقمي (Cyber Rain)</p>
                  <p className="text-[10px] text-slate-400">ضوضاء ناعمة لعزل أصوات المحيط والغرفة</p>
                </div>
                {ambientSound === 'cyber-rain' ? <Volume2 className="h-4 w-4 text-indigo-400" /> : <VolumeX className="h-4 w-4 text-slate-600" />}
              </button>

              {/* Option 3: Cyber Drone */}
              <button
                onClick={() => handleAmbientChange('cyber-drone')}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-right text-xs transition-all ${
                  ambientSound === 'cyber-drone'
                    ? 'border-purple-500/60 bg-purple-950/40 text-purple-300 shadow-sm shadow-purple-500/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <p className="font-bold">رنين الفضاء العميق (Deep Space Drone)</p>
                  <p className="text-[10px] text-slate-400">سينث هادئ لكتابة الكود والـ Flow State</p>
                </div>
                {ambientSound === 'cyber-drone' ? <Volume2 className="h-4 w-4 text-purple-400" /> : <VolumeX className="h-4 w-4 text-slate-600" />}
              </button>
            </div>

            {ambientSound !== 'off' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setAmbientSound('off');
                  sound.stopAmbient();
                }}
                className="mt-3 w-full rounded-lg border border-rose-500/30 bg-rose-950/20 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40"
              >
                إيقاف الصوت المحيطي
              </button>
            )}
          </div>

          {/* Quick CS Focus Tips */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-xs text-slate-400">
            <h4 className="font-bold text-white mb-2">قواعد جلسة الكود الفعالة:</h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>اقفل أي سوشيال ميديا أو تبويبات يوتيوب غير متعلقة بالكود.</li>
              <li>قسّم المشكلة المعقدة لـ Sub-problems صغيرة في ورقة أو سكراتش باد.</li>
              <li>لما المؤقت يرن، قوم اتحرك واشرب مية وريح عينك من الشاشة.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

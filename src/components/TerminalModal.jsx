import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { sound } from '../utils/audioSynth';

export default function TerminalModal({ 
  isOpen, 
  onClose, 
  data, 
  onAddTask,
  soundEnabled,
  setSoundEnabled 
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'NEXUS-CS Terminal OS [Version 2.6.0-release]' },
    { type: 'system', text: 'Type "help" to list available commands. Press Esc to exit.' },
    { type: 'system', text: '------------------------------------------------------------' }
  ]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
      return;
    }

    if (e.key !== 'Enter') return;
    e.preventDefault();

    sound.playClick();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    // Add to history
    setCmdHistory(prev => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    const newEntries = [{ type: 'user', text: `$ ${rawCmd}` }];

    switch (cmd) {
      case 'help':
        newEntries.push({
          type: 'output',
          text: `Available Commands:
  • help           : Show this help manual
  • status         : View CS student profile, GPA, and active sprint stats
  • tasks          : List all pending college and dev tasks
  • add <title>    : Quick add a new task directly from CLI
  • courses        : List enrolled academic courses and credit hours
  • leetcode       : Show algorithm problems count & difficulty breakdown
  • matrix         : Toggle Matrix hacker digital rain mode
  • sound <on/off> : Enable or disable audio synthesizer sound FX
  • clear          : Clear terminal screen
  • exit           : Close terminal shell`
        });
        break;

      case 'status':
        newEntries.push({
          type: 'output',
          text: `[SYSTEM STATUS]
  Student : ${data.profile.name} (${data.profile.university})
  Level   : ${data.profile.level} (${data.profile.xp} / ${data.profile.nextLevelXp} XP)
  GPA     : ${data.profile.currentGpa} / 4.00 (Target: ${data.profile.targetGpa})
  Streak  : ${data.profile.streakDays} days
  Tasks   : ${data.tasks.filter(t => t.status !== 'done').length} pending / ${data.tasks.length} total`
        });
        break;

      case 'tasks':
        const pending = data.tasks.filter(t => t.status !== 'done');
        if (pending.length === 0) {
          newEntries.push({ type: 'output', text: 'All tasks are completed! Great job!' });
        } else {
          const list = pending.map((t, idx) => `  [${idx + 1}] (${t.priority.toUpperCase()}) ${t.title} [Due: ${t.dueDate || 'N/A'}]`).join('\n');
          newEntries.push({ type: 'output', text: `Pending Tasks (${pending.length}):\n${list}` });
        }
        break;

      case 'add':
        if (!arg) {
          newEntries.push({ type: 'error', text: 'Error: Please provide task title. e.g. "add Implement QuickSort in C++"' });
        } else {
          onAddTask({
            id: 'cli_t_' + Date.now(),
            title: arg,
            type: 'dev',
            category: 'CLI Quick Task',
            priority: 'medium',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            tags: ['CLI', 'QuickTask'],
            points: 10,
            xpReward: 80,
            subtasks: []
          });
          newEntries.push({ type: 'output', text: `✓ Task successfully created: "${arg}"` });
        }
        break;

      case 'courses':
        const cList = data.courses.map(c => `  • [${c.code}] ${c.name} (${c.credits} Cr) - ${c.doctor}`).join('\n');
        newEntries.push({ type: 'output', text: `Enrolled Courses:\n${cList}` });
        break;

      case 'leetcode':
        const e = data.leetcode.filter(p => p.difficulty === 'Easy').length;
        const m = data.leetcode.filter(p => p.difficulty === 'Medium').length;
        const h = data.leetcode.filter(p => p.difficulty === 'Hard').length;
        newEntries.push({
          type: 'output',
          text: `LeetCode Solved Stats:
  Total Solved : ${data.leetcode.length}
  Easy         : ${e}
  Medium       : ${m}
  Hard         : ${h}`
        });
        break;

      case 'matrix':
        setIsMatrixActive(prev => !prev);
        newEntries.push({ type: 'output', text: 'Matrix mode toggled!' });
        break;

      case 'sound':
        if (arg === 'on') {
          setSoundEnabled(true);
          sound.toggleSound(true);
          newEntries.push({ type: 'output', text: 'Sound effects enabled.' });
        } else if (arg === 'off') {
          setSoundEnabled(false);
          sound.toggleSound(false);
          newEntries.push({ type: 'output', text: 'Sound effects muted.' });
        } else {
          newEntries.push({ type: 'error', text: 'Usage: sound on | sound off' });
        }
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        newEntries.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for a list of available commands.`
        });
        break;
    }

    setHistory(prev => [...prev, ...newEntries]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className={`relative flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl border ${isMatrixActive ? 'border-emerald-500 bg-black/95 text-emerald-400' : 'border-cyan-500/40 bg-slate-950/95 text-slate-100'} shadow-2xl overflow-hidden font-mono text-xs`}>
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="mr-2 text-xs font-bold text-slate-300">nexus-cs@terminal:~</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500">BASH / SHELL</span>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text" dir="ltr">
          {history.map((item, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {item.type === 'user' && (
                <span className="text-cyan-400 font-bold">{item.text}</span>
              )}
              {item.type === 'system' && (
                <span className="text-indigo-400">{item.text}</span>
              )}
              {item.type === 'output' && (
                <span className={isMatrixActive ? 'text-emerald-400' : 'text-slate-300'}>{item.text}</span>
              )}
              {item.type === 'error' && (
                <span className="text-rose-400 font-semibold">{item.text}</span>
              )}
            </div>
          ))}

          {/* Prompt line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400 font-bold">mohamed@nexus-cs:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent text-white focus:outline-none"
              autoFocus
              spellCheck={false}
            />
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Footer tip */}
        <div className="border-t border-slate-800 bg-slate-900/50 px-4 py-1.5 text-[10px] text-slate-500 flex justify-between" dir="rtl">
          <span>اكتب help لرؤية الأوامر • استخدم الأسهم للرجوع للأوامر السابقة</span>
          <span>CLI V2.6 PRO</span>
        </div>
      </div>
    </div>
  );
}

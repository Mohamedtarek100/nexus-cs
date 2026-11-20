import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CommandCenter from './components/CommandCenter';
import TasksView from './components/TasksView';
import AcademicHub from './components/AcademicHub';
import LeetCodeTracker from './components/LeetCodeTracker';
import PomodoroFocus from './components/PomodoroFocus';
import ScratchpadView from './components/ScratchpadView';
import TerminalModal from './components/TerminalModal';
import TaskModal from './components/TaskModal';
import { loadData, saveData, initialData } from './utils/dataStorage';
import { sound } from './utils/audioSynth';
import confetti from 'canvas-confetti';
import { Download, Upload, RefreshCw, CheckCircle, GitBranch } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Sync to local storage whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Capture PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K or Ctrl + ` opens terminal
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === '`')) {
        e.preventDefault();
        sound.playClick();
        setIsTerminalOpen(prev => !prev);
      }
      // Ctrl + M or Ctrl + N opens task modal
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        sound.playClick();
        setIsTaskModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsTerminalOpen(false);
        setIsTaskModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reward XP
  const addXp = (amount) => {
    setData(prev => {
      const newXp = prev.profile.xp + amount;
      let newLevel = prev.profile.level;
      let nextLevelXp = prev.profile.nextLevelXp;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 750;
        sound.playSuccess();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          xp: newXp,
          level: newLevel,
          nextLevelXp
        }
      };
    });
  };

  // Task Handlers
  const handleAddTask = (newTask) => {
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    addXp(newTask.xpReward || 50);
  };

  const handleUpdateTask = (updatedTask) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  const handleDeleteTask = (taskId) => {
    sound.playClick();
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  // LeetCode Handlers
  const handleAddProblem = (prob) => {
    setData(prev => ({
      ...prev,
      leetcode: [prob, ...prev.leetcode]
    }));
    addXp(prob.difficulty === 'Hard' ? 120 : prob.difficulty === 'Medium' ? 70 : 40);
  };

  const handleDeleteProblem = (id) => {
    sound.playClick();
    setData(prev => ({
      ...prev,
      leetcode: prev.leetcode.filter(p => p.id !== id)
    }));
  };

  // Notes Handlers
  const handleAddNote = (note) => {
    setData(prev => ({
      ...prev,
      quickNotes: [note, ...prev.quickNotes]
    }));
  };

  const handleDeleteNote = (id) => {
    sound.playClick();
    setData(prev => ({
      ...prev,
      quickNotes: prev.quickNotes.filter(n => n.id !== id)
    }));
  };

  // Export / Import
  const handleExportData = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexus-cs-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.profile && parsed.tasks) {
            setData(parsed);
            sound.playSuccess();
            alert('تم استيراد البيانات بنجاح!');
          }
        } catch (err) {
          alert('خطأ في قراءة ملف الـ JSON');
        }
      };
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    } else {
      alert('لتثبيت التطبيق على جهازك:\n- من متصفح Chrome أو Edge: اضغط على أيقونة التثبيت (⊕) في شريط العنوان أعلى المتصفح، أو اختر من القائمة "Install NexusCS as App" ليفتح معك كنافذة مستقلة بدون شريط متصفح!');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-400">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={data.profile}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onToggleTerminal={() => setIsTerminalOpen(prev => !prev)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        installPrompt={deferredPrompt}
        onInstallApp={handleInstallApp}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
        {currentTab === 'dashboard' && (
          <CommandCenter
            data={data}
            onNavigate={(tab) => {
              sound.playClick();
              setCurrentTab(tab);
            }}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksView
            data={data}
            onAddTask={() => setIsTaskModalOpen(true)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'academic' && (
          <AcademicHub
            data={data}
          />
        )}

        {currentTab === 'leetcode' && (
          <LeetCodeTracker
            data={data}
            onAddProblem={handleAddProblem}
            onDeleteProblem={handleDeleteProblem}
          />
        )}

        {currentTab === 'focus' && (
          <PomodoroFocus
            data={data}
            onAddFocusXp={addXp}
          />
        )}

        {currentTab === 'scratchpad' && (
          <ScratchpadView
            data={data}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">NEXUS-CS Mission Control</span>
            <span>• تم التصميم لمهندسي علوم الحاسب</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
              title="تصدير نسخة احتياطية من مهامك"
            >
              <Download className="h-3.5 w-3.5" />
              <span>تصدير نسخة (JSON Backup)</span>
            </button>

            <label className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              <span>استيراد بيانات</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>

            <span className="text-slate-600">|</span>

            <span className="text-slate-500 font-mono">
              Shortcuts: <kbd className="rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">Ctrl+K</kbd> CLI • <kbd className="rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">Ctrl+M</kbd> New Task
            </span>
          </div>
        </div>
      </footer>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        courses={data.courses}
        onSaveTask={handleAddTask}
      />

      {/* Interactive CLI Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        data={data}
        onAddTask={handleAddTask}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
    </div>
  );
}

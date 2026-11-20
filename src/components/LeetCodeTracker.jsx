import React, { useState, useMemo } from 'react';
import { 
  Brain, Plus, ExternalLink, CheckCircle, Code, 
  Sparkles, Filter, Search, Award, Flame, BookOpen, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioSynth';

const COMMON_PATTERNS = [
  'All',
  'Array / Hash Map',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Graph / BFS-DFS',
  'Dynamic Programming (1D)',
  'Dynamic Programming (2D)',
  'Trees / BST',
  'Design / Doubly LinkedList + Map',
  'Backtracking',
  'Monotonic Stack'
];

export default function LeetCodeTracker({ 
  data, 
  onAddProblem, 
  onDeleteProblem 
}) {
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterPattern, setFilterPattern] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New problem form state
  const [newProblem, setNewProblem] = useState({
    title: '',
    difficulty: 'Medium',
    pattern: 'Array / Hash Map',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    notes: '',
    link: ''
  });

  const easyCount = useMemo(() => data.leetcode.filter(p => p.difficulty === 'Easy').length, [data.leetcode]);
  const mediumCount = useMemo(() => data.leetcode.filter(p => p.difficulty === 'Medium').length, [data.leetcode]);
  const hardCount = useMemo(() => data.leetcode.filter(p => p.difficulty === 'Hard').length, [data.leetcode]);
  const totalCount = data.leetcode.length;

  const filteredProblems = useMemo(() => {
    return data.leetcode.filter(p => {
      const matchDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
      const matchPattern = filterPattern === 'All' || p.pattern.toLowerCase().includes(filterPattern.toLowerCase());
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiff && matchPattern && matchSearch;
    });
  }, [data.leetcode, filterDifficulty, filterPattern, searchQuery]);

  const handleSaveProblem = (e) => {
    e.preventDefault();
    if (!newProblem.title) return;
    sound.playSuccess();
    confetti({ particleCount: 40, spread: 50 });

    onAddProblem({
      id: 'lc_' + Date.now(),
      ...newProblem,
      completedDate: new Date().toISOString().split('T')[0]
    });

    setNewProblem({
      title: '',
      difficulty: 'Medium',
      pattern: 'Array / Hash Map',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: '',
      link: ''
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
              ALGORITHMS & PROBLEM SOLVING
            </span>
            <span className="text-xs text-slate-400">سجل إتقان الخوارزميات ومسائل LeetCode</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-white">متتبع مسائل البرمجة التنافسية (LeetCode Hub)</h2>
        </div>

        <button
          onClick={() => { sound.playClick(); setIsAdding(true); }}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          <span>توثيق مسألة جديدة</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Total Solved */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">إجمالي المسائل المحلولة</span>
          <div className="mt-2 font-mono text-3xl font-black text-white">{totalCount}</div>
          <div className="mt-2 text-[11px] text-slate-500">مسائل موثقة بالكامل مع الـ Complexity</div>
        </div>

        {/* Easy */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Easy (سهل)</span>
            <span className="font-mono">{easyCount}</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-black text-emerald-400">{easyCount}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div 
              className="h-full bg-emerald-400"
              style={{ width: `${totalCount ? (easyCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Medium */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Medium (متوسط)</span>
            <span className="font-mono">{mediumCount}</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-black text-amber-400">{mediumCount}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div 
              className="h-full bg-amber-400"
              style={{ width: `${totalCount ? (mediumCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Hard */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold">
            <span>Hard (صعب)</span>
            <span className="font-mono">{hardCount}</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-black text-rose-400">{hardCount}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div 
              className="h-full bg-rose-500"
              style={{ width: `${totalCount ? (hardCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Problem Modal / Drawer */}
      {isAdding && (
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">تسجيل مسألة جديدة في الـ Log</h3>
            <button 
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              إلغاء ✕
            </button>
          </div>

          <form onSubmit={handleSaveProblem} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs text-slate-400">اسم ورقم المسألة</label>
              <input
                type="text"
                required
                value={newProblem.title}
                onChange={e => setNewProblem({ ...newProblem, title: e.target.value })}
                placeholder="e.g. 15. 3Sum"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">مستوى الصعوبة</label>
              <select
                value={newProblem.difficulty}
                onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">النمط الخوارزمي (Pattern)</label>
              <input
                type="text"
                value={newProblem.pattern}
                onChange={e => setNewProblem({ ...newProblem, pattern: e.target.value })}
                placeholder="e.g. Two Pointers / DP"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Time Complexity</label>
              <input
                type="text"
                value={newProblem.timeComplexity}
                onChange={e => setNewProblem({ ...newProblem, timeComplexity: e.target.value })}
                placeholder="e.g. O(N log N)"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Space Complexity</label>
              <input
                type="text"
                value={newProblem.spaceComplexity}
                onChange={e => setNewProblem({ ...newProblem, spaceComplexity: e.target.value })}
                placeholder="e.g. O(1)"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">رابط المسألة (LeetCode URL)</label>
              <input
                type="url"
                value={newProblem.link}
                onChange={e => setNewProblem({ ...newProblem, link: e.target.value })}
                placeholder="https://leetcode.com/problems/..."
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs text-slate-400">الملاحظات وفكرة الحل (Intuition & Key Insight)</label>
              <textarea
                rows={2}
                value={newProblem.notes}
                onChange={e => setNewProblem({ ...newProblem, notes: e.target.value })}
                placeholder="اشرح الفكرة الأساسية وازاي تجنبت TLE أو الأخطاء الشائعة..."
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                حفظ المسألة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">الصعوبة:</span>
          {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
            <button
              key={diff}
              onClick={() => { sound.playClick(); setFilterDifficulty(diff); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filterDifficulty === diff
                  ? diff === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    diff === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    diff === 'Hard' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الملاحظات..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 py-1.5 pr-8 pl-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Problems Table / Cards */}
      <div className="space-y-3">
        {filteredProblems.map(prob => (
          <div 
            key={prob.id}
            className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/90"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                  prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                  prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  {prob.difficulty}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {prob.title}
                    </h4>
                    {prob.link && (
                      <a 
                        href={prob.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-slate-500 hover:text-emerald-400"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300">
                      {prob.pattern}
                    </span>
                    <span className="font-mono text-[10px] text-slate-300">
                      Time: <strong className="text-white">{prob.timeComplexity}</strong>
                    </span>
                    <span className="font-mono text-[10px] text-slate-300">
                      Space: <strong className="text-white">{prob.spaceComplexity}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="font-mono text-[11px] text-slate-500">{prob.completedDate}</span>
                <button
                  onClick={() => onDeleteProblem(prob.id)}
                  title="حذف"
                  className="rounded p-1 text-slate-600 hover:bg-rose-950/30 hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Notes Intuition */}
            {prob.notes && (
              <div className="mt-3 rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5 text-xs text-slate-300">
                <strong className="text-emerald-400 font-mono">Intuition: </strong>
                {prob.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

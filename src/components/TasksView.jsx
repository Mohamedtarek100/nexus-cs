import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, Plus, Filter, Search, Calendar, Tag, CheckCircle2, 
  Clock, AlertCircle, Sparkles, ChevronDown, Check, Trash2, Edit3,
  Layers, LayoutGrid, ListFilter, ArrowRight, BookOpen, Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioSynth';

export default function TasksView({ 
  data, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onCompleteTask 
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'matrix' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredTasks = useMemo(() => {
    return data.tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCourse = selectedCourse === 'all' || task.courseId === selectedCourse;
      const matchType = selectedType === 'all' || task.type === selectedType;
      const matchPriority = selectedPriority === 'all' || task.priority === selectedPriority;

      return matchSearch && matchCourse && matchType && matchPriority;
    });
  }, [data.tasks, searchQuery, selectedCourse, selectedType, selectedPriority]);

  const handleStatusChange = (taskId, newStatus) => {
    sound.playClick();
    if (newStatus === 'done') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      sound.playSuccess();
    }
    const task = data.tasks.find(t => t.id === taskId);
    if (task) {
      onUpdateTask({ ...task, status: newStatus });
    }
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    sound.playClick();
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) return;
    const nextSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const allDone = nextSubtasks.every(st => st.completed);
    onUpdateTask({
      ...task,
      subtasks: nextSubtasks,
      status: allDone && task.status !== 'done' ? 'review' : task.status
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">عاجل جداً (Critical)</span>;
      case 'high':
        return <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">مرتفع (High)</span>;
      case 'medium':
        return <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">متوسط (Medium)</span>;
      default:
        return <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">عادي (Low)</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'assignment': return 'تكليف شيت';
      case 'lab': return 'لاب عملي';
      case 'project': return 'مشروع كود';
      case 'study': return 'مذاكرة وتلخيص';
      case 'dev': return 'تطوير شخصي';
      default: return 'مهمة';
    }
  };

  const getCourse = (courseId) => {
    return data.courses.find(c => c.id === courseId);
  };

  // Columns for Kanban
  const kanbanColumns = [
    { id: 'backlog', title: 'قائمة الانتظار (Backlog)', color: 'border-slate-700' },
    { id: 'in-progress', title: 'قيد التنفيذ والبرمجة (In Progress)', color: 'border-cyan-500/50' },
    { id: 'review', title: 'مراجعة وتست الكود (Code Review)', color: 'border-purple-500/50' },
    { id: 'done', title: 'تم الإنجاز والتسليم (Completed)', color: 'border-emerald-500/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">إدارة المهام ومشاريع الكود (CS Tasks Hub)</h2>
          <p className="text-xs text-slate-400">متابعة تسليمات الكلية، معامل البرمجة، والـ Sprints الشخصية</p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => { sound.playClick(); setViewMode('kanban'); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>كانبان (Kanban)</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setViewMode('matrix'); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'matrix' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>مصفوفة الأولويات (Eisenhower)</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setViewMode('list'); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>قائمة تفصيلية</span>
            </button>
          </div>

          <button
            onClick={() => { sound.playClick(); onAddTask(); }}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            <span>مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالعنوان، التاج، أو الكود..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 py-1.5 pr-9 pl-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Course Filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">كل المواد الأكاديمية</option>
          {data.courses.map(c => (
            <option key={c.id} value={c.id}>{c.code} - {c.name.split('(')[0]}</option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">كل الأنواع (شيت، لاب، مشروع...)</option>
          <option value="assignment">تكليفات وشيتات</option>
          <option value="lab">تجارب ومعامل برمجية</option>
          <option value="project">مشاريع برمجية</option>
          <option value="dev">تطوير شخصي وبورتفوليو</option>
          <option value="study">مذاكرة ومراجعة</option>
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">كل درجات الأهمية</option>
          <option value="critical">عاجل جداً (Critical)</option>
          <option value="high">مرتفع (High)</option>
          <option value="medium">متوسط (Medium)</option>
          <option value="low">عادي (Low)</option>
        </select>
      </div>

      {/* Render View Mode */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div 
                key={col.id} 
                className={`flex flex-col rounded-2xl border ${col.color} bg-slate-900/40 p-4 min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="mb-3 flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <h3 className="text-xs font-bold text-slate-200">{col.title}</h3>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-600">
                      لا توجد مهام في هذه المرحلة
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const course = getCourse(task.courseId);
                      const completedCount = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
                      const totalCount = task.subtasks ? task.subtasks.length : 0;
                      const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                      return (
                        <div 
                          key={task.id}
                          className="group rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 shadow-sm transition-all hover:border-slate-700 hover:shadow-md"
                        >
                          {/* Card Meta */}
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              {course ? (
                                <span 
                                  className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                                  style={{ backgroundColor: `${course.color}20`, color: course.color }}
                                >
                                  {course.code}
                                </span>
                              ) : (
                                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                                  عام
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                {getTypeBadge(task.type)}
                              </span>
                            </div>
                            {getPriorityBadge(task.priority)}
                          </div>

                          {/* Title */}
                          <h4 className="mt-2 text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {task.title}
                          </h4>

                          {/* Description if any */}
                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">
                              {task.description}
                            </p>
                          )}

                          {/* Subtasks Progress */}
                          {totalCount > 0 && (
                            <div className="mt-2.5">
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>الخطوات: {completedCount}/{totalCount}</span>
                                <span className="font-mono">{Math.round(progressPct)}%</span>
                              </div>
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                <div 
                                  className="h-full bg-cyan-400 transition-all"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>

                              {/* Subtask checklist toggles */}
                              <div className="mt-2 space-y-1">
                                {task.subtasks.map(st => (
                                  <label 
                                    key={st.id} 
                                    className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-300 hover:text-white"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={st.completed}
                                      onChange={() => handleToggleSubtask(task.id, st.id)}
                                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                                    />
                                    <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                      {st.text}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {task.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 border border-slate-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Due Date & Status Action */}
                          <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="h-3 w-3 text-cyan-400" />
                              {task.dueDate || 'بلا موعد'}
                            </span>

                            <div className="flex items-center gap-1">
                              {col.id !== 'backlog' && (
                                <button
                                  onClick={() => handleStatusChange(task.id, col.id === 'done' ? 'review' : col.id === 'review' ? 'in-progress' : 'backlog')}
                                  title="رجوع للمرحلة السابقة"
                                  className="rounded p-1 hover:bg-slate-800 hover:text-white"
                                >
                                  ←
                                </button>
                              )}
                              {col.id !== 'done' && (
                                <button
                                  onClick={() => handleStatusChange(task.id, col.id === 'backlog' ? 'in-progress' : col.id === 'in-progress' ? 'review' : 'done')}
                                  title="نقل للمرحلة التالية"
                                  className="rounded p-1 text-cyan-400 hover:bg-cyan-950/40"
                                >
                                  →
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  onDeleteTask(task.id);
                                }}
                                title="حذف المهمة"
                                className="rounded p-1 text-slate-600 hover:bg-rose-950/30 hover:text-rose-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Eisenhower Matrix View */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Quadrant 1: Urgent & Important */}
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/10 p-4">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <h3 className="font-bold text-rose-300 text-sm">1. عاجل ومهم (Do First - نفذ فوراً)</h3>
              <span className="text-xs text-rose-400">تسليمات الكلية القريبة والمشاريع الحرجة</span>
            </div>
            <div className="mt-3 space-y-2">
              {filteredTasks
                .filter(t => t.status !== 'done' && (t.priority === 'critical' || t.priority === 'high'))
                .map(t => (
                  <div key={t.id} className="rounded-lg border border-rose-500/20 bg-slate-950/60 p-2.5 text-xs">
                    <div className="font-bold text-white">{t.title}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{t.category}</span>
                      <span className="text-rose-400">{t.dueDate}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 2: Important Not Urgent */}
          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/10 p-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <h3 className="font-bold text-cyan-300 text-sm">2. مهم غير عاجل (Schedule - خطط له)</h3>
              <span className="text-xs text-cyan-400">تطوير المهارات، حل LeetCode، مشاريع البورتفوليو</span>
            </div>
            <div className="mt-3 space-y-2">
              {filteredTasks
                .filter(t => t.status !== 'done' && t.priority === 'medium')
                .map(t => (
                  <div key={t.id} className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-2.5 text-xs">
                    <div className="font-bold text-white">{t.title}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{t.category}</span>
                      <span className="text-cyan-400">{t.dueDate}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 3: Urgent Not Important */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/10 p-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <h3 className="font-bold text-amber-300 text-sm">3. عاجل غير مهم (Delegate / Simplify)</h3>
              <span className="text-xs text-amber-400">تسجيلات الحضور، استمارات، روتين</span>
            </div>
            <div className="mt-3 space-y-2">
              {filteredTasks
                .filter(t => t.status !== 'done' && t.priority === 'low')
                .map(t => (
                  <div key={t.id} className="rounded-lg border border-amber-500/20 bg-slate-950/60 p-2.5 text-xs">
                    <div className="font-bold text-white">{t.title}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{t.category}</span>
                      <span className="text-amber-400">{t.dueDate}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 4: Completed Tasks */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/10 p-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <h3 className="font-bold text-emerald-300 text-sm">4. تم إنجازه بنجاح (Archive & Done)</h3>
              <span className="text-xs text-emerald-400">سجل الإنجازات والـ XP المكتسب</span>
            </div>
            <div className="mt-3 space-y-2">
              {filteredTasks
                .filter(t => t.status === 'done')
                .map(t => (
                  <div key={t.id} className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-2.5 text-xs opacity-75">
                    <div className="font-bold line-through text-slate-400">{t.title}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-400">
                      <span>+{t.xpReward} XP</span>
                      <span>مكتمل ✓</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* List Detailed View */}
      {viewMode === 'list' && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <tr>
                <th className="p-3.5">المهمة / التكليف</th>
                <th className="p-3.5">المادة</th>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">الأولوية</th>
                <th className="p-3.5">تاريخ الاستحقاق</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.map(task => {
                const course = getCourse(task.courseId);
                return (
                  <tr key={task.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-white">
                      {task.title}
                      {task.tags && (
                        <div className="mt-1 flex gap-1">
                          {task.tags.map(t => (
                            <span key={t} className="rounded bg-slate-800 px-1 py-0.2 text-[9px] text-slate-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-cyan-400">
                      {course ? course.code : 'عام'}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {getTypeBadge(task.type)}
                    </td>
                    <td className="p-3.5">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {task.dueDate}
                    </td>
                    <td className="p-3.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        task.status === 'done' ? 'bg-emerald-500/20 text-emerald-300' :
                        task.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-300' :
                        task.status === 'review' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleStatusChange(task.id, task.status === 'done' ? 'backlog' : 'done')}
                        className="rounded p-1.5 text-emerald-400 hover:bg-emerald-950/40"
                        title={task.status === 'done' ? 'إعادة فتح' : 'تعليم كمكتمل'}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="rounded p-1.5 text-rose-400 hover:bg-rose-950/40"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

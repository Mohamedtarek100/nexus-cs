import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Tag, CheckSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioSynth';

export default function TaskModal({ isOpen, onClose, courses, onSaveTask }) {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [type, setType] = useState('assignment');
  const [priority, setPriority] = useState('high');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('C++, Linux');
  const [subtasks, setSubtasks] = useState([
    { id: '1', text: 'كتابة الـ Code وتطبيق المنطق المطلوب', completed: false },
    { id: '2', text: 'عمل Test Cases والتحقق من الـ Edge Cases', completed: false },
    { id: '3', text: 'تسليم التقرير أو رفع المشروع على GitHub', completed: false }
  ]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    sound.playClick();
    setSubtasks(prev => [
      ...prev,
      { id: Date.now().toString(), text: newSubtaskText.trim(), completed: false }
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    sound.playClick();
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    sound.playSuccess();
    confetti({ particleCount: 40, spread: 50 });

    const tagsArray = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    const newTask = {
      id: 'task_' + Date.now(),
      title: title.trim(),
      courseId: courseId === 'none' ? null : courseId,
      type,
      priority,
      status: 'in-progress',
      dueDate,
      description: description.trim(),
      tags: tagsArray,
      points: 10,
      xpReward: priority === 'critical' ? 150 : priority === 'high' ? 100 : 70,
      subtasks
    };

    onSaveTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">إضافة مهمة أو تكليف جديد (New CS Mission)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-bold text-slate-300">عنوان المهمة / المشروع / الشيت:</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: تسليم لاب 3 خوارزميات Dijkstra أو مشروع الـ Web..."
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Grid row: Course, Type, Priority */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="font-bold text-slate-300">المقرر الدراسي:</label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="none">عام / مشروع شخصي</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name.split('(')[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300">النوع:</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="assignment">تكليف شيت</option>
                <option value="lab">لاب عملي</option>
                <option value="project">مشروع برمجي</option>
                <option value="dev">تطوير شخصي</option>
                <option value="study">مذاكرة ومراجعة</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300">الأولوية:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="critical">عاجل جداً (Critical)</option>
                <option value="high">مرتفع (High)</option>
                <option value="medium">متوسط (Medium)</option>
                <option value="low">عادي (Low)</option>
              </select>
            </div>
          </div>

          {/* Grid row: Due Date & Tags */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-bold text-slate-300">تاريخ التسليم / الاستحقاق:</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300">التاجات والتقنيات (مفصولة بفواصل):</label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="C++, Linux, Docker, Python..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-300">تفاصيل وملاحظات التسليم:</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="اكتب المعايير المطلوبة أو الملاحظات الهامة..."
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="font-bold text-slate-300">خطوات التنفيذ (Subtasks Checklist):</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={e => setNewSubtaskText(e.target.value)}
                placeholder="إضافة خطوة..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="rounded-lg bg-slate-800 px-3 py-1 font-bold text-cyan-400 hover:bg-slate-700"
              >
                + إضافة
              </button>
            </div>

            <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-[11px] text-slate-300">
                  <span>• {st.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95"
            >
              حفظ المهمة الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

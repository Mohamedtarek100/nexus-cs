import React, { useState } from 'react';
import { FileText, Plus, Copy, Check, Trash2, Code, Terminal, Sparkles } from 'lucide-react';
import { sound } from '../utils/audioSynth';

export default function ScratchpadView({ data, onAddNote, onDeleteNote }) {
  const [copiedId, setCopiedId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCopy = (id, content) => {
    sound.playClick();
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    sound.playSuccess();
    onAddNote({
      id: 'note_' + Date.now(),
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0]
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
              DEV SCRATCHPAD
            </span>
            <span className="text-xs text-slate-400">سجل الأوامر، الأكواد السريعة، والملاحظات</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-white">الملاحظات والاسكراتش باد البرمجية</h2>
        </div>

        <button
          onClick={() => { sound.playClick(); setIsAdding(true); }}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400"
        >
          <Plus className="h-4 w-4" />
          <span>ملاحظة / كود جديد</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-5 shadow-2xl">
          <h3 className="text-sm font-bold text-white">إضافة ملاحظة أو مقتطف كود جديد:</h3>
          <div className="mt-3 space-y-3">
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="عنوان الملاحظة أو اسم الكود..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <textarea
              required
              rows={5}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="اكتب المحتوى أو الأوامر هنا (يدعم أكواد وتنسيقات متعددة)..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                حفظ
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.quickNotes.map(note => (
          <div 
            key={note.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <h4 className="font-bold text-white text-sm">{note.title}</h4>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(note.id, note.content)}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:text-white"
                    title="نسخ المحتوى"
                  >
                    {copiedId === note.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedId === note.id ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="rounded p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950/80 p-3 font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                {note.content}
              </pre>
            </div>

            <div className="mt-3 text-left font-mono text-[10px] text-slate-500">
              {note.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

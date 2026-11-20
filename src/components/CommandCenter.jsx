import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, Clock, Calendar, CheckCircle2, Flame, Award, 
  Code, BookOpen, Brain, Terminal, ArrowUpRight, TrendingUp, 
  FileCode, Sparkles, Target, ShieldCheck, Compass
} from 'lucide-react';
import { sound } from '../utils/audioSynth';

const csQuotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "There are only two hard things in Computer Science: cache invalidation and naming things.", author: "Phil Karlton" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" }
];

export default function CommandCenter({ 
  data, 
  onNavigate, 
  onOpenTaskModal, 
  onToggleTaskComplete 
}) {
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * csQuotes.length));

  // Compute stats
  const pendingTasks = useMemo(() => data.tasks.filter(t => t.status !== 'done'), [data.tasks]);
  const completedTasks = useMemo(() => data.tasks.filter(t => t.status === 'done'), [data.tasks]);
  
  // Urgent tasks (due within 48h)
  const urgentTasks = useMemo(() => {
    const now = new Date().getTime();
    return pendingTasks.filter(t => {
      if (!t.dueDate) return false;
      const dueTime = new Date(t.dueDate).getTime();
      const diffHours = (dueTime - now) / (1000 * 60 * 60);
      return diffHours <= 48 && diffHours >= -24;
    });
  }, [pendingTasks]);

  // Exam / Milestone countdowns
  const upcomingDeadlines = useMemo(() => {
    const items = [
      ...data.tasks.filter(t => t.status !== 'done').map(t => ({
        id: t.id,
        title: t.title,
        type: t.type === 'project' ? 'مشروع عملي' : t.type === 'assignment' ? 'تكليف شيت' : 'لاب عملي',
        date: t.dueDate,
        priority: t.priority,
        courseId: t.courseId
      })),
      ...data.exams.map(e => ({
        id: e.id,
        title: e.title,
        type: 'امتحان ميتيرم/نهائي',
        date: e.date,
        priority: 'critical',
        courseId: e.courseId
      }))
    ];

    return items
      .filter(item => item.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [data.tasks, data.exams]);

  // LeetCode Solved Count
  const leetcodeCount = data.leetcode.length;

  const getCourseName = (courseId) => {
    const c = data.courses.find(item => item.id === courseId);
    return c ? c.code : 'عام';
  };

  const getRemainingDays = (dateStr) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'اليوم!';
    if (diffDays === 1) return 'غداً!';
    if (diffDays < 0) return 'فات الموعد!';
    return `باقي ${diffDays} أيام`;
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & CS Quote Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-[#0b1220] to-[#0c1a2e] p-5 shadow-xl">
        <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
                &gt; USER: {data.profile.name}
              </span>
              <span className="text-xs text-slate-400">
                {data.profile.university}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-white md:text-2xl">
              أهلاً بك في غرفة القيادة يا باشمهندس 🚀
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              لديك <span className="font-bold text-cyan-400">{pendingTasks.length} مهام وتكليفات قيد التنفيذ</span>، منها{' '}
              <span className="font-bold text-rose-400">{urgentTasks.length} مهام عاجلة</span> خلال الـ 48 ساعة القادمة.
            </p>
          </div>

          {/* Quote Card */}
          <div className="max-w-md rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-cyan-400">
                <Code className="h-3 w-3" /> CS Quote of the Day
              </span>
              <button 
                onClick={() => setQuoteIndex((prev) => (prev + 1) % csQuotes.length)}
                className="hover:text-cyan-300"
              >
                تغيير ↻
              </button>
            </div>
            <p className="mt-1.5 font-mono text-xs italic text-slate-200">
              "{csQuotes[quoteIndex].text}"
            </p>
            <p className="mt-1 text-right font-mono text-[10px] text-slate-400">
              — {csQuotes[quoteIndex].author}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Pending Tasks */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">المهام والتكليفات النشطة</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-white">{pendingTasks.length}</span>
            <span className="text-xs text-slate-400">من أصل {data.tasks.length}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-cyan-400 group-hover:underline">
            <span>عرض كل المهام</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Metric 2: Urgent Deadlines */}
        <div 
          onClick={() => onNavigate('tasks')}
          className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all ${
            urgentTasks.length > 0 
              ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500/70 hover:shadow-lg hover:shadow-rose-500/20' 
              : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">تسليمات الـ 48 ساعة</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${urgentTasks.length > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`font-mono text-3xl font-black ${urgentTasks.length > 0 ? 'text-rose-400' : 'text-white'}`}>
              {urgentTasks.length}
            </span>
            <span className="text-xs text-slate-400">تكليف عاجل</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {urgentTasks.length > 0 ? 'تحتاج إلى إنهاء كود الاختبار فوراً!' : 'لا توجد ضغوط عاجلة اليوم'}
          </p>
        </div>

        {/* Metric 3: Academic GPA */}
        <div 
          onClick={() => onNavigate('academic')}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">المعدل التراكمي (GPA)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-indigo-300">{data.profile.currentGpa.toFixed(2)}</span>
            <span className="text-xs text-slate-400">الهدف: {data.profile.targetGpa.toFixed(2)} / 4.00</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-indigo-400 group-hover:underline">
            <span>حاسبة الدرجات والمواد</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Metric 4: LeetCode & Problem Solving */}
        <div 
          onClick={() => onNavigate('leetcode')}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">مسائل خوارزميات محلولة</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Brain className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-emerald-400">{leetcodeCount}</span>
            <span className="text-xs text-slate-400">LeetCode Solved</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-400 group-hover:underline">
            <span>سجل مسائل البرمجة</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines + Quick Priority Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Urgent Radar & Active Sprints */}
        <div className="space-y-6 lg:col-span-2">
          {/* Radar Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-white">رادار المواعيد القادمة والتسليمات (Deadlines Radar)</h3>
              </div>
              <button 
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                عرض الجدول الزمني الكامل ←
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <ShieldCheck className="mx-auto h-8 w-8 text-emerald-400/40" />
                  <p className="mt-2 text-sm">أنت في السليم! لا توجد مواعيد تسليم قريبة.</p>
                </div>
              ) : (
                upcomingDeadlines.map((item) => {
                  const rem = getRemainingDays(item.date);
                  const isUrgent = rem.includes('اليوم') || rem.includes('غداً');
                  return (
                    <div 
                      key={item.id}
                      className={`flex flex-col justify-between gap-3 rounded-xl border p-3.5 transition-all sm:flex-row sm:items-center ${
                        isUrgent 
                          ? 'border-rose-500/40 bg-rose-950/20 shadow-sm shadow-rose-500/10' 
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-md px-2 py-1 font-mono text-[10px] font-bold ${
                          isUrgent ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-cyan-300'
                        }`}>
                          {getCourseName(item.courseId)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                          <span className="text-[11px] text-slate-400">{item.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-left font-mono text-xs">
                          <span className={`rounded-full px-2.5 py-0.5 font-bold ${
                            isUrgent ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {rem}
                          </span>
                          <div className="mt-0.5 text-[10px] text-slate-400">{item.date}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* GitHub-Style Developer Activity Heatmap */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-white">نشاط الإنجاز والبرمجة (CS Dev Heatmap)</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">آخر 16 أسبوع</span>
            </div>

            <div className="mt-4 overflow-x-auto pb-2">
              <div className="flex min-w-[500px] gap-1.5">
                {Array.from({ length: 16 }).map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1.5">
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      // deterministic mock activity based on seeds
                      const val = (colIdx * 3 + rowIdx * 5 + 7) % 5;
                      let bg = 'bg-slate-800/40';
                      if (val === 1) bg = 'bg-emerald-900/40 border border-emerald-700/30';
                      if (val === 2) bg = 'bg-emerald-700/60';
                      if (val === 3) bg = 'bg-emerald-500';
                      if (val === 4) bg = 'bg-emerald-400 shadow-sm shadow-emerald-400/40';
                      return (
                        <div
                          key={rowIdx}
                          title={`نشاط CS: مستوى ${val}`}
                          className={`h-3 w-3 rounded-xs ${bg} transition-transform hover:scale-125`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>أقل نشاط</span>
                <div className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-slate-800/60"></span>
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-900/60"></span>
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-700"></span>
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500"></span>
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-400"></span>
                </div>
                <span>أعلى نشاط برمجيات وكود</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Quick Launcher & Focus Tracker */}
        <div className="space-y-6">
          {/* Quick Launchpad */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <h3 className="font-bold text-white">الوصول السريع (Quick Operations)</h3>
            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenTaskModal();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-right text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500/40 hover:bg-cyan-950/20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold">تسجيل تكليف أو مشروع كود</p>
                    <p className="text-[10px] text-slate-400">إضافة معايير التسليم وتاريخ الاستحقاق</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('focus');
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-right text-xs font-semibold text-slate-200 transition-all hover:border-purple-500/40 hover:bg-purple-950/20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold">جلسة تركيز عميق (Cyber Pomodoro)</p>
                    <p className="text-[10px] text-slate-400">مع مولد الصوت المحيطي Binaural Focus</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('leetcode');
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-right text-xs font-semibold text-slate-200 transition-all hover:border-emerald-500/40 hover:bg-emerald-950/20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold">حل مسألة LeetCode اليومية</p>
                    <p className="text-[10px] text-slate-400">توثيق الحل والـ Time Complexity</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Current Semester Courses Quick Overview */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h3 className="font-bold text-white">مواد الترم الحالي</h3>
              <button 
                onClick={() => onNavigate('academic')}
                className="text-xs text-cyan-400 hover:underline"
              >
                إدارة
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-800/40">
              {data.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: course.color }}
                    />
                    <div>
                      <p className="font-bold text-slate-200">{course.code}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{course.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {course.credits} Cr
                    </span>
                    <span className="font-bold text-cyan-400">{course.currentGrade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

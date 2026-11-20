import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Plus, ExternalLink, Calendar, User, Clock, 
  Award, TrendingUp, AlertTriangle, CheckCircle, Calculator,
  GraduationCap, FileSpreadsheet, Trash2, Edit3
} from 'lucide-react';
import { sound } from '../utils/audioSynth';

const GRADE_POINTS = {
  'A+': 4.0,
  'A': 3.7,
  'A-': 3.4,
  'B+': 3.2,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0
};

export default function AcademicHub({ 
  data, 
  onAddCourse, 
  onUpdateCourse, 
  onDeleteCourse,
  onAddExam,
  onDeleteExam 
}) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'gpa' | 'exams'
  const [courseGrades, setCourseGrades] = useState(() => {
    const map = {};
    data.courses.forEach(c => {
      map[c.id] = c.currentGrade || 'A';
    });
    return map;
  });

  // Calculate projected Semester GPA based on current courseGrades
  const projectedGpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    data.courses.forEach(c => {
      const g = courseGrades[c.id] || 'A';
      const pts = GRADE_POINTS[g] ?? 3.7;
      totalPoints += pts * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '4.00';
  }, [data.courses, courseGrades]);

  const totalCredits = useMemo(() => {
    return data.courses.reduce((acc, curr) => acc + curr.credits, 0);
  }, [data.courses]);

  const handleGradeChange = (courseId, newGrade) => {
    sound.playClick();
    setCourseGrades(prev => ({ ...prev, [courseId]: newGrade }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-mono font-bold text-indigo-400">
              ACADEMIC DIVISION
            </span>
            <span className="text-xs text-slate-400">{data.profile.university}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-white">المركز الأكاديمي وإدارة مواد الكلية</h2>
          <p className="text-xs text-slate-400">
            متابعة المقررات، المحاضرات، السكاشن، ومحاكي الـ GPA التفاعلي
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-slate-800 bg-slate-950/60 p-1">
          <button
            onClick={() => { sound.playClick(); setActiveTab('courses'); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'courses' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>المقررات الدراسية ({data.courses.length})</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('gpa'); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'gpa' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>محاكي الـ GPA</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('exams'); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'exams' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>جدول الامتحانات ({data.exams.length})</span>
          </button>
        </div>
      </div>

      {/* Courses View */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.courses.map(course => {
            const courseTasks = data.tasks.filter(t => t.courseId === course.id);
            const pendingCourseTasks = courseTasks.filter(t => t.status !== 'done');

            return (
              <div 
                key={course.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700 hover:shadow-xl"
              >
                {/* Header Strip */}
                <div 
                  className="absolute top-0 right-0 left-0 h-1.5"
                  style={{ backgroundColor: course.color }}
                />

                <div className="flex items-start justify-between">
                  <div>
                    <span 
                      className="rounded-md px-2 py-0.5 font-mono text-xs font-bold"
                      style={{ backgroundColor: `${course.color}20`, color: course.color }}
                    >
                      {course.code}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {course.name}
                    </h3>
                  </div>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300">
                    {course.credits} ساعات
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>المحاضر: <strong className="text-slate-200">{course.doctor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>المعيد / TA: <strong className="text-slate-200">{course.ta}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>الموعد: {course.schedule}</span>
                  </div>
                </div>

                {/* Syllabus Progress */}
                <div className="mt-4 border-t border-slate-800/60 pt-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>تغطية المنهج (Syllabus)</span>
                    <span className="font-mono">{course.syllabusProgress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${course.syllabusProgress}%`, backgroundColor: course.color }}
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{pendingCourseTasks.length} مهام معلقة</span>
                  </div>

                  {course.driveLink && (
                    <a
                      href={course.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-semibold text-cyan-400 hover:underline"
                    >
                      <span>درايف المادة</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GPA Simulator View */}
      {activeTab === 'gpa' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main GPA Gauge */}
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-6 text-center backdrop-blur-md">
            <h3 className="text-sm font-bold text-indigo-300">المعدل الفصلي المتوقع (Projected SGPA)</h3>
            <div className="mt-4 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-indigo-500/30 bg-slate-950/80 shadow-lg shadow-indigo-500/20">
                <div>
                  <div className="font-mono text-4xl font-black text-white">{projectedGpa}</div>
                  <div className="text-[11px] font-mono text-indigo-400">من 4.00</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-300">
              إجمالي الساعات المسجلة هذا الترم: <span className="font-bold text-white">{totalCredits} ساعات معتمدة</span>
            </p>
            <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-950/40 p-2.5 text-xs text-indigo-200">
              💡 غير التقديرات المتوقعة لكل مادة على اليمين وشوف المعدل بيتغير لحظياً إزاي!
            </div>
          </div>

          {/* Interactive Course Grade Selectors */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 lg:col-span-2">
            <h3 className="font-bold text-white text-sm">توقع تقدير كل مقرر دراسي:</h3>
            <div className="mt-4 divide-y divide-slate-800/60">
              {data.courses.map(course => (
                <div key={course.id} className="flex items-center justify-between py-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">{course.code}</span>
                      <span className="font-bold text-white">{course.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{course.credits} ساعات معتمدة</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">التقدير:</span>
                    <select
                      value={courseGrades[course.id] || 'A'}
                      onChange={(e) => handleGradeChange(course.id, e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 font-mono font-bold text-cyan-300 focus:border-cyan-500 focus:outline-none"
                    >
                      {Object.keys(GRADE_POINTS).map(gr => (
                        <option key={gr} value={gr}>{gr} ({GRADE_POINTS[gr]} pts)</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exams Schedule View */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.exams.map(exam => {
              const course = data.courses.find(c => c.id === exam.courseId);
              return (
                <div 
                  key={exam.id}
                  className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-5 backdrop-blur-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-xs font-bold text-rose-300">
                        {course ? course.code : 'EXAM'}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-white">{exam.title}</h3>
                    </div>
                    <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                      {exam.weight}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-rose-400" />
                      <span>تاريخ الامتحان: <strong className="text-white font-mono">{exam.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-rose-400" />
                      <span>المكان: {exam.location}</span>
                    </div>
                  </div>

                  {exam.topics && exam.topics.length > 0 && (
                    <div className="mt-4 border-t border-rose-500/20 pt-3">
                      <p className="text-xs font-bold text-slate-300">المواضيع المقررة للاختبار:</p>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-slate-400">
                        {exam.topics.map(tp => (
                          <li key={tp}>{tp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

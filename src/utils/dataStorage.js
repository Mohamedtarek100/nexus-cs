// LocalStorage Management with initial CS student template

const STORAGE_KEY = 'nexus_cs_user_data_v1';

export const initialData = {
  profile: {
    name: 'محمد طارق',
    title: 'مهندس برمجيات وعلوم حاسب',
    university: 'كلية الحاسبات والذكاء الاصطناعي',
    level: 7,
    xp: 1450,
    nextLevelXp: 2000,
    currentGpa: 3.78,
    targetGpa: 3.90,
    streakDays: 18,
    todayFocusMinutes: 75,
  },
  courses: [
    {
      id: 'c1',
      code: 'CS201',
      name: 'هياكل البيانات والخوارزميات (Data Structures & Algorithms)',
      credits: 3,
      doctor: 'د. أحمد صبري',
      ta: 'م. عمر كمال',
      schedule: 'الأحد 10:00 ص - قاعة 3',
      color: '#38bdf8',
      driveLink: 'https://drive.google.com',
      currentGrade: 'A',
      syllabusProgress: 75
    },
    {
      id: 'c2',
      code: 'CS204',
      name: 'نظم التشغيل (Operating Systems)',
      credits: 3,
      doctor: 'د. محمود فوزي',
      ta: 'م. سارة علي',
      schedule: 'الإثنين 12:00 م - مدرج 1',
      color: '#a855f7',
      driveLink: 'https://drive.google.com',
      currentGrade: 'A-',
      syllabusProgress: 60
    },
    {
      id: 'c3',
      code: 'CS302',
      name: 'قواعد البيانات المتقدمة (Database Systems)',
      credits: 3,
      doctor: 'د. خالد إبراهيم',
      ta: 'م. نور الدين',
      schedule: 'الأربعاء 02:00 م - معمل 5',
      color: '#10b981',
      driveLink: 'https://drive.google.com',
      currentGrade: 'A+',
      syllabusProgress: 85
    },
    {
      id: 'c4',
      code: 'CS205',
      name: 'شبكات الحاسب (Computer Networks & Protocols)',
      credits: 3,
      doctor: 'د. طارق مصطفى',
      ta: 'م. أحمد نبيل',
      schedule: 'الثلاثاء 09:00 ص - مدرج 4',
      color: '#f59e0b',
      driveLink: 'https://drive.google.com',
      currentGrade: 'B+',
      syllabusProgress: 50
    },
    {
      id: 'c5',
      code: 'CS401',
      name: 'الذكاء الاصطناعي والتعلم الآلي (AI & Machine Learning)',
      credits: 3,
      doctor: 'د. ياسر المنشاوي',
      ta: 'م. حسام حسن',
      schedule: 'الخميس 11:00 ص - قاعة السمينار',
      color: '#ec4899',
      driveLink: 'https://drive.google.com',
      currentGrade: 'A',
      syllabusProgress: 70
    }
  ],
  tasks: [
    {
      id: 't1',
      title: 'تسليم مشروع نظام التشغيل: CPU Scheduling Simulator (C++)',
      courseId: 'c2',
      type: 'project', // assignment | lab | project | study | dev
      category: 'Operating Systems',
      priority: 'critical', // critical | high | medium | low
      status: 'in-progress', // backlog | in-progress | review | done
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
      tags: ['C++', 'Multithreading', 'Linux', 'POSIX'],
      points: 15,
      xpReward: 150,
      description: 'تنفيذ خوارزميات Round Robin, Shortest Job First مع حساب Average Waiting Time و Turnaround Time وعمل تقرير المقارنة.',
      subtasks: [
        { id: 'st1', text: 'برمجة كلاس Process و PCB structure', completed: true },
        { id: 'st2', text: 'تنفيذ خوارزمية FCFS و SJF', completed: true },
        { id: 'st3', text: 'تنفيذ Round Robin مع الـ Quantum timer', completed: false },
        { id: 'st4', text: 'كتابة التقرير وتحليل النتائج البيانية', completed: false }
      ]
    },
    {
      id: 't2',
      title: 'حل Sheet 4: Red-Black Trees & Hash Tables Collision',
      courseId: 'c1',
      type: 'assignment',
      category: 'Data Structures',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['Trees', 'Complexity Analysis', 'Big-O'],
      points: 10,
      xpReward: 100,
      description: 'حل مسائل الـ Rotations بعد الحذف والإضافة وإثبات الـ Height O(log N).',
      subtasks: [
        { id: 'st5', text: 'مسألة 1 و 2 على AVL Trees', completed: true },
        { id: 'st6', text: 'مسألة 3 و 4 على Red-Black Insertion', completed: false },
        { id: 'st7', text: 'مسألة Hash Collisions بـ Quadratic Probing', completed: false }
      ]
    },
    {
      id: 't3',
      title: 'لاب الـ Database: Complex JOINs, Subqueries & Indexes',
      courseId: 'c3',
      type: 'lab',
      category: 'Databases',
      priority: 'medium',
      status: 'backlog',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['PostgreSQL', 'SQL Optimization', 'EXPLAIN ANALYZE'],
      points: 10,
      xpReward: 80,
      description: 'كتابة الـ SQL Queries على قاعدة بيانات E-commerce مع قياس الـ Execution Plan قبل وبعد إنشاء الـ B-Tree Index.',
      subtasks: [
        { id: 'st8', text: 'إنشاء الجداول والـ Foreign Keys', completed: false },
        { id: 'st9', text: 'كتابة 8 استعلامات متقدمة بـ Window Functions', completed: false }
      ]
    },
    {
      id: 't4',
      title: 'تطوير Backend API لمشروع الويب بـ FastAPI و Docker',
      courseId: null,
      type: 'dev',
      category: 'Personal Dev Project',
      priority: 'high',
      status: 'review',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['Python', 'FastAPI', 'Docker', 'JWT Auth'],
      points: 20,
      xpReward: 200,
      description: 'بناء نظام Auth كامل مع JWT Tokens و Refresh Token وتغليف التطبيق داخل Docker Container.',
      subtasks: [
        { id: 'st10', text: 'إعداد الـ Dockerfile و Docker-Compose', completed: true },
        { id: 'st11', text: 'Endpoint الـ Register والـ Login وتشفير كلمات المرور بـ Bcrypt', completed: true },
        { id: 'st12', text: 'كتابة Pytest Unit Tests للـ Endpoints', completed: true }
      ]
    },
    {
      id: 't5',
      title: 'مراجعة شبكات: OSI Model و TCP vs UDP Handshake',
      courseId: 'c4',
      type: 'study',
      category: 'Networks',
      priority: 'low',
      status: 'done',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['Wireshark', 'TCP/IP', 'Subnetting'],
      points: 5,
      xpReward: 60,
      description: 'دراسة حزم Wireshark والـ Three-Way Handshake وحسابات الـ Subnet Masks CIDR.',
      subtasks: [
        { id: 'st13', text: 'تلخيص الـ 7 طبقات في OSI', completed: true },
        { id: 'st14', text: 'حل 5 مسائل Subnetting', completed: true }
      ]
    }
  ],
  leetcode: [
    {
      id: 'lc1',
      title: '1. Two Sum',
      difficulty: 'Easy',
      pattern: 'Hash Table / Array',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      notes: 'استخدام HashMap لتخزين المكمل (target - num) والـ index في خطوة واحدة.',
      completedDate: '2026-11-18',
      link: 'https://leetcode.com/problems/two-sum/'
    },
    {
      id: 'lc2',
      title: '200. Number of Islands',
      difficulty: 'Medium',
      pattern: 'Graph / BFS-DFS',
      timeComplexity: 'O(M*N)',
      spaceComplexity: 'O(M*N)',
      notes: 'المرور على كل خلية تمثل أرض "1"، ثم عمل DFS/BFS لتحويل كل الأراضي المتصلة إلى ماء "0" وزيادة عداد الجزر.',
      completedDate: '2026-11-19',
      link: 'https://leetcode.com/problems/number-of-islands/'
    },
    {
      id: 'lc3',
      title: '146. LRU Cache',
      difficulty: 'Medium',
      pattern: 'Design / Doubly LinkedList + Map',
      timeComplexity: 'O(1) get & put',
      spaceComplexity: 'O(Capacity)',
      notes: 'استخدام Doubly Linked List للتحكم في ترتيب الأحدث استخداماً مع HashMap للوصول الفوري في O(1).',
      completedDate: '2026-11-20',
      link: 'https://leetcode.com/problems/lru-cache/'
    },
    {
      id: 'lc4',
      title: '70. Climbing Stairs',
      difficulty: 'Easy',
      pattern: 'Dynamic Programming (1D)',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: 'مسألة فيبوناتشي: dp[i] = dp[i-1] + dp[i-2]. تم تحسين الذاكرة باستخدام متغيرين فقط.',
      completedDate: '2026-11-17',
      link: 'https://leetcode.com/problems/climbing-stairs/'
    },
    {
      id: 'lc5',
      title: '42. Trapping Rain Water',
      difficulty: 'Hard',
      pattern: 'Two Pointers',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: 'باستخدام Left Pointer و Right Pointer وتتبع max_left و max_right لحساب كمية الماء المحصورة بدقة.',
      completedDate: '2026-11-16',
      link: 'https://leetcode.com/problems/trapping-rain-water/'
    }
  ],
  exams: [
    {
      id: 'e1',
      title: 'امتحان ميتيرم نظم التشغيل (Operating Systems Midterm)',
      courseId: 'c2',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: 'مدرج 2 - الدور الثالث',
      topics: ['Processes & Threads', 'CPU Scheduling', 'Deadlocks', 'Synchronization Semaphores'],
      weight: '20% من الدرجة الكلية'
    },
    {
      id: 'e2',
      title: 'امتحان عملي هياكل البيانات (Data Structures Lab Exam)',
      courseId: 'c1',
      date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: 'معمل الحاسب الرئيسي 2',
      topics: ['C++ STL Implementations', 'Binary Search Trees', 'Heap & Priority Queue'],
      weight: '15% من الدرجة الكلية'
    }
  ],
  quickNotes: [
    {
      id: 'n1',
      title: 'Docker Useful Commands',
      content: '`docker compose up -d --build`\n`docker ps -a`\n`docker exec -it <container_id> /bin/bash`',
      date: '2026-11-19'
    },
    {
      id: 'n2',
      title: 'ملاحظة مهمة من د. أحمد في الخوارزميات',
      content: 'الـ Master Theorem بتيجي دايماً في الامتحان ركز على Case 2 لما f(n) = Theta(n^(log_b a) * log^k n).',
      date: '2026-11-20'
    }
  ]
};

export const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveData(initialData);
      return initialData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read from localStorage', e);
    return initialData;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

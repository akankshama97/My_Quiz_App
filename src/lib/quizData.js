// Default initial quizzes across multiple interesting topics
export const DEFAULT_QUIZZES = [
  {
    id: 'web-dev',
    title: 'Web & React Development',
    category: 'Technology',
    description: 'Test your Next.js, React hooks, and modern frontend skills.',
    difficulty: 'Intermediate',
    icon: '💻',
    questions: [
      {
        id: 1,
        question: "Next.js mein client-side component banane ke liye kaunsi directive use hoti hai?",
        options: ["'use server'", "'use client'", "'use react'", "'use browser'"],
        answer: "'use client'",
        explanation: "'use client' directive file ke sabse upar likhi jaati hai taki Next.js ko pata chale yeh interactive client component hai."
      },
      {
        id: 2,
        question: "React mein functional component mein state manage karne ke liye kaunsa primary hook use hota hai?",
        options: ["useEffect", "useReducer", "useState", "useMemo"],
        answer: "useState",
        explanation: "useState hook React components mein state declare aur update karne ke liye standard hook hai."
      },
      {
        id: 3,
        question: "Tailwind CSS mein flexbox centering ke liye kaunsi classes use hoti hain?",
        options: ["flex items-center justify-center", "display-flex center", "align-center justify-middle", "flexbox-center"],
        answer: "flex items-center justify-center",
        explanation: "flex display set karta hai, items-center cross-axis align karta hai, aur justify-center main-axis par content center karta hai."
      },
      {
        id: 4,
        question: "JavaScript mein '===' aur '==' mein kya mukhya antar hai?",
        options: [
          "'===' type and value dono check karta hai, jabki '==' type conversion karta hai",
          "Dono bilkul same kaam karte hain",
          "'==' zyada secure hai",
          "'===' sirf numbers ke liye hota hai"
        ],
        answer: "'===' type and value dono check karta hai, jabki '==' type conversion karta hai",
        explanation: "Strict equality (===) bina coercion ke value aur type dono match karta hai."
      },
      {
        id: 5,
        question: "Next.js App Router mein page banate waqt har route folder mein kaunsi file honi chahiye?",
        options: ["index.html", "page.js / page.tsx", "route.js", "App.js"],
        answer: "page.js / page.tsx",
        explanation: "App Router convention ke mutabiq har publicly accessible route directory mein page.js/tsx file honi zaroori hai."
      }
    ]
  },
  {
    id: 'general-knowledge',
    title: 'General Knowledge & Science',
    category: 'General',
    description: 'Sharpen your mind with essential science and general knowledge.',
    difficulty: 'Easy',
    icon: '🌍',
    questions: [
      {
        id: 101,
        question: "Duniya ka sabse bada ocean (mahasagar) kaunsa hai?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        answer: "Pacific Ocean",
        explanation: "Pacific Ocean (Prashant Mahasagar) prithvi ka sabse bada aur gehra mahasagar hai."
      },
      {
        id: 102,
        question: "Suraj ki roshni prithvi tak pahunchne mein lagbhag kitna samay leti hai?",
        options: ["2 minute", "8 minute 20 second", "1 ghanta", "Palkon ke jhapkaate hi"],
        answer: "8 minute 20 second",
        explanation: "Light approx 300,000 km/s ki speed se travel karti hai aur ~500 seconds (8 min 20 sec) mein aati hai."
      },
      {
        id: 103,
        question: "Human body mein sabse badi bone (haddi) kaunsi hoti hai?",
        options: ["Femur (Thigh bone)", "Tibia", "Humerus", "Stapes"],
        answer: "Femur (Thigh bone)",
        explanation: "Femur ya thigh bone shareer ki sabse lambi aur mazboot haddi hoti hai."
      }
    ]
  }
];

// LocalStorage helpers
export const STORAGE_KEYS = {
  CUSTOM_QUIZZES: 'quizmaster_custom_quizzes',
  USER_SESSION: 'quizmaster_user',
  QUIZ_HISTORY: 'quizmaster_history'
};

export function getCustomQuestions() {
  if (typeof window === 'undefined') return [];
  try {
    // Also check legacy key for backward compatibility
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES) || localStorage.getItem('customQuizzes');
    return custom ? JSON.parse(custom) : [];
  } catch (e) {
    console.error("Error reading custom quizzes", e);
    return [];
  }
}

export function saveCustomQuestion(newQuestion) {
  if (typeof window === 'undefined') return;
  const list = getCustomQuestions();
  list.unshift(newQuestion);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(list));
  localStorage.setItem('customQuizzes', JSON.stringify(list));
}

export function deleteCustomQuestion(id) {
  if (typeof window === 'undefined') return;
  const list = getCustomQuestions().filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(list));
  localStorage.setItem('customQuizzes', JSON.stringify(list));
}

export function getUserSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUserSession(userData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userData));
}

export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
}

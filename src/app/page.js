'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEFAULT_QUIZZES, getCustomQuestions, getUserSession } from '@/lib/quizData';

export default function HomePage() {
  const [customCount, setCustomCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserSession());
    const custom = getCustomQuestions();
    setCustomCount(custom.length);
  }, []);

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Hero Header */}
      <section className="text-center py-10 sm:py-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <span>✨</span>
          <span>Next-Gen Interactive Quiz Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
          Test Your Skills with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Apna quiz test shuru karein, naye sawaal banayein, aur apna score improve karein!
        </p>

        {/* User state indicator */}
        <div className="flex justify-center mb-8">
          {user ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Logged in as <strong>{user.email}</strong></span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm">
              <span>👤 Playing as Guest</span>
              <span className="text-slate-300">•</span>
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                Login for full experience
              </Link>
            </div>
          )}
        </div>

        {/* Quick CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/quiz/web-dev"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span>Play Web Dev Quiz</span>
            <span>⚡</span>
          </Link>

          <Link
            href="/create-quiz"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span>Create New Question</span>
            <span>📝</span>
          </Link>
        </div>
      </section>

      {/* Available Quizzes Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Select a Quiz Category</h2>
            <p className="text-sm text-slate-500">Apni pasand ka topic choose karke quiz shuru karein</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {DEFAULT_QUIZZES.length + (customCount > 0 ? 1 : 0)} Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEFAULT_QUIZZES.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-xl bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                    {quiz.icon}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {quiz.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {quiz.questions.length} Questions
                </span>
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white font-semibold text-sm transition-all"
                >
                  Start Quiz →
                </Link>
              </div>
            </div>
          ))}

          {/* Custom Questions Card */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl p-3 rounded-xl bg-white shadow-xs">
                  ✨
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-200 text-violet-800">
                  Custom
                </span>
              </div>

              <h3 className="text-xl font-bold text-violet-950 mb-2">
                Your Custom Quiz
              </h3>
              <p className="text-sm text-violet-700/80 mb-4 leading-relaxed">
                Aapke dwara banaye gaye personal questions jo localStorage mein save hain.
              </p>
            </div>

            <div className="pt-4 border-t border-violet-200/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-800">
                {customCount} Questions Saved
              </span>
              {customCount > 0 ? (
                <Link
                  href="/quiz/custom"
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-all shadow-sm"
                >
                  Play Custom →
                </Link>
              ) : (
                <Link
                  href="/create-quiz"
                  className="px-4 py-2 rounded-lg bg-white border border-violet-300 text-violet-700 font-semibold text-sm hover:bg-violet-100 transition-all"
                >
                  + Add First
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats / Features */}
      <section className="mt-14 pt-10 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl mb-1">⚡</div>
            <h4 className="font-bold text-slate-800">Instant Evaluation</h4>
            <p className="text-xs text-slate-500 mt-1">Har question ka jawab aur explanation turant dekhein</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl mb-1">📝</div>
            <h4 className="font-bold text-slate-800">Custom Questions</h4>
            <p className="text-xs text-slate-500 mt-1">Apne questions add karein aur doston ke sath test karein</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl mb-1">📊</div>
            <h4 className="font-bold text-slate-800">Score & Performance</h4>
            <p className="text-xs text-slate-500 mt-1">Detailed accuracy percentage aur review analysis</p>
          </div>
        </div>
      </section>
    </div>
  );
}

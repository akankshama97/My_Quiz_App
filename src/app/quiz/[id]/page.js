'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { DEFAULT_QUIZZES, getCustomQuestions } from '@/lib/quizData';

export default function TakeQuiz({ params }) {
  // Unwrap Next.js 15+ promise-based params
  const resolvedParams = use(params);
  const quizId = resolvedParams?.id || 'web-dev';

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Stores { question, selected, correct, isCorrect, explanation }
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  const loadQuizData = () => {
    setLoading(true);
    let loadedQuestions = [];
    let title = 'General Quiz';

    if (quizId === 'custom') {
      const custom = getCustomQuestions();
      if (custom.length > 0) {
        loadedQuestions = custom;
        title = 'My Custom Questions';
      } else {
        loadedQuestions = DEFAULT_QUIZZES[0].questions;
        title = DEFAULT_QUIZZES[0].title;
      }
    } else {
      const found = DEFAULT_QUIZZES.find(q => q.id === quizId);
      if (found) {
        loadedQuestions = found.questions;
        title = found.title;
      } else {
        // Fallback for legacy /quiz/1 or any number
        const defaultSet = DEFAULT_QUIZZES[0];
        loadedQuestions = defaultSet.questions;
        title = defaultSet.title;
      }
    }

    setQuizTitle(title);
    setQuestions(loadedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setScore(0);
    setShowResult(false);
    setLoading(false);
  };

  const handleSelectOption = (option) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(option);
    }
  };

  // Submit current answer to see instant feedback and record result
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        question: currentQ.question,
        selected: selectedOption,
        correct: currentQ.answer,
        isCorrect,
        explanation: currentQ.explanation
      }
    ]);

    setIsAnswerSubmitted(true);
  };

  // Move to next question or show summary
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    loadQuizData();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-600">Quiz load ho raha hai...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <span className="text-4xl mb-3 block">📭</span>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Koi Questions Nahi Mile</h2>
          <p className="text-sm text-slate-500 mb-6">
            Is category mein abhi questions available nahi hain. Aap naye questions create kar sakte hain!
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/create-quiz"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all"
            >
              + Create Question
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 max-w-3xl mx-auto w-full">
      {/* Top Bar with Back Link and Category Tag */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>←</span>
          <span>All Quizzes</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <span>🎯</span>
          <span>{quizTitle}</span>
        </div>
      </div>

      {!showResult ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-indigo-600 h-2 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4">
              <span className="uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-indigo-600 font-bold">
                Current Score: {score}
              </span>
            </div>

            {/* Question title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options list */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQ.answer;

                let optionStyles = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-800';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
                  } else {
                    optionStyles = 'border-slate-200 opacity-50 text-slate-400';
                  }
                } else if (isSelected) {
                  optionStyles = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-2 ring-indigo-500';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-base">{option}</span>
                    </div>

                    {isAnswerSubmitted && (
                      <div>
                        {isCorrect && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                            ✓ Sahi Jawab
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-md">
                            ✕ Galat
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box when submitted */}
            {isAnswerSubmitted && currentQ.explanation && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-sm text-slate-700 animate-fadeIn">
                <span className="font-bold text-slate-900 block mb-1">💡 Explanation:</span>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div>
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all cursor-pointer ${
                    selectedOption === null
                      ? 'bg-slate-300 cursor-not-allowed opacity-60'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-200'
                  }`}
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Score'}</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center">
          {/* Animated Celebration Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 mb-4 animate-bounce">
            {score / questions.length >= 0.7 ? '🏆' : '🎯'}
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
            Quiz Completed!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Aapne <strong>{quizTitle}</strong> safaltapoorvak poora kiya.
          </p>

          {/* Score breakdown metrics card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto mb-6 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <span className="block text-2xl font-extrabold text-slate-900">
                {questions.length}
              </span>
              <span className="text-[11px] font-semibold uppercase text-slate-400">Total</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="block text-2xl font-extrabold text-emerald-600">
                {score}
              </span>
              <span className="text-[11px] font-semibold uppercase text-emerald-600">Correct</span>
            </div>
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="block text-2xl font-extrabold text-rose-600">
                {questions.length - score}
              </span>
              <span className="text-[11px] font-semibold uppercase text-rose-600">Incorrect</span>
            </div>
          </div>

          {/* Percentage badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-200">
              <span className="text-xs font-bold text-indigo-700">Accuracy:</span>
              <span className="text-lg font-black text-indigo-600">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              🔄 Play Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              🏠 Back to Home
            </Link>
            <Link
              href="/create-quiz"
              className="px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-sm transition-colors"
            >
              ➕ Create Question
            </Link>
          </div>

          {/* Question Review Section */}
          <div className="text-left border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Detailed Question Review
            </h3>

            <div className="space-y-4">
              {userAnswers.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-sm ${
                    item.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-slate-900">
                      Q{i + 1}. {item.question}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.isCorrect ? '✓ Correct' : '✕ Wrong'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 block">Aapka Jawab:</span>
                      <span className={item.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {item.selected}
                      </span>
                    </div>

                    {!item.isCorrect && (
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-500 block">Sahi Jawab:</span>
                        <span className="text-emerald-700 font-bold">{item.correct}</span>
                      </div>
                    )}
                  </div>

                  {item.explanation && (
                    <p className="text-xs text-slate-600 italic">
                      💡 {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

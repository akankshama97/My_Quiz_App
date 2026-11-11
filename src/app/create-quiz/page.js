'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCustomQuestions, saveCustomQuestion, deleteCustomQuestion } from '@/lib/quizData';

export default function CreateQuiz() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  
  const [customList, setCustomList] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setCustomList(getCustomQuestions());
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      showNotification('Kripya Question text enter karein!', 'error');
      return;
    }

    // Check all options
    for (let i = 0; i < 4; i++) {
      if (!options[i].trim()) {
        showNotification(`Option ${i + 1} khali nahi ho sakta!`, 'error');
        return;
      }
    }

    const selectedAnswer = options[correctOptionIndex].trim();
    if (!selectedAnswer) {
      showNotification('Sahi option select karein!', 'error');
      return;
    }

    const newQuestionItem = {
      id: Date.now(),
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      answer: selectedAnswer,
      explanation: explanation.trim() || 'Yeh is sawaal ka sahi uttar hai.',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    saveCustomQuestion(newQuestionItem);
    loadQuestions();

    // Reset form
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
    setExplanation('');

    showNotification('Naya Question successfully add ho gaya! 🎉', 'success');
  };

  const handleDelete = (id) => {
    if (confirm('Kya aap sach me yeh question delete karna chahte hain?')) {
      deleteCustomQuestion(id);
      loadQuestions();
      showNotification('Question delete ho gaya.', 'info');
    }
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-3">
          ← Back to Home
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>📝</span>
              <span>Create Quiz Questions</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Apna sawal aur 4 options likhein, aur radio button se sahi jawab select karein.
            </p>
          </div>

          {customList.length > 0 && (
            <Link
              href="/quiz/custom"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Play Custom ({customList.length})</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-all ${
            notification.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-700'
              : notification.type === 'info'
              ? 'bg-slate-100 border border-slate-200 text-slate-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{notification.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Question Title *
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Apna sawaal yahan likhein (e.g. Next.js mein routing kaise kaam karti hai?)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none transition-all"
              required
            />
          </div>

          {/* 4 Options with Radio Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Options & Correct Answer Selection *
              </label>
              <span className="text-xs text-indigo-600 font-medium">
                👉 Click on the radio button next to the correct answer
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {options.map((opt, index) => {
                const isSelected = correctOptionIndex === index;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                    }`}
                  >
                    <label className="flex items-center cursor-pointer p-1">
                      <input
                        type="radio"
                        name="correctAnswerGroup"
                        checked={isSelected}
                        onChange={() => setCorrectOptionIndex(index)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>

                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-16">
                        Option {index + 1}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1} ka text`}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-500 outline-none"
                        required
                      />
                    </div>

                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Explanation (Optional)
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Sahi uttar ki wajah ya brief explanation (taki answer ke baad user ko samajh aaye)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 active:scale-[0.99] transition-all cursor-pointer"
            >
              Save Question 💾
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm text-center transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Existing Custom Questions Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Saved Custom Questions ({customList.length})
          </h2>
          {customList.length > 0 && (
            <span className="text-xs text-slate-500">Stored in your browser's localStorage</span>
          )}
        </div>

        {customList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 bg-white">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm font-semibold text-slate-700">Abhi tak koi custom question add nahi kiya gaya.</p>
            <p className="text-xs text-slate-400 mt-1">Upar diye gaye form se naya question add karein!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customList.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400">Added: {item.createdAt || 'Custom'}</span>
                  </div>

                  <p className="font-semibold text-slate-900 mb-3">{item.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.options.map((option, optIdx) => {
                      const isCorrect = option === item.answer;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span>{option}</span>
                          {isCorrect && <span className="text-[10px] text-emerald-700">✓ Sahi</span>}
                        </div>
                      );
                    })}
                  </div>

                  {item.explanation && (
                    <p className="mt-2 text-xs text-slate-500 italic">
                      💡 {item.explanation}
                    </p>
                  )}
                </div>

                <div className="sm:self-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

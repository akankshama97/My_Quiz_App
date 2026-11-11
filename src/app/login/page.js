'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserSession, setUserSession, clearUserSession } from '@/lib/quizData';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setCurrentUser(getUserSession());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Demo check or allow valid email format
    const validEmail = email.trim();
    if (!validEmail.includes('@') || !validEmail.includes('.')) {
      setErrorMessage('Kripya valid email address enter karein!');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password kam se kam 4 characters ka hona chahiye!');
      return;
    }

    // Accept demo or any valid login
    const userObj = {
      email: validEmail,
      name: validEmail.split('@')[0],
      loggedInAt: new Date().toISOString(),
    };

    setUserSession(userObj);
    setCurrentUser(userObj);
    setSuccessMessage('Login successful! Redirecting to home...');

    // Trigger storage event for navbar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }

    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  const handleFillDemo = () => {
    setEmail('abc@gmail.com');
    setPassword('1234567');
    setErrorMessage('');
  };

  const handleLogout = () => {
    clearUserSession();
    setCurrentUser(null);
    setSuccessMessage('Aap successfully logout ho chuke hain.');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-2xl mb-3 shadow-xs">
            🔐
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Login
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Apne quizzes aur score track karne ke liye login karein
          </p>
        </div>

        {/* Currently logged in status */}
        {currentUser && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <p className="text-sm text-slate-700">
              Aap pehle se <strong>{currentUser.email}</strong> ke roop mein logged in hain.
            </p>
            <div className="mt-3 flex gap-2 justify-center">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                Go to Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Feedback Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. abc@gmail.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">Testing ke liye demo credentials:</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>💡 Auto-fill demo credentials</span>
            <span className="text-[10px] text-slate-400">(abc@gmail.com / 1234567)</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

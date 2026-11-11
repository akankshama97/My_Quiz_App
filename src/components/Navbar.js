'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUserSession, clearUserSession } from '@/lib/quizData';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserSession());
    
    // Listen for storage events (e.g., login from another tab or updated session)
    const handleStorage = () => setUser(getUserSession());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const handleLogout = () => {
    clearUserSession();
    setUser(null);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Take Quiz', href: '/quiz/web-dev' },
    { label: 'Create Quiz', href: '/create-quiz' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            ⚡
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              QuizMaster
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Smart Quiz App
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden sm:flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Auth controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-emerald-800">
                  {user.name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm shadow-indigo-300 transition-all cursor-pointer"
            >
              <span>Login</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

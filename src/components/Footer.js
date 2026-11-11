import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} QuizMaster App • Practice & Expand Your Knowledge</p>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/quiz/web-dev" className="hover:text-indigo-600 transition-colors">Quizzes</Link>
          <Link href="/create-quiz" className="hover:text-indigo-600 transition-colors">Add Question</Link>
        </div>
      </div>
    </footer>
  );
}

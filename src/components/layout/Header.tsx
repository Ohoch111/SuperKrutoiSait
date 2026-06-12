import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
  }`;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            IE
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">IELTS Writing</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Academic Evaluator</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/evaluate" className={navLinkClass}>
            Evaluate
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            History
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

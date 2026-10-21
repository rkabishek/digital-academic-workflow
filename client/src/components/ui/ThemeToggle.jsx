import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '', compact = false }) => {
  const { theme, toggle, setTheme, isDark } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
        className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 transition-colors ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        title="Activate Light Mode"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
          !isDark
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-500/20' : 'text-slate-400'}`} />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        title="Activate Dark Mode"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
          isDark
            ? 'bg-slate-900 text-slate-50 shadow-sm border border-slate-700 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400 fill-blue-400/20' : 'text-slate-400'}`} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
};

export default ThemeToggle;

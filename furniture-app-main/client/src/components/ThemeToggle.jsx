import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
        isDark
          ? 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15'
          : 'bg-black/5 hover:bg-black/10 text-slate-600 hover:text-slate-900 border border-black/10'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

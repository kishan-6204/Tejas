import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded border border-slate-700 px-3 py-1 text-xs transition hover:border-accent hover:text-accent"
    >
      Theme: {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}

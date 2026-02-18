import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import TypingBox from '../components/TypingBox';
import Stats from '../components/Stats';
import { useTypingTest } from '../hooks/useTypingTest';
import { useAuth } from '../context/AuthContext';

const MODES = [30, 60, 120];

export default function Typing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(60);
  const toast = useToast();
  const { sourceText, typed, timeLeft, isComplete, metrics, timeline, elapsedSeconds, onType, restart } = useTypingTest(mode);

  useEffect(() => {
    if (!isComplete) return;

    const result = {
      wpm: metrics.wpm,
      rawWpm: metrics.rawWpm,
      accuracy: metrics.accuracy,
      errors: metrics.errors,
      consistency: metrics.consistency,
      chars: metrics.chars,
      totalTyped: metrics.totalTyped,
      mode,
      elapsedSeconds,
      timeline,
      completedAt: new Date().toISOString(),
    };

    navigate('/result', { state: { result }, replace: true });
  }, [elapsedSeconds, isComplete, metrics, mode, navigate, timeline]);

  const handleMode = (value) => {
    setMode(value);
    toast.success(`Mode switched to ${value}s`);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-300">TEJAS</h1>
          <p className="text-sm text-slate-400">Where speed meets focus.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <Link to="/dashboard" className="rounded border border-slate-700 px-3 py-1.5 text-slate-200 hover:border-cyan-300">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="rounded border border-slate-700 px-3 py-1.5 text-slate-200 hover:border-cyan-300">
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {MODES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleMode(item)}
            className={`rounded-full border px-4 py-1.5 text-sm ${mode === item ? 'border-cyan-300 text-cyan-300' : 'border-slate-700 text-slate-400'}`}
          >
            {item}s
          </button>
        ))}
      </div>

      <Stats metrics={metrics} timeLeft={timeLeft} />

      <motion.section className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <TypingBox
          sourceText={sourceText}
          typed={typed}
          onType={onType}
          isComplete={isComplete}
          onRestart={restart}
        />
      </motion.section>
    </main>
  );
}

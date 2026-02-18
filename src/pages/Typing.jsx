import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import TypingBox from '../components/TypingBox';
import Stats from '../components/Stats';
import ThemeToggle from '../components/ThemeToggle';
import { useTypingTest } from '../hooks/useTypingTest';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

const MODES = [30, 60, 120];

export default function Typing() {
  const { user } = useAuth();
  const [mode, setMode] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const { sourceText, typed, timeLeft, isComplete, metrics, onType, restart } = useTypingTest(mode, soundEnabled);

  const resultPayload = useMemo(
    () => ({
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      errors: metrics.errors,
      duration: mode,
      completedAt: new Date().toISOString(),
    }),
    [metrics, mode],
  );

  const saveResult = async () => {
    const userRef = doc(db, 'users', user.uid);
    const current = await getDoc(userRef);
    const data = current.data() ?? { bestWPM: 0, averageAccuracy: 0, accuracyHistory: [] };
    const history = data.accuracyHistory ?? [];
    const newAverage = Math.round((history.reduce((sum, value) => sum + value, 0) + metrics.accuracy) / (history.length + 1));

    await updateDoc(userRef, {
      bestWPM: Math.max(data.bestWPM ?? 0, metrics.wpm),
      averageAccuracy: newAverage,
      accuracyHistory: arrayUnion(metrics.accuracy),
      lastResult: resultPayload,
      updatedAt: serverTimestamp(),
    });

    setSaved(true);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setSaved(false);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col p-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-accent">Tejas Typing Arena</h1>
          <p className="text-sm text-slate-400">Where speed meets focus.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {MODES.map((seconds) => (
            <button
              key={seconds}
              type="button"
              onClick={() => handleModeChange(seconds)}
              className={`rounded border px-3 py-1 ${mode === seconds ? 'border-accent text-accent' : 'border-slate-700'}`}
            >
              {seconds}s
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSoundEnabled((current) => !current)}
            className={`rounded border px-3 py-1 ${soundEnabled ? 'border-emerald-400 text-emerald-300' : 'border-slate-700'}`}
          >
            Sound: {soundEnabled ? 'On' : 'Off'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <Stats metrics={metrics} timeLeft={timeLeft} />

      <section className="mt-6">
        <TypingBox sourceText={sourceText} typed={typed} onType={onType} isComplete={isComplete} />
      </section>

      {isComplete ? (
        <motion.section
          className="mt-6 rounded-lg border border-slate-800 bg-slate-900/80 p-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-semibold text-accent">Test Complete</h2>
          <p className="mt-2 text-sm text-slate-300">
            Final score: {metrics.wpm} WPM • {metrics.accuracy}% accuracy • {metrics.errors} errors
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                restart();
                setSaved(false);
              }}
              className="rounded border border-slate-700 px-4 py-2 text-sm"
            >
              Restart
            </button>
            <button
              type="button"
              disabled={saved}
              onClick={saveResult}
              className="rounded bg-accent px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              {saved ? 'Saved' : 'Save Result'}
            </button>
          </div>
        </motion.section>
      ) : null}

      <footer className="mt-auto flex items-center justify-between py-6 text-xs text-slate-500">
        <span>Tejas — Where speed meets focus.</span>
        <Link to="/dashboard" className="text-accent">Dashboard</Link>
      </footer>
    </main>
  );
}

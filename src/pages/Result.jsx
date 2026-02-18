import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import ResultGraph from '../components/ResultGraph';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.3 },
  }),
};

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const result = state?.result;

  const historyPayload = useMemo(() => ({
    ...result,
    savedAt: new Date().toISOString(),
  }), [result]);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const statCards = [
    { label: 'WPM', value: result.wpm, tone: 'text-yellow-300' },
    { label: 'Accuracy', value: `${result.accuracy}%` },
    { label: 'Raw WPM', value: result.rawWpm },
    { label: 'Errors', value: result.errors, tone: 'text-rose-300' },
    { label: 'Time', value: `${result.mode}s` },
  ];

  const saveResult = async () => {
    if (!user) {
      toast.error('Please sign in to save your result.');
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      const current = snapshot.data() ?? { bestWPM: 0, averageAccuracy: 0, testHistory: [] };
      const previousHistory = current.testHistory ?? [];
      const accuracies = [...previousHistory.map((item) => item.accuracy), result.accuracy];
      const averageAccuracy = Math.round(accuracies.reduce((sum, item) => sum + item, 0) / accuracies.length);

      await updateDoc(userRef, {
        bestWPM: Math.max(current.bestWPM ?? 0, result.wpm),
        averageAccuracy,
        testHistory: arrayUnion(historyPayload),
        updatedAt: serverTimestamp(),
      });

      toast.success('Result saved to dashboard history.');
    } catch (error) {
      toast.error('Unable to save result. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 md:py-8">
      <motion.section
        className="grid gap-5 lg:grid-cols-[320px_1fr]"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h1 className="text-xl font-semibold text-cyan-300">Test Results</h1>
          <p className="mt-1 text-xs text-slate-400">Where speed meets focus.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {statCards.map((card, index) => (
              <motion.div
                key={card.label}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-lg border border-slate-700 bg-slate-950/70 p-3"
              >
                <p className="text-xs text-slate-400">{card.label}</p>
                <p className={`text-2xl font-bold text-slate-100 ${card.tone ?? ''}`}>{card.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={statCards.length + 1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="mt-3 rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-300"
          >
            <p>Characters: {result.chars.correct}/{result.chars.incorrect}/{result.chars.extra}/{result.chars.missed}</p>
            <p>Consistency: {result.consistency}%</p>
          </motion.div>
        </aside>

        <section className="space-y-5">
          <ResultGraph timeline={result.timeline} />

          {!user ? (
            <motion.div
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/5 p-4 text-sm text-slate-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="mb-3">Sign in to save your result</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/login" className="rounded bg-cyan-300 px-4 py-2 text-slate-900">Login</Link>
                <Link to="/register" className="rounded border border-cyan-300 px-4 py-2 text-cyan-300">Register</Link>
                <button type="button" className="rounded border border-slate-700 px-4 py-2" onClick={() => navigate('/')}>Continue without saving</button>
              </div>
            </motion.div>
          ) : null}
        </section>
      </motion.section>

      <motion.div
        className="mt-6 flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <button type="button" onClick={() => navigate('/')} className="rounded border border-slate-700 px-4 py-2">Restart test</button>
        <button type="button" onClick={() => navigate('/')} className="rounded border border-slate-700 px-4 py-2">Back to typing</button>
        <button
          type="button"
          disabled={saving || !user}
          onClick={saveResult}
          className="rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save result'}
        </button>
      </motion.div>
    </main>
  );
}

import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import ResultGraph from '../components/ResultGraph';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

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
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <motion.section
        className="grid gap-6 lg:grid-cols-[320px_1fr]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h1 className="text-xl font-semibold text-cyan-300">Test Results</h1>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p className="text-5xl font-bold text-yellow-300">{result.wpm}</p>
            <p>WPM</p>
            <p>Accuracy: {result.accuracy}%</p>
            <p>Raw WPM: {result.rawWpm}</p>
            <p>Characters: {result.chars.correct}/{result.chars.incorrect}/{result.chars.extra}/{result.chars.missed}</p>
            <p>Consistency: {result.consistency}%</p>
            <p>Time: {result.mode}s</p>
            <p>Errors: {result.errors}</p>
          </div>
        </aside>

        <section>
          <ResultGraph timeline={result.timeline} />
        </section>
      </motion.section>

      {!user ? (
        <div className="mt-6 rounded-xl border border-cyan-400/30 bg-cyan-500/5 p-4 text-sm text-slate-300">
          <p className="mb-3">Sign in to save your result</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="rounded bg-cyan-300 px-4 py-2 text-slate-900">Login</Link>
            <Link to="/register" className="rounded border border-cyan-300 px-4 py-2 text-cyan-300">Register</Link>
            <button type="button" className="rounded border border-slate-700 px-4 py-2" onClick={() => navigate('/')}>Continue without saving</button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => navigate('/')} className="rounded border border-slate-700 px-4 py-2">Restart</button>
        <button type="button" onClick={() => navigate('/')} className="rounded border border-slate-700 px-4 py-2">Back to typing</button>
        {user ? (
          <button
            type="button"
            disabled={saving}
            onClick={saveResult}
            className="rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-900 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save result'}
          </button>
        ) : null}
      </div>
    </main>
  );
}

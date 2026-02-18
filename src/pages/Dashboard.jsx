import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const toast = useToast();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      setFetching(true);
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        setProfile(snapshot.data() ?? null);
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) return <LoadingSpinner label="Checking session..." />;
  if (!user) return <Navigate to="/login" state={{ next: '/dashboard' }} replace />;
  if (fetching) return <LoadingSpinner label="Loading dashboard..." />;

  const history = [...(profile?.testHistory ?? [])].reverse();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-cyan-300">Welcome to Tejas</h1>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-900">Start Typing</Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              toast.success('Logged out');
            }}
            className="rounded border border-slate-700 px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      <motion.section className="mt-6 grid gap-4 md:grid-cols-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Best WPM</p>
          <p className="mt-2 text-4xl font-bold text-yellow-300">{profile?.bestWPM ?? 0}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Average Accuracy</p>
          <p className="mt-2 text-4xl font-bold text-cyan-300">{profile?.averageAccuracy ?? 0}%</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Last Result</p>
          <p className="mt-2 text-sm text-slate-200">{history[0] ? `${history[0].wpm} WPM • ${history[0].accuracy}%` : 'No results yet'}</p>
        </article>
      </motion.section>

      <section className="mt-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-3 text-lg font-semibold">Test History</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">WPM</th>
              <th className="pb-2">Accuracy</th>
              <th className="pb-2">Raw</th>
              <th className="pb-2">Mode</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-slate-500">No saved tests yet.</td>
              </tr>
            ) : history.map((item, index) => (
              <tr key={`${item.savedAt}-${index}`} className="border-t border-slate-800 text-slate-200">
                <td className="py-2">{new Date(item.savedAt).toLocaleString()}</td>
                <td className="py-2">{item.wpm}</td>
                <td className="py-2">{item.accuracy}%</td>
                <td className="py-2">{item.rawWpm}</td>
                <td className="py-2">{item.mode}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

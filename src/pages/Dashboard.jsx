import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const snapshot = await getDoc(doc(db, 'users', user.uid));
      setProfile(snapshot.data());
      setLoading(false);
    };

    loadProfile().catch(() => setLoading(false));
  }, [user.uid]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Welcome to Tejas</h1>
          <p className="text-slate-400">Where speed meets focus.</p>
        </div>
        <ThemeToggle />
      </header>

      <motion.section
        className="mt-10 grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <article className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="mt-2 break-all text-sm">{user.email}</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs text-slate-400">Best WPM</p>
          <p className="mt-2 text-3xl font-semibold text-accent">{profile?.bestWPM ?? 0}</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs text-slate-400">Last Result</p>
          <p className="mt-2 text-sm">
            {profile?.lastResult ? `${profile.lastResult.wpm} WPM • ${profile.lastResult.accuracy}%` : 'No tests yet'}
          </p>
        </article>
      </motion.section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="rounded bg-accent px-4 py-2 font-semibold text-slate-950" to="/typing">
          Start Typing
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded border border-slate-700 px-4 py-2 text-sm hover:border-rose-400 hover:text-rose-300"
        >
          Logout
        </button>
      </div>

      <footer className="mt-auto py-6 text-xs text-slate-500">Tejas — Where speed meets focus.</footer>
    </main>
  );
}

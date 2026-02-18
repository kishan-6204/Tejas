import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        email: credential.user.email,
        joinedAt: serverTimestamp(),
        bestWPM: 0,
        averageAccuracy: 0,
        lastResult: null,
        accuracyHistory: [],
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.section
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent">Tejas</h1>
            <p className="text-sm text-slate-400">Where speed meets focus.</p>
          </div>
          <ThemeToggle />
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            Email
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-accent"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>

          <label className="block text-sm">
            Password
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-accent"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              minLength={6}
              required
            />
          </label>

          <label className="block text-sm">
            Confirm Password
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-accent"
              type="password"
              value={formData.confirmPassword}
              onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              minLength={6}
              required
            />
          </label>

          {error ? <p className="text-xs text-rose-400">{error}</p> : null}

          <button
            className="w-full rounded bg-accent px-4 py-2 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </motion.section>
    </main>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ensureUserDocument } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const nextPath = location.state?.next || '/';

  const signIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await ensureUserDocument(credential.user);
      toast.success('Welcome back!');
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await ensureUserDocument(credential.user);
      toast.success('Signed in with Google');
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <motion.section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-cyan-300">Login</h1>
        <p className="mb-6 text-sm text-slate-400">Where speed meets focus.</p>

        <form onSubmit={signIn} className="space-y-4">
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="email" placeholder="Email" required value={formData.email} onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} />
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="password" placeholder="Password" required value={formData.password} onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))} />
          <button className="w-full rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-900 disabled:opacity-50" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>

        <button type="button" onClick={googleSignIn} disabled={loading} className="mt-3 w-full rounded border border-slate-600 px-4 py-2 text-sm">Continue with Google</button>

        <p className="mt-4 text-sm text-slate-400">Need an account? <Link to="/register" state={{ next: nextPath }} className="text-cyan-300">Register</Link></p>
      </motion.section>
    </main>
  );
}

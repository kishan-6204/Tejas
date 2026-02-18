import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ensureUserDocument } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const nextPath = location.state?.next || '/';

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await ensureUserDocument(credential.user);
      toast.success('Account created.');
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const googleRegister = async () => {
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await ensureUserDocument(credential.user);
      toast.success('Account ready with Google.');
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
        <h1 className="text-3xl font-bold text-cyan-300">Register</h1>
        <p className="mb-6 text-sm text-slate-400">Create your Tejas profile.</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="email" placeholder="Email" value={formData.email} onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} required />
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="password" minLength={6} placeholder="Password" value={formData.password} onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))} required />
          <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="password" minLength={6} placeholder="Confirm password" value={formData.confirmPassword} onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))} required />
          <button className="w-full rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-900 disabled:opacity-50" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>

        <button type="button" onClick={googleRegister} disabled={loading} className="mt-3 w-full rounded border border-slate-600 px-4 py-2 text-sm">Continue with Google</button>

        <p className="mt-4 text-sm text-slate-400">Already have an account? <Link to="/login" state={{ next: nextPath }} className="text-cyan-300">Login</Link></p>
      </motion.section>
    </main>
  );
}

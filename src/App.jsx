import { AnimatePresence, motion } from 'framer-motion';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Typing from './pages/Typing';

function Landing() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <motion.h1
        className="text-6xl font-bold tracking-tight text-accent"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        TEJAS
      </motion.h1>
      <motion.p
        className="mt-4 text-lg text-slate-300"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Where speed meets focus.
      </motion.p>
      <motion.div className="mt-8 flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Link className="rounded bg-accent px-5 py-2 font-semibold text-slate-950" to="/register">
          Get Started
        </Link>
        <Link className="rounded border border-slate-700 px-5 py-2" to="/login">
          Login
        </Link>
      </motion.div>
      <footer className="absolute bottom-6 text-xs text-slate-500">Tejas — Where speed meets focus.</footer>
    </main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/typing"
          element={(
            <ProtectedRoute>
              <Typing />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';

export default function Caret({ className = '' }) {
  return (
    <motion.span
      layout
      aria-hidden
      className={`pointer-events-none absolute -left-[1px] top-1/2 h-7 w-[2px] -translate-y-1/2 bg-cyan-300 transition-all duration-75 ${className}`}
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ opacity: { duration: 0.9, repeat: Infinity, ease: 'linear' }, layout: { type: 'spring', damping: 30, stiffness: 500 } }}
    />
  );
}

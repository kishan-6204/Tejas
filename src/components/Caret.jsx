import { motion } from 'framer-motion';

export default function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-6 w-[2px] bg-accent"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

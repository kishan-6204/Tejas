import { motion } from 'framer-motion';

export default function Stats({ metrics, timeLeft }) {
  const cards = [
    { label: 'WPM', value: metrics.wpm },
    { label: 'Accuracy', value: `${metrics.accuracy}%` },
    { label: 'Raw', value: metrics.rawWpm },
    { label: 'Errors', value: metrics.errors },
    { label: 'Time', value: `${timeLeft}s` },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {cards.map((item) => (
        <motion.article
          key={item.label}
          className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
          <p className="text-xl font-semibold text-cyan-300">{item.value}</p>
        </motion.article>
      ))}
    </section>
  );
}

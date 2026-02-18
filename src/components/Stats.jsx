import { motion } from 'framer-motion';

export default function Stats({ metrics, timeLeft }) {
  const stats = [
    { label: 'WPM', value: metrics.wpm },
    { label: 'Accuracy', value: `${metrics.accuracy}%` },
    { label: 'Errors', value: metrics.errors },
    { label: 'Time', value: `${timeLeft}s` },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className="rounded border border-slate-800 bg-slate-900/70 p-3 text-center"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-slate-400">{stat.label}</p>
          <p className="text-xl font-semibold text-accent">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

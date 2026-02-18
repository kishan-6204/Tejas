import { motion } from 'framer-motion';

export default function ResultGraph({ timeline }) {
  const width = 860;
  const height = 280;
  const pad = 28;
  const points = timeline.length ? timeline : [{ second: 0, wpm: 0, raw: 0, errors: 0 }];
  const maxY = Math.max(40, ...points.map((p) => Math.max(p.wpm, p.raw)));

  const toXY = (point, index) => {
    const x = pad + (index / Math.max(points.length - 1, 1)) * (width - pad * 2);
    const yWpm = height - pad - (point.wpm / maxY) * (height - pad * 2);
    const yRaw = height - pad - (point.raw / maxY) * (height - pad * 2);
    return { x, yWpm, yRaw };
  };

  const wpmPath = points.map((point, index) => {
    const { x, yWpm } = toXY(point, index);
    return `${index === 0 ? 'M' : 'L'} ${x} ${yWpm}`;
  }).join(' ');

  const rawPath = points.map((point, index) => {
    const { x, yRaw } = toXY(point, index);
    return `${index === 0 ? 'M' : 'L'} ${x} ${yRaw}`;
  }).join(' ');

  return (
    <motion.div
      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
        <path d={rawPath} fill="none" stroke="#94a3b8" strokeWidth="2" />
        <motion.path
          d={wpmPath}
          fill="none"
          stroke="#facc15"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        {points.map((point, index) => {
          if (point.errors <= 0) return null;
          const { x, yWpm } = toXY(point, index);
          return <circle key={`${point.second}-${index}`} cx={x} cy={yWpm} r="3" fill="#ef4444" />;
        })}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
        <span className="text-yellow-300">● WPM</span>
        <span className="text-slate-300">● Raw speed</span>
        <span className="text-rose-400">● Error points</span>
      </div>
    </motion.div>
  );
}

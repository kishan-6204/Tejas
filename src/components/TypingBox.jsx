import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WordRow from './WordRow';

export default function TypingBox({ sourceText, typed, onType, isComplete, onRestart }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [sourceText]);

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="relative" onClick={() => inputRef.current?.focus()}>
        <WordRow sourceText={sourceText} typed={typed} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-xl bg-gradient-to-b from-slate-900/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-xl bg-gradient-to-t from-slate-900/90 to-transparent" />
      </div>

      <textarea
        ref={inputRef}
        value={typed}
        onChange={(event) => onType(event.target.value)}
        disabled={isComplete}
        autoFocus
        spellCheck={false}
        className="h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-200 outline-none ring-cyan-300/30 focus:ring"
        placeholder="Start typing to begin the timer..."
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <p>Shortcuts: Tab / Enter / Ctrl+R to restart instantly.</p>
        <button
          type="button"
          className="rounded border border-slate-700 px-3 py-1 text-slate-300 hover:border-cyan-300"
          onClick={onRestart}
        >
          Restart now
        </button>
      </div>
    </motion.div>
  );
}

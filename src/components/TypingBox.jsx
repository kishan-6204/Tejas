import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WordRow from './WordRow';

export default function TypingBox({ sourceText, typed, onType, isComplete, onRestart }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [sourceText]);

  const onKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      onRestart();
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      onRestart();
    }
  };

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <WordRow sourceText={sourceText} typed={typed} />
      <textarea
        ref={inputRef}
        value={typed}
        onChange={(event) => onType(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={isComplete}
        autoFocus
        spellCheck={false}
        className="h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-200 outline-none ring-cyan-300/30 focus:ring"
        placeholder="Start typing to begin the timer..."
      />
      <p className="text-xs text-slate-400">Shortcuts: Tab / Enter / Ctrl+R to restart instantly.</p>
    </motion.div>
  );
}

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WordRow from './WordRow';

export default function TypingBox({ sourceText, typed, onType, isComplete }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [sourceText]);

  return (
    <motion.div className="w-full space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <WordRow sourceText={sourceText} typed={typed} />
      <textarea
        ref={inputRef}
        value={typed}
        onChange={(event) => onType(event.target.value)}
        disabled={isComplete}
        autoFocus
        spellCheck={false}
        className="h-24 w-full resize-none rounded border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-200 outline-none ring-accent/30 transition focus:ring"
        placeholder="Start typing..."
      />
      <p className="text-xs text-slate-400">Keyboard-first: type naturally, press Ctrl + R to restart instantly.</p>
    </motion.div>
  );
}

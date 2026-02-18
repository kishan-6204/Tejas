import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const WORD_BANK = [
  'focus', 'speed', 'keyboard', 'terminal', 'function', 'react', 'firebase', 'syntax',
  'minimal', 'animate', 'code', 'developer', 'practice', 'accuracy', 'discipline', 'session',
  'momentum', 'stream', 'router', 'context', 'layout', 'precision', 'timing', 'effort',
  'tejas', 'rapid', 'stable', 'modular', 'premium', 'neon', 'flow', 'commit', 'branch',
];

const randomWords = (count = 80) =>
  Array.from({ length: count }, () => WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);

const sanitizeInput = (value) => value.replace(/\n/g, '').replace(/\s+/g, ' ');

export function useTypingTest(duration = 60, soundEnabled = false) {
  const [words, setWords] = useState(() => randomWords());
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!soundEnabled) {
      audioRef.current = null;
      return;
    }

    audioRef.current = new Audio('data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YRAAAAAA');
    audioRef.current.volume = 0.08;
  }, [soundEnabled]);

  const sourceText = useMemo(() => words.join(' '), [words]);

  const metrics = useMemo(() => {
    const typedChars = typed.length;
    const correctChars = typed
      .split('')
      .reduce((count, char, idx) => (char === sourceText[idx] ? count + 1 : count), 0);
    const errors = typedChars - correctChars;
    const elapsed = startedAt ? Math.max(1, (Date.now() - startedAt) / 1000) : 0;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

    return {
      typedChars,
      correctChars,
      errors,
      wpm: Number.isFinite(wpm) ? wpm : 0,
      accuracy,
    };
  }, [typed, sourceText, startedAt]);

  const restart = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setWords(randomWords());
    setTyped('');
    setTimeLeft(duration);
    setIsRunning(false);
    setIsComplete(false);
    setStartedAt(null);
  }, [duration]);

  useEffect(() => restart(), [duration, restart]);

  useEffect(() => {
    const handler = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        restart();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [restart]);

  const onType = useCallback(
    (nextValue) => {
      if (isComplete) return;
      const safeValue = sanitizeInput(nextValue);
      if (safeValue.length > sourceText.length) return;

      if (!isRunning && safeValue.length > 0) {
        setIsRunning(true);
        setStartedAt(Date.now());
      }

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      setTyped(safeValue);
    },
    [isComplete, isRunning, sourceText.length],
  );

  useEffect(() => {
    if (!isRunning || isComplete) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsComplete(true);
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, isComplete]);

  useEffect(() => {
    if (typed.length === sourceText.length && sourceText.length > 0) {
      setIsComplete(true);
      setIsRunning(false);
      clearInterval(timerRef.current);
    }
  }, [typed, sourceText.length]);

  return {
    words,
    sourceText,
    typed,
    timeLeft,
    isRunning,
    isComplete,
    metrics,
    onType,
    restart,
  };
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const WORD_BANK = [
  'velocity', 'focus', 'syntax', 'engine', 'reactive', 'minimal', 'keyboard', 'signal',
  'cursor', 'clarity', 'rhythm', 'timing', 'system', 'optimize', 'careful', 'momentum',
  'pattern', 'future', 'module', 'vector', 'design', 'coding', 'dynamic', 'precision',
  'session', 'correct', 'measure', 'quality', 'compose', 'typing', 'tejas', 'spark',
];

const randomWords = (count = 90) =>
  Array.from({ length: count }, () => WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);

const toSafeInput = (value) => value.replace(/\n/g, ' ').replace(/\s+/g, ' ');

export function useTypingTest(duration = 60) {
  const [sourceText, setSourceText] = useState(() => randomWords().join(' '));
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const timerRef = useRef(null);

  const chars = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;

    typed.split('').forEach((char, index) => {
      if (index >= sourceText.length) {
        extra += 1;
      } else if (char === sourceText[index]) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });

    const missed = Math.max(sourceText.length - typed.length, 0);
    return { correct, incorrect, extra, missed };
  }, [sourceText, typed]);

  const metrics = useMemo(() => {
    const totalTyped = typed.length;
    const safeElapsed = Math.max(elapsedSeconds, 1);
    const minutes = safeElapsed / 60;
    const wpm = Math.round((chars.correct / 5) / minutes) || 0;
    const rawWpm = Math.round((totalTyped / 5) / minutes) || 0;
    const accuracy = totalTyped > 0 ? Math.round((chars.correct / totalTyped) * 100) : 100;
    const errors = chars.incorrect + chars.extra;

    const speeds = timeline.map((point) => point.wpm);
    const mean = speeds.length ? speeds.reduce((sum, value) => sum + value, 0) / speeds.length : 0;
    const variance = speeds.length
      ? speeds.reduce((sum, value) => sum + (value - mean) ** 2, 0) / speeds.length
      : 0;
    const consistency = speeds.length ? Math.max(0, Math.round(100 - Math.sqrt(variance))) : 100;

    return {
      wpm,
      rawWpm,
      accuracy,
      errors,
      consistency,
      totalTyped,
      chars,
    };
  }, [chars, elapsedSeconds, timeline, typed.length]);

  const restart = useCallback(() => {
    clearInterval(timerRef.current);
    setSourceText(randomWords().join(' '));
    setTyped('');
    setTimeLeft(duration);
    setElapsedSeconds(0);
    setIsRunning(false);
    setIsComplete(false);
    setTimeline([]);
  }, [duration]);

  useEffect(() => restart(), [duration, restart]);

  const onType = useCallback(
    (value) => {
      if (isComplete) return;
      const next = toSafeInput(value);
      if (next.length > sourceText.length + 20) return;

      if (!isRunning && next.length > 0) {
        setIsRunning(true);
      }

      setTyped(next);
    },
    [isComplete, isRunning, sourceText.length],
  );

  useEffect(() => {
    if (!isRunning || isComplete) return undefined;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prevElapsed) => {
        const nextElapsed = prevElapsed + 1;

        setTimeLeft((prevTime) => {
          const nextTime = prevTime - 1;
          if (nextTime <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return nextTime;
        });

        setTimeline((prev) => {
          const minutes = nextElapsed / 60;
          const correctChars = typed
            .split('')
            .reduce((count, char, index) => (char === sourceText[index] ? count + 1 : count), 0);
          const totalTyped = typed.length;
          const point = {
            second: nextElapsed,
            wpm: Math.round((correctChars / 5) / minutes) || 0,
            raw: Math.round((totalTyped / 5) / minutes) || 0,
            errors: totalTyped - correctChars,
          };

          return [...prev, point];
        });

        return nextElapsed;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isComplete, isRunning, sourceText, typed]);

  return {
    sourceText,
    typed,
    timeLeft,
    isComplete,
    metrics,
    timeline,
    elapsedSeconds,
    onType,
    restart,
  };
}

import Caret from './Caret';

export default function WordRow({ sourceText, typed }) {
  return (
    <div className="min-h-28 rounded border border-slate-800 bg-slate-900/60 p-6 text-2xl leading-relaxed tracking-wide">
      {sourceText.split('').map((character, index) => {
        const typedChar = typed[index];
        let style = 'text-slate-600';

        if (typedChar != null) {
          style = typedChar === character ? 'text-emerald-400' : 'text-rose-400';
        }

        const showCaret = index === typed.length;

        return (
          <span key={`${character}-${index}`} className={style}>
            {character}
            {showCaret && <Caret />}
          </span>
        );
      })}
      {typed.length === sourceText.length ? <Caret /> : null}
    </div>
  );
}

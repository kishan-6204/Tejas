import Caret from './Caret';

export default function WordRow({ sourceText, typed }) {
  const caretIndex = typed.length;

  return (
    <div className="min-h-36 rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-xl leading-relaxed text-slate-500 md:text-2xl">
      {sourceText.split('').map((character, index) => {
        const typedChar = typed[index];
        let style = 'text-slate-600';

        if (typedChar != null) {
          style = typedChar === character ? 'text-emerald-300' : 'text-rose-400';
        }

        return (
          <span key={`${index}-${character}`} className={`relative whitespace-pre ${style}`}>
            {index === caretIndex ? <Caret /> : null}
            {character}
          </span>
        );
      })}
      {caretIndex >= sourceText.length ? (
        <span className="relative inline-block w-2 align-middle">
          <Caret className="left-0" />
        </span>
      ) : null}
    </div>
  );
}

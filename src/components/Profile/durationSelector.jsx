const DURATIONS = [15, 20, 30, 45, 60, 90];
export default function DurationSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {DURATIONS.map((mins) => {
        const isSelected = Number(value) === mins;
        return (
          <button
            key={mins}
            type="button"
            onClick={() => onChange(mins)}
            className={`
              flex flex-col items-center py-3 rounded-xl border
              transition-all duration-200
              ${isSelected
                ? "border-lime-400 bg-lime-400/10 text-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.15)]"
                : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500"
              }
            `}
          >
            <span className="text-xl font-black">{mins}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">min</span>
          </button>
        );
      })}
    </div>
  );
}
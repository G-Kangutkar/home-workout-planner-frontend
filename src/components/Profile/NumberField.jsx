

export default function NumberField({ label, icon: Icon, value, onChange, unit, min, max, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          className="w-full bg-zinc-800/80 border border-zinc-700 text-white text-sm
                     rounded-xl px-3 py-2.5 pr-12 focus:outline-none focus:border-lime-400/50
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
}

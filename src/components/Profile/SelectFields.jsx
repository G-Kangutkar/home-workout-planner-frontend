import { ChevronDown } from "lucide-react";

export default function SelectField({ label, icon: Icon, value, onChange, options, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-zinc-800/80 border border-zinc-700 text-white text-sm
                     rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-lime-400/50
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.emoji ? `${o.emoji} ` : ""}{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
      </div>
    </div>
  );
}
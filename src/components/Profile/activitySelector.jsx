const ACTIVITY_LEVELS = [
  { value: "beginner",     label: "Beginner",     icon: "🟢", desc: "New to working out"         },
  { value: "intermediate", label: "Intermediate", icon: "🟡", desc: "Comfortable with exercise"  },
  { value: "advanced",     label: "Advanced",     icon: "🔴", desc: "Highly experienced trainer" },
];
export default function ActivitySelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {ACTIVITY_LEVELS.map((level) => {
        const isSelected = value === level.value;
        return (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`
              flex items-center gap-3 p-3.5 rounded-xl border text-left
              transition-all duration-200
              ${isSelected
                ? "border-lime-400 bg-lime-400/10"
                : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500"
              }
            `}
          >
            <span className="text-lg">{level.icon}</span>
            <div className="flex-1">
              <p className={`text-sm font-bold ${isSelected ? "text-lime-400" : "text-zinc-200"}`}>
                {level.label}
              </p>
              <p className="text-xs text-zinc-500">{level.desc}</p>
            </div>
            {/* Radio dot */}
            <div className={`w-3 h-3 rounded-full border-2 transition-all
              ${isSelected ? "bg-lime-400 border-lime-400" : "border-zinc-600"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
const FITNESS_GOALS = [
  { value: "weight_loss",     label: "Weight Loss",     icon: "🔥", desc: "Burn fat & shed pounds"      },
  { value: "muscle_gain",     label: "Muscle Gain",     icon: "💪", desc: "Build strength & mass"       },
  { value: "flexibility",     label: "Flexibility",     icon: "🧘", desc: "Improve mobility & stretch"  },
  { value: "general_fitness", label: "General Fitness", icon: "⚡", desc: "Stay active & healthy"       },
];
export default function GoalSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FITNESS_GOALS.map((goal) => {
        const isSelected = value === goal.value;
        return (
          <button
            key={goal.value}
            type="button"
            onClick={() => onChange(goal.value)}
            className={`
              relative flex flex-col items-center text-center gap-1.5
              p-4 rounded-xl border transition-all duration-200
              ${isSelected
                ? "border-lime-400 bg-lime-400/10 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500"
              }
            `}
          >
            {/* Checkmark when selected */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-lime-400 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-zinc-900" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
            <span className="text-2xl">{goal.icon}</span>
            <span className={`text-sm font-bold ${isSelected ? "text-lime-400" : "text-zinc-200"}`}>
              {goal.label}
            </span>
            <span className="text-[11px] text-zinc-500 leading-tight">{goal.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
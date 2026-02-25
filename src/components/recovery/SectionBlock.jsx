import TipCard from "./TipCard";


const SECTION_META = {
  post_workout: { icon: "⚡", label: "Post-Workout" },
  sleep:        { icon: "🌙", label: "Sleep Habits"  },
  stretching:   { icon: "🤸", label: "Stretching"    },
};

export default function SectionBlock({ sectionKey, tips, accent }) {
  const meta = SECTION_META[sectionKey];
  if (!tips?.length) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm">{meta.icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {meta.label}
        </h3>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[9px] text-zinc-600">{tips.length} tips</span>
      </div>

      <div className="flex flex-col gap-2">
        {tips.map((tip, i) => (
          <TipCard key={tip.id} tip={tip} index={i} accent={accent} />
        ))}
      </div>
    </div>
  );
}
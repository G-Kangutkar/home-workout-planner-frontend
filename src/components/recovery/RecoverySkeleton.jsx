function SkeletonTip() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 flex items-center gap-3 animate-pulse">
      <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0" />
      <div className="flex-1 h-3 bg-zinc-800 rounded-full" />
      <div className="w-14 h-4 bg-zinc-800 rounded-full shrink-0" />
    </div>
  );
}

export default function RecoverySkeletonLoader() {
  return (
    <div className="flex flex-col gap-4">
      {["Post-Workout", "Sleep Habits", "Stretching"].map((label) => (
        <div key={label}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-16 h-2.5 bg-zinc-800 rounded-full animate-pulse" />
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="flex flex-col gap-2">
            {[1, 2].map((n) => <SkeletonTip key={n} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
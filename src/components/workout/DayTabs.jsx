// src/components/workout/DayTabs.jsx
// ─────────────────────────────────────────────────────────────────
// Shows 7 day tabs (Mon–Sun). Highlights today automatically.
// Clicking a tab switches the active day in WorkoutPlanPage.
// ─────────────────────────────────────────────────────────────────
import { DAYS_ORDER, DAY_SHORT } from "@/constants/workout.constants";

// Props:
//   activeDay  - which day is currently selected (e.g. "monday")
//   days       - array of day objects from the API response
//   todayName  - today's day name (e.g. "tuesday")
//   onSelect   - function called when user clicks a tab
export default function DayTabs({ activeDay, days, todayName, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {DAYS_ORDER.map((dayName) => {
        // Find this day's data from the API response
        const dayData  = days.find((d) => d.day === dayName);
        const isActive = activeDay === dayName;
        const isRest   = dayData?.is_rest_day;
        const isToday  = dayName === todayName;

        return (
          <button
            key={dayName}
            onClick={() => onSelect(dayName)}
            className={`
              relative flex flex-col items-center gap-1
              py-3 px-3 sm:px-5 rounded-2xl border
              min-w-13 transition-all duration-200
              ${isActive
                ? "border-lime-400 bg-lime-400/10 shadow-[0_0_15px_rgba(163,230,53,0.2)]"
                : isRest
                  ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"
              }
            `}
          >
            {/* Green dot = today */}
            {isToday && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-lime-400 border-2 border-zinc-950" />
            )}

            {/* Day label e.g. "Mon" */}
            <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-lime-400" : "text-zinc-500"}`}>
              {DAY_SHORT[dayName]}
            </span>

            {/* Small dot indicator */}
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-lime-400" : isRest ? "bg-zinc-700" : "bg-zinc-500"}`} />

            {/* "workout" or "rest" label */}
            <span className={`text-[9px] font-semibold uppercase tracking-wide ${isActive ? "text-lime-400/70" : "text-zinc-600"}`}>
              {isRest ? "rest" : "workout"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
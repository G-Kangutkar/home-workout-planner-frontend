// src/components/workout/PlanStats.jsx
// ─────────────────────────────────────────────────────────────────
// Displays the plan name (with rename button), goal badge,
// and 3 stat numbers: workout days, total exercises, rest days.
// ─────────────────────────────────────────────────────────────────
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil }  from "lucide-react";
import { GOAL_META } from "@/constants/workout.constants";

// Props:
//   plan         - the active plan object from the API
//   onRenameClick - called when user clicks the pencil icon
export default function PlanStats({ plan, onRenameClick }) {
  // Count workout days (days where is_rest_day = false)
  const workoutDays    = plan.days?.filter((d) => !d.is_rest_day) || [];
  const totalExercises = workoutDays.reduce((sum, d) => sum + (d.exercises?.length || 0), 0);
  const restDays       = 7 - workoutDays.length;

  // Get goal display config
  const goalMeta = GOAL_META[plan.goal] || GOAL_META.general_fitness;

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur-sm mb-6">
      <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">

        {/* Left: Plan name + goal badge */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-white">{plan.name}</h2>

            {/* Pencil icon to rename */}
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-zinc-600 hover:text-lime-400"
              onClick={onRenameClick}
            >
              <Pencil className="w-3 h-3" />
            </Button>
          </div>

          {/* Goal badge */}
          <Badge variant="outline" className={goalMeta.color}>
            {goalMeta.label}
          </Badge>
        </div>

        {/* Right: 3 stat numbers */}
        <div className="flex gap-6">
          {[
            { label: "Workout Days",    value: workoutDays.length },
            { label: "Total Exercises", value: totalExercises     },
            { label: "Rest Days",       value: restDays           },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                {label}
              </p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, RefreshCw, Trash2 } from "lucide-react";
import { Timer } from "lucide-react";
import { MUSCLE_META, DIFFICULTY_COLOR } from "@/constants/workout.constants";
import IntervalTimer from "@/components/intervalTimer/IntervalTimer";
import ExerciseDetailModal from "./Exercisedetailmodal";


const INTERVAL_TAGS = ["hiit", "tabata", "cardio", "plyometric"];
const isHiitExercise = (exercise) => {
  const tags = exercise?.exercise?.tags || [];
  return tags.some((t) => INTERVAL_TAGS.includes(t));
};

export default function ExerciseCard({ exercise, index, onSwap, onRemove }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTimer, setShowTimer]               = useState(false);

  const meta = MUSCLE_META[exercise.exercise?.muscle_group] || MUSCLE_META.full_body;

  const DIFFICULTY_DURATION = { beginner: 20, intermediate: 30, advanced: 45 };
  const WORK_DURATION = DIFFICULTY_DURATION[exercise.exercise?.difficulty] || 15;
  const REST_DURATION = 25;

  return (
    <>
      <Card
        className="group relative overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 rounded-2xl"
        style={{
          animationDelay: `${index * 60}ms`,
          animation: "fadeUp 0.3s ease both",
          background: "rgba(24,24,28,0.95)",
        }}
      >
        <div className={`h-0.5 w-full ${meta.bar}`} />

        <CardContent className="p-3 sm:p-4">

          {/* Exercise number, name, action buttons */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 border ${meta.badge}`}>
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm leading-tight truncate">
                  {exercise.exercise?.name}
                </p>
                <Badge variant="outline" className={`text-[9px] sm:text-[10px] mt-0.5 ${meta.badge}`}>
                  {exercise.exercise?.muscle_group?.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
              <Button
                variant="ghost" size="icon"
                className="w-7 h-7 rounded-lg hover:bg-lime-400/20 hover:text-lime-400 text-zinc-500"
                onClick={() => onSwap(exercise)}
                title="Swap exercise"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="w-7 h-7 rounded-lg hover:bg-red-400/20 hover:text-red-400 text-zinc-500"
                onClick={() => onRemove(exercise.id)}
                title="Remove exercise"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
            </div>
          </div>

          {/* Sets / Reps / Difficulty */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
            <div className="flex-1 rounded-xl px-2 sm:px-3 py-2 text-center border border-zinc-800 bg-zinc-950/80">
              <p className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">Sets</p>
              <p className="text-white font-black text-base sm:text-lg leading-none">{exercise.sets}</p>
            </div>
            <span className="text-zinc-700 font-bold text-xs sm:text-sm shrink-0">×</span>
            <div className="flex-1 rounded-xl px-2 sm:px-3 py-2 text-center border border-zinc-800 bg-zinc-950/80">
              <p className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                {exercise.duration_seconds ? "Duration" : "Reps"}
              </p>
              <p className="text-white font-black text-base sm:text-lg leading-none truncate">
                {exercise.duration_seconds ? `${exercise.duration_seconds}s` : exercise.reps}
              </p>
            </div>
            <div className="rounded-xl px-2 py-2 text-center border border-zinc-800 bg-zinc-950/80 min-w-11 sm:min-w-13">
              <p className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">Level</p>
              <p className={`font-black text-[10px] sm:text-xs capitalize leading-none ${DIFFICULTY_COLOR[exercise.exercise?.difficulty]}`}>
                {exercise.exercise?.difficulty?.slice(0, 3)}
              </p>
            </div>
          </div>

          {/* HIIT timer button */}
          {isHiitExercise(exercise) && (
            <button
              onClick={() => setShowTimer(true)}
              className="w-full flex items-center justify-center gap-2 mb-3 py-2 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 hover:bg-lime-400/20 hover:border-lime-400/40 transition-all text-xs font-bold shadow-[0_0_12px_rgba(163,230,53,0.08)] hover:shadow-[0_0_16px_rgba(163,230,53,0.15)]"
            >
              <Timer className="w-3.5 h-3.5" /> start workout
            </button>
          )}

          {/* Description row — opens detail modal on click */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="w-full flex items-center justify-between text-left gap-2 text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1"
          >
            <span className="line-clamp-1 flex-1">{exercise.exercise?.description}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
          </button>

        </CardContent>
      </Card>

      {/* Detail modal — outside Card so it never pushes sibling cards */}
      {showDetailsModal && (
        <ExerciseDetailModal
          exercise={exercise}
          meta={meta}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showTimer && (
        <IntervalTimer
          exercises={[exercise]}
          workoutName={exercise.exercise?.name}
          workDuration={WORK_DURATION}
          restDuration={REST_DURATION}
          onClose={() => setShowTimer(false)}
          onComplete={() => setShowTimer(false)}
        />
      )}
    </>
  );
}
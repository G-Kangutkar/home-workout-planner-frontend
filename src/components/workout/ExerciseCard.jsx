
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, RefreshCw, Trash2 } from "lucide-react";
import { MUSCLE_META, DIFFICULTY_COLOR } from "@/constants/workout.constants";


export default function ExerciseCard({ exercise, index, onSwap, onRemove }) {
  // Controls whether the instructions section is visible
  const [showDetails, setShowDetails] = useState(false);

  // Get color/icon config for this muscle group
  const meta = MUSCLE_META[exercise.exercise?.muscle_group] || MUSCLE_META.full_body;

  return (
    <Card
      className="group relative overflow-hidden border-zinc-800 bg-zinc-900/80 hover:border-zinc-600 transition-all duration-300"
      style={{
        animationDelay: `${index * 60}ms`,
        animation: "fadeUp 0.3s ease both",
      }}
    >
      {/* Colored top bar based on muscle group */}
      <div className={`h-0.5 w-full ${meta.bar}`} />

      <CardContent className="p-4">

        {/*  Exercise number, name, action buttons ── */}
        <div className="flex items-start justify-between gap-2 mb-3">

          {/*  Number badge + name + muscle badge */}
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border ${meta.badge}`}>
              {index + 1}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                {exercise.exercise?.name}
              </p>
              {/* Muscle group badge */}
              <Badge variant="outline" className={`text-[10px] mt-0.5 ${meta.badge}`}>
                {exercise.exercise?.muscle_group?.replace("_", " ")}
              </Badge>
            </div>
          </div>

          {/*  Swap + Remove buttons (visible on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 rounded-lg hover:bg-lime-400/20 hover:text-lime-400 text-zinc-400"
              onClick={() => onSwap(exercise)}
              title="Swap exercise"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 rounded-lg hover:bg-red-400/20 hover:text-red-400 text-zinc-400"
              onClick={() => onRemove(exercise.id)}
              title="Remove exercise"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Sets / Reps / Difficulty boxes*/}
        <div className="flex items-center gap-2 mb-3">

          {/* Sets box */}
          <div className="flex-1 rounded-xl bg-zinc-950 px-3 py-2 text-center border border-zinc-800">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">Sets</p>
            <p className="text-white font-black text-lg leading-none">{exercise.sets}</p>
          </div>

          <span className="text-zinc-700 font-bold text-sm">×</span>

          {/* Reps or Duration box */}
          <div className="flex-1 rounded-xl bg-zinc-950 px-3 py-2 text-center border border-zinc-800">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
              {exercise.duration_seconds ? "Duration" : "Reps"}
            </p>
            <p className="text-white font-black text-lg leading-none truncate">
              {exercise.duration_seconds ? `${exercise.duration_seconds}s` : exercise.reps}
            </p>
          </div>

          {/* Difficulty box */}
          <div className="rounded-xl bg-zinc-950 px-2 py-2 text-center border border-zinc-800">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">Level</p>
            <p className={`font-black text-xs capitalize leading-none ${DIFFICULTY_COLOR[exercise.exercise?.difficulty]}`}>
              {exercise.exercise?.difficulty?.slice(0, 3)}
            </p>
          </div>
        </div>

        {/*  Description + expand toggle*/}
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="w-full flex items-center justify-between text-left gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <span className="line-clamp-1">{exercise.exercise?.description}</span>
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
        </button>

        {/* Expanded: Instructions + Tags */}
        {showDetails && (
          <div
            className="mt-3 pt-3 border-t border-zinc-800"
            style={{ animation: "fadeUp 0.2s ease both" }}
          >
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold mb-1">
              How to do it
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {exercise.exercise?.instructions}
            </p>
            {exercise.exercise?.video_url && (
              <a
                href={exercise.exercise.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold
                  text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.7 12 2.7 12 2.7s-4.2 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.5 12 21.5 12 21.5s4.2 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
                </svg>
                Watch Tutorial
              </a>
            )}


            {/* Tags */}
            {exercise.exercise?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {exercise.exercise.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
// src/components/workout/SwapModal.jsx
// ─────────────────────────────────────────────────────────────────
// A shadcn Dialog for swapping an exercise.
// Shows searchable, filterable exercise library.
// User selects a replacement then confirms.
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input }  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { Check }  from "lucide-react";
import { getExercises } from "@/lib/api";
import { MUSCLE_META, MUSCLE_LIST, DIFFICULTY_COLOR } from "@/constants/workout.constants";

// Props:
//   open      - whether the dialog is visible
//   targetEx  - the exercise being replaced
//   onClose   - called when user cancels
//   onSwap    - called with (dayExerciseId, newExerciseId)
export default function SwapModal({ open, targetEx, onClose, onSwap }) {
  const [exercises, setExercises]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [muscleFilter, setMuscle]   = useState("");
  const [selected, setSelected]     = useState(null);
  const [swapping, setSwapping]     = useState(false);

  // Load exercise library when modal opens
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setSelected(null);
    setSearch("");
    setMuscle("");

    getExercises()
      .then((data) => setExercises(data.exercises || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  // Filter exercises by search text and muscle group
  const filtered = exercises.filter((ex) => {
    const matchesSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = !muscleFilter || ex.muscle_group === muscleFilter;
    return matchesSearch && matchesMuscle;
  });

  // Handle confirm swap
  const handleSwap = async () => {
    if (!selected) return;
    setSwapping(true);
    await onSwap(targetEx.id, selected.id);
    setSwapping(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">

        {/* Header */}
        <DialogHeader className="p-5 border-b border-zinc-800">
          <DialogTitle className="text-white font-black">Swap Exercise</DialogTitle>
          <p className="text-xs text-zinc-500 mt-0.5">
            Replacing:{" "}
            <span className="text-lime-400 font-semibold">
              {targetEx?.exercise?.name}
            </span>
          </p>
        </DialogHeader>

        {/* Search input */}
        <div className="p-4 border-b border-zinc-800 flex flex-col gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises…"
            className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-lime-400"
          />

          {/* Muscle group filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* "All" chip */}
            <button
              onClick={() => setMuscle("")}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all
                ${!muscleFilter
                  ? "bg-lime-400 text-zinc-900 border-lime-400"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                }`}
            >
              All
            </button>

            {/* One chip per muscle group */}
            {MUSCLE_LIST.map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(muscleFilter === m ? "" : m)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all
                  ${muscleFilter === m
                    ? "bg-lime-400 text-zinc-900 border-lime-400"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                  }`}
              >
                {m.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {loading ? (
            // Loading skeletons
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-800 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <p className="text-center text-zinc-600 py-8">No exercises found</p>
          ) : (
            filtered.map((ex) => {
              const meta       = MUSCLE_META[ex.muscle_group] || MUSCLE_META.full_body;
              const isSelected = selected?.id === ex.id;

              return (
                <button
                  key={ex.id}
                  onClick={() => setSelected(isSelected ? null : ex)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150
                    ${isSelected
                      ? "border-lime-400 bg-lime-400/10"
                      : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-600"
                    }`}
                >
                  {/* Muscle icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border text-sm ${meta.badge}`}>
                    {meta.icon}
                  </div>

                  {/* Exercise info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isSelected ? "text-lime-400" : "text-zinc-200"}`}>
                      {ex.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className={`text-[10px] ${meta.badge}`}>
                        {ex.muscle_group.replace("_", " ")}
                      </Badge>
                      <span className={`text-[10px] font-semibold capitalize ${DIFFICULTY_COLOR[ex.difficulty]}`}>
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Check icon when selected */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-lime-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-zinc-900" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer: Cancel + Confirm */}
        <div className="p-4 border-t border-zinc-800 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSwap}
            disabled={!selected || swapping}
            className="flex-1 bg-lime-400 hover:bg-lime-300 text-zinc-900 font-black disabled:opacity-50"
          >
            {swapping ? "Swapping…" : "Swap Exercise →"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
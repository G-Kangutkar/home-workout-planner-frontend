// src/pages/workout/WorkoutPlanPage.jsx
// ─────────────────────────────────────────────────────────────────
// The main workout plan page.
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner"; // ✅ sonner instead of shadcn toast
import { Button } from "@/components/ui/button";
import { RefreshCw, Dumbbell } from "lucide-react";

// Child components
import DayTabs       from "@/components/workout/DayTabs";
import ExerciseCard  from "@/components/workout/ExerciseCard";
import RestDayCard   from "@/components/workout/RestDayCard";
import PlanStats     from "@/components/workout/PlanStats";
import SwapModal     from "@/components/workout/SwapModal";
import RenameModal   from "@/components/workout/RenameModal";
import EmptyPlanPage from "@/pages/workout/EmptyPlanPage";

// Constants + API
import { DAYS_ORDER, DAY_FULL } from "@/constants/workout.constants";
import {
  getActivePlan,
  generatePlan,
  renamePlan,
  swapExercise,
  removeExercise,
} from "@/lib/api";

// ── Background glow decoration ────────────────────────────────────
function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 -left-20 w-87.5 h-87.5 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }} />
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-zinc-800/60 animate-pulse" />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ════════════════════════════════════════════════════════════════
export default function WorkoutPlanPage() {

  // ── State ─────────────────────────────────────────────────────
  const [plan, setPlan]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay]   = useState("monday");
  const [swapTarget, setSwapTarget] = useState(null);
  const [showRename, setShowRename] = useState(false);
  const [error, setError]           = useState("");

  // Today's day name e.g. "tuesday" ==2 and 0== sunday hence 6 because in our array it is 7th day
  const todayName = DAYS_ORDER[
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  ];

  // ── Fetch active plan ─────────────────────────────────────────
  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getActivePlan();
      setPlan(data.plan);
      const hasToday     = data.plan.days.find((d) => d.day === todayName);
      const firstWorkout = data.plan.days.find((d) => !d.is_rest_day);
      setActiveDay(hasToday ? todayName : firstWorkout?.day || "monday");
    } catch (err) {
      if (err.message.includes("No active")) setPlan(null);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [todayName]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  // ── Generate plan ─────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await generatePlan();
      await fetchPlan();
      toast.success("Workout plan generated!"); // ✅ sonner syntax
    } catch (err) {
      setError(err.message);
      toast.error(err.message); // ✅ sonner syntax
    } finally {
      setGenerating(false);
    }
  };

  // ── Rename plan ───────────────────────────────────────────────
  const handleRename = async (newName) => {
    try {
      await renamePlan(plan.id, newName);
      setPlan((prev) => ({ ...prev, name: newName }));
      setShowRename(false);
      toast.success("Plan renamed!"); // ✅ sonner syntax
    } catch (err) {
      toast.error(err.message); // ✅ sonner syntax
    }
  };

  // ── Swap exercise ─────────────────────────────────────────────
  const handleSwap = async (dayExerciseId, newExerciseId) => {
    try {
      const data = await swapExercise(dayExerciseId, newExerciseId);
      setPlan((prev) => ({
        ...prev,
        days: prev.days.map((day) => ({
          ...day,
          exercises: day.exercises.map((ex) =>
            ex.id === dayExerciseId ? { ...ex, ...data.dayExercise } : ex
          ),
        })),
      }));
      setSwapTarget(null);
      toast.success("Exercise swapped!"); // ✅ sonner syntax
    } catch (err) {
      toast.error(err.message); // ✅ sonner syntax
    }
  };

  // ── Remove exercise ───────────────────────────────────────────
  const handleRemove = async (dayExerciseId) => {
    if (!window.confirm("Remove this exercise?")) return;
    try {
      await removeExercise(dayExerciseId);
      setPlan((prev) => ({
        ...prev,
        days: prev.days.map((day) => ({
          ...day,
          exercises: day.exercises.filter((ex) => ex.id !== dayExerciseId),
        })),
      }));
      toast.success("Exercise removed."); // ✅ sonner syntax
    } catch (err) {
      toast.error(err.message); // ✅ sonner syntax
    }
  };

  // Current active day data
  const activeDayData = plan?.days?.find((d) => d.day === activeDay);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <BackgroundDecor />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#a3e635" }}>
              <Dumbbell className="w-4 h-4 text-zinc-900" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Workout Plan</h1>
              <p className="text-xs text-zinc-600">Your personalized weekly plan</p>
            </div>
          </div>

          {/* Regenerate button */}
          {plan && (
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={generating}
              className="border-zinc-700 text-zinc-300 hover:border-zinc-500 bg-zinc-900"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${generating ? "animate-spin" : ""}`} />
              {generating ? "Generating…" : "Regenerate"}
            </Button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* 3 states: loading / empty / plan */}
        {loading ? (
          <LoadingSkeleton />
        ) : !plan ? (
          <EmptyPlanPage onGenerate={handleGenerate} loading={generating} />
        ) : (
          <>
            {/* Plan name, goal, stats */}
            <PlanStats plan={plan} onRenameClick={() => setShowRename(true)} />

            {/* Day tabs */}
            <DayTabs
              activeDay={activeDay}
              days={plan.days}
              todayName={todayName}
              onSelect={setActiveDay}
            />

            {/* Active day header */}
            <div className="flex items-center justify-between flex-wrap gap-2 mt-6 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white">{DAY_FULL[activeDay]}</h2>
                {activeDay === todayName && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                    Today
                  </span>
                )}
              </div>
              {!activeDayData?.is_rest_day && (
                <p className="text-sm text-zinc-500">
                  <span className="text-zinc-300 font-semibold">{activeDayData?.focus}</span>
                  {" · "}{activeDayData?.exercises?.length} exercises
                </p>
              )}
            </div>

            {/* Exercise grid or rest card */}
            <div key={activeDay} style={{ animation: "fadeUp 0.25s ease both" }}>
              {activeDayData?.is_rest_day ? (
                <RestDayCard />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeDayData?.exercises?.map((ex, i) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      index={i}
                      onSwap={setSwapTarget}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <SwapModal
        open={!!swapTarget}
        targetEx={swapTarget}
        onClose={() => setSwapTarget(null)}
        onSwap={handleSwap}
      />
      <RenameModal
        open={showRename}
        currentName={plan?.name || ""}
        onClose={() => setShowRename(false)}
        onSave={handleRename}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
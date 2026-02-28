
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { CheckCircle2, TrendingUp, Flame } from "lucide-react";
// import { logWorkout } from "@/lib/api.js";
import { logWorkoutOffline as logWorkout } from "@/lib/offlineService.js";
import axios from "axios";

export default function CompleteWorkoutButton({ dayId, dayName, exercises }) {
  const [open, setOpen]         = useState(false);
  const [duration, setDuration] = useState("");
  const [notes, setNotes]       = useState("");
  const [logging, setLogging]   = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const [adaptResult, setAdaptResult]         = useState(null);
  const [showAdaptDialog, setShowAdaptDialog] = useState(false);

  const exerciseMap = Object.fromEntries(
    exercises.map((ex) => [
      ex.exercise?.id || ex.exercise_id,
      ex.exercise?.name || "Exercise",
    ])
  );

  const checkIfLoggedToday = async () => {
    try {
      const jwt = localStorage.getItem("token");
      const res = await axios.get(
        `https://home-workout-planner.onrender.com/api/check-logged/${dayId}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setIsDisable(res.data.alreadyLogged);
    } catch (err) {
      console.error(err);
      const { db } = await import("@/lib/db");
    const today = new Date().toLocaleDateString("en-CA"); // "2026-02-27"
    const logged = await db.workoutHistory
      .where("day_id").equals(dayId)
      .filter((h) => h.logged_at.startsWith(today))
      .first();
    setIsDisable(!!logged);
    }
  };

  useEffect(() => {
    checkIfLoggedToday();
  }, [dayId]);

  const handleComplete = async () => {
    if (!duration || duration < 1) {
      toast.error("Please enter workout duration");
      return;
    }

    setLogging(true);
    try {
      const exercisesData = exercises.map((ex) => ({
        exercise_id:      ex.exercise?.id || ex.exercise_id,
        sets_completed:   ex.sets,
        reps_completed:   ex.reps,
        duration_seconds: ex.duration_seconds,
      }));

      await logWorkout({
      day_id:           dayId,
      day_name:         dayName,       // ← this is what shows in history page
      duration_minutes: parseInt(duration),
      exercises:        exercisesData,
      notes:            notes.trim() || null,
      logged_at:        new Date().toISOString(), // ← add this so history sorts correctly
    });
    console.log("✅ logWorkout done, about to call adapt-intensity");
        const jwt = localStorage.getItem("token");
        console.log("JWT:", jwt);
      //  Call adapt-intensity after logging
      try {
        const res = await axios.post(
          "https://home-workout-planner.onrender.com/api/adapt-intensity",
          { dayId },
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        setAdaptResult(res.data);
        setShowAdaptDialog(true);
      } catch (adaptErr) {
        console.warn("Adaptive intensity error:", adaptErr.message);
      }

      toast.success("🎉 Workout completed and logged!");
      //  Close dialog and reset state AFTER everything is done
      setOpen(false);
      setDuration("");
      setNotes("");
      checkIfLoggedToday(); // re-check so button disables immediately
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLogging(false);
    }
  };

  const streakPercent = adaptResult
    ? Math.min(100, ((adaptResult.streakDays || 0) / 2) * 100)
    : 0;

  return (
    <>
      {/*Main button opens the dialog — does NOT call handleComplete directly */}
      <Button
        onClick={() => setOpen(true)}
        disabled={isDisable}
        className={`font-black transition-all
          ${isDisable
            ? "bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-60"
            : "bg-lime-400 hover:bg-lime-300 text-zinc-900 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]"
          }`}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        {/*  Show different label when already logged */}
        {isDisable ? "Already Logged Today ✓" : "Complete Workout"}
      </Button>

      {/* ── Complete Workout Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="bg-zinc-900 border-zinc-700 text-white sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-black">
              Complete {dayName.charAt(0).toUpperCase() + dayName.slice(1)} Workout
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration" className="text-zinc-400">
                Workout Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="1"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="notes" className="text-zinc-400">
                Notes (optional)
              </Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go?"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div className="rounded-xl bg-lime-400/10 border border-lime-400/30 p-3">
              <p className="text-xs text-lime-400 font-semibold">
                ✨ {exercises.length} exercises will be logged
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            {/*  This button submits the form — calls handleComplete */}
            <Button
              onClick={handleComplete}
              disabled={logging || !duration}
              className="bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold"
            >
              {logging ? "Logging..." : "Complete ✓"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Adaptive Intensity Result Dialog ── */}
      <Dialog open={showAdaptDialog} onOpenChange={setShowAdaptDialog}>
        <DialogContent
          aria-describedby={undefined}
          className="bg-zinc-900 border-zinc-700 text-white sm:max-w-md"
        >
          {adaptResult?.hasStreak ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-white font-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-lime-400" />
                  Intensity Increased! 🔥
                </DialogTitle>
              </DialogHeader>

              <div className="py-2">
                <p className="text-zinc-500 text-sm mb-4">
                  You completed <span className="text-lime-400 font-bold">2 days</span> in a row! Your workouts just got harder:
                </p>

                <div className="flex flex-col gap-2">
                  {adaptResult.adjustments.map((adj) => (
                    <div
                      key={adj.planExId}
                      className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3"
                    >
                      <p className="text-zinc-200 text-sm font-semibold truncate max-w-37.5">
                        {exerciseMap[adj.exerciseId] || "Exercise"}
                      </p>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-600 mb-0.5">Sets</p>
                          <p className="text-sm font-black">
                            <span className="text-zinc-500">{adj.oldSets}</span>
                            <span className="text-zinc-600 mx-1">→</span>
                            <span className="text-lime-400">{adj.newSets}</span>
                          </p>
                        </div>
                        {adj.oldReps && (
                          <div className="text-center">
                            <p className="text-[10px] text-zinc-600 mb-0.5">Reps</p>
                            <p className="text-sm font-black">
                              <span className="text-zinc-500">{adj.oldReps}</span>
                              <span className="text-zinc-600 mx-1">→</span>
                              <span className="text-lime-400">{adj.newReps}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-zinc-600 text-xs mt-4 text-center">
                  Keep the streak going for more increases!
                </p>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setShowAdaptDialog(false)}
                  className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-900 font-black"
                >
                  Let's Go 💪
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-white font-black flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Keep Your Streak Going!
                </DialogTitle>
              </DialogHeader>

              <div className="py-2">
                <p className="text-zinc-500 text-sm mb-5">
                  Complete workouts every day for{" "}
                  <span className="text-white font-bold">2 days</span> to unlock
                  increased reps and sets.
                </p>

                <div className="bg-zinc-800 rounded-2xl p-4 mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-xs text-zinc-500">Current Streak</p>
                      <p className="text-3xl font-black text-white">
                        {adaptResult?.streakDays || 0}
                        <span className="text-zinc-500 text-lg font-semibold"> / 2 days</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Days left</p>
                      <p className="text-2xl font-black text-orange-400">
                        {adaptResult?.daysNeeded || 2}
                      </p>
                    </div>
                  </div>

                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all duration-700"
                      style={{ width: `${streakPercent}%` }}
                    />
                  </div>

                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            i < (adaptResult?.streakDays || 0)
                              ? "#fb923c"
                              : "#3f3f46",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-zinc-600 text-xs text-center">
                  Don't break the chain! Come back tomorrow 💪
                </p>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setShowAdaptDialog(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black border border-zinc-700"
                >
                  Got it!
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
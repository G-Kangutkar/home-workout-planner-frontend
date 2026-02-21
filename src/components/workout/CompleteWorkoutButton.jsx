
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { logWorkout } from "@/lib/api";

export default function CompleteWorkoutButton({ dayId, dayName, exercises }) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [logging, setLogging] = useState(false);

  const handleComplete = async () => {
    if (!duration || duration < 1) {
      toast.error("Please enter workout duration");
      return;
    }

    setLogging(true);
    try {
      // Map exercises to the format backend expects
      const exercisesData = exercises.map(ex => ({
        exercise_id: ex.exercise?.id || ex.exercise_id,
        sets_completed: ex.sets,
        reps_completed: ex.reps,
        duration_seconds: ex.duration_seconds,
      }));

      await logWorkout({
        day_id: dayId,
        day_name: dayName,
        duration_minutes: parseInt(duration),
        exercises: exercisesData,
        notes: notes.trim() || null
      });

      toast.success("🎉 Workout completed and logged!");
      setOpen(false);
      setDuration("");
      setNotes("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLogging(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-lime-400 hover:bg-lime-300 text-zinc-900 font-black
          shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]"
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Complete Workout
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-md">
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
    </>
  );
}
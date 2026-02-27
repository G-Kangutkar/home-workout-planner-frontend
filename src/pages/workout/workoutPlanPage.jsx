
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.jsx";
import { RefreshCw, Dumbbell } from "lucide-react";

// Child components
import DayTabs from "@/components/workout/DayTabs.jsx";
import ExerciseCard from "@/components/workout/ExerciseCard.jsx";
import RestDayCard from "@/components/workout/RestDayCard.jsx";
import PlanStats from "@/components/workout/PlanStats.jsx";
import SwapModal from "@/components/workout/SwapModel.jsx";
import RenameModal from "@/components/workout/RenameModal.jsx";
import EmptyPlanPage from "@/pages/workout/EmptyPlanPage.jsx";

import { DAYS_ORDER, DAY_FULL } from "@/constants/workout.constants.js";
import {
  getActivePlan,
  generatePlan,
  renamePlan,
  swapExercise,
  removeExercise,
} from "@/lib/api.js";
import Navbar from "@/components/Navbar";
import CompleteWorkoutButton from "@/components/workout/CompleteWorkoutButton.jsx";
import SetReminderModal from "@/components/remainder/Remainder.jsx";
import { getActivePlanOffline, seedOfflineData } from "@/lib/offlineService.js";

//  Background glow decoration 
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

// Loading skeleton 
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-zinc-800/60 animate-pulse" />
      ))}
    </div>
  );
}

export default function WorkoutPlanPage() {


  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState("monday");
  const [swapTarget, setSwapTarget] = useState(null);
  const [showRename, setShowRename] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(15);

  // Today's day name e.g. "tuesday" ==2 and 0== sunday hence 6 because in our array it is 7th day
  const todayName = DAYS_ORDER[
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  ];
//  console.log("plan",plan)
  //  Fetch active plan 
  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getActivePlanOffline();
      const duration =
        data.plan?.workout_duration ||
        data.profile?.workout_duration ||
        data.workout_duration ||
        15;
      setWorkoutDuration(duration);
      setPlan(data.plan);
      const hasToday = data.plan.days.find((d) => d.day === todayName);
      const firstWorkout = data.plan.days.find((d) => !d.is_rest_day);
      setActiveDay(hasToday ? todayName : firstWorkout?.day || "monday");
    } catch (err) {
      if (err.response?.status === 404) {
        setPlan(null);
      } else {
        setError(err.response?.data?.error || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [todayName]);

  useEffect(() => { fetchPlan(); 
     seedOfflineData()
  }, [fetchPlan]);

  //  Generate plan 
  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await generatePlan();
      await fetchPlan();
      toast.success("Workout plan generated!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  //  Rename plan 
  const handleRename = async (newName) => {
    try {
      await renamePlan(plan.id, newName);
      setPlan((prev) => ({ ...prev, name: newName }));
      setShowRename(false);
      toast.success("Plan renamed!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  //  Swap exercise 
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
      toast.success("Exercise swapped!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  //  Remove exercise 
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
      toast.success("Exercise removed.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Current active day data
  const activeDayData = plan?.days?.find((d) => d.day === activeDay);


  return (
    // <div><Navbar />
    //   <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
    //     <BackgroundDecor />


    //     <div className="max-w-5xl mx-auto mt-10 px-4 py-8 sm:px-6 lg:px-8">

    //       {/* Page header */}
    //       <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
    //         <div className="flex items-center gap-3">
    //           <div className="w-9 h-9 rounded-xl flex items-center justify-center"
    //             style={{ background: "#a3e635" }}>
    //             <Dumbbell className="w-4 h-4 text-zinc-900" />
    //           </div>
    //           <div>
    //             <h1 className="text-3xl font-black text-white tracking-tight">Workout Plan</h1>
    //             <p className="text-xs text-zinc-600">Your personalized weekly plan</p>
    //           </div>
    //         </div>

    //         {/* Regenerate button */}
    //         {plan && (
    //           <Button
    //             variant="outline"
    //             onClick={handleGenerate}
    //             disabled={generating}
    //             className="border-zinc-700 text-zinc-300 hover:border-zinc-500 bg-zinc-900"
    //           >
    //             <RefreshCw className={`w-4 h-4 mr-2 ${generating ? "animate-spin" : ""}`} />
    //             {generating ? "Generating…" : "Regenerate"}
    //           </Button>
    //         )}
    //       </div>

    //       {/* Error message */}
    //       {error && (
    //         <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
    //           ⚠️ {error}
    //         </div>
    //       )}

    //       {/* 3 states: loading / empty / plan */}
    //       {loading ? (
    //         <LoadingSkeleton />
    //       ) : !plan ? (
    //         <EmptyPlanPage onGenerate={handleGenerate} loading={generating} />
    //       ) : (
    //         <>
    //           {/* Plan name, goal, stats */}
    //           <PlanStats plan={plan} onRenameClick={() => setShowRename(true)} />

    //           {/* Day tabs */}
    //           <DayTabs
    //             activeDay={activeDay}
    //             days={plan.days}
    //             todayName={todayName}
    //             onSelect={setActiveDay}
    //           />

    //           {/* Active day header */}
    //           <div className="flex items-center justify-between flex-wrap gap-2 mt-6 mb-4">
    //             <div className="flex items-center gap-3">
    //               <h2 className="text-2xl font-black text-white">{DAY_FULL[activeDay]}</h2>
    //               {activeDay === todayName && (
    //                 <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
    //                   Today
    //                 </span>
    //               )}
    //             </div>
    //             {!activeDayData?.is_rest_day && (
    //               <p className="text-sm text-zinc-500">
    //                 <span className="text-zinc-300 font-semibold">{activeDayData?.focus}</span>
    //                 {" · "}{activeDayData?.exercises?.length} exercises
    //               </p>
    //             )}
    //           </div>
    //           <div className="flex justify-center mb-1.5 gap-3 mt-10 px-4 sm:mt-20">
    //             <button
    //               onClick={() => setOpen(true)}
    //               className="w-full sm:w-auto px-6 py-3 bg-lime-500 text-white rounded-xl hover:bg-lime-700 transition"
    //             >
    //               Set Workout Reminder
    //             </button>

    //             <SetReminderModal open={open} onClose={() => setOpen(false)} />
    //             {/* {open && <SetReminderModal open={open}  onClose={() => setOpen(false)} />} */}
    //           </div>
    //           {!activeDayData?.is_rest_day && activeDayData?.exercises?.length > 0 && (
    //             <div className="flex justify-center sm:justify-end px-4 mb-4">
    //               <div className="w-full sm:w-auto gap-3">
    //             {/* <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"> */}
    //                  {/* <StartIntervalWorkout */}
    //             {/* //       exercises={activeDayData.exercises}
    //             //       workoutDuration={workoutDuration}
    //             //       workoutName={`${DAY_FULL[activeDay]} — ${activeDayData?.focus || "Workout"}`}
    //             //       onComplete={() => toast.success("Interval workout complete! 💪")}
    //             //     /> */}
    //                 <CompleteWorkoutButton
    //                   dayId={activeDayData.id}
    //                   dayName={activeDay}
    //                   exercises={activeDayData.exercises}
    //                 />
    //               </div>
    //              {/* </div> */}
    //             </div>
    //           )}

    //           {/* Exercise grid or rest card */}
    //           <div key={activeDay} style={{ animation: "fadeUp 0.25s ease both" }}>
    //             {activeDayData?.is_rest_day ? (
    //               <RestDayCard />
    //             ) : (
    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //                 {activeDayData?.exercises?.map((ex, i) => (
    //                   <ExerciseCard
    //                     key={ex.id}
    //                     exercise={ex}
    //                     index={i}
    //                     onSwap={setSwapTarget}
    //                     onRemove={handleRemove}
    //                   />
    //                 ))}
    //               </div>
    //             )}
    //           </div>
    //         </>
    //       )}
    //     </div>

    //     {/* Modals */}
    //     <SwapModal
    //       open={!!swapTarget}
    //       targetEx={swapTarget}
    //       onClose={() => setSwapTarget(null)}
    //       onSwap={handleSwap}
    //     />
    //     <RenameModal
    //       open={showRename}
    //       currentName={plan?.name || ""}
    //       onClose={() => setShowRename(false)}
    //       onSave={handleRename}
    //     />

    //     <style>{`
    //     @keyframes fadeUp {
    //       from { opacity: 0; transform: translateY(10px); }
    //       to   { opacity: 1; transform: translateY(0); }
    //     }
    //     .scrollbar-hide::-webkit-scrollbar { display: none; }
    //     .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    //   `}</style>
    //   </div>
    // </div>
  //  <div className="w-full overflow-x-hidden">
  //     <Navbar />
  //     <div className="min-h-screen w-full" style={{ background: "#111318" }}>
  //       <BackgroundDecor />

  //       <div className="w-full max-w-5xl mx-auto px-2 pt-20  pb-10 sm:px-3 sm:pt-24 lg:px-4">

  //         {/* Page header */}
  //         <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
  //           {/* <div className="flex items-center gap-3">
  //             <div
  //               className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(163,230,53,0.4)]"
  //               style={{ background: "#a3e635" }}
  //             >
  //               <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />
  //             </div>
  //             <div className="min-w-0">
  //               <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight truncate">Workout Plan</h1>
  //               <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 font-medium tracking-wide uppercase">Your personalized weekly plan</p>
  //             </div>
  //           </div> */}

  //           {/* Regenerate button */}
  //           {plan && (
  //             <Button
  //               variant="outline"
  //               onClick={handleGenerate}
  //               disabled={generating}
  //               className="self-start sm:self-auto border-zinc-700 text-zinc-300 hover:border-lime-400/50 hover:text-lime-400 bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 rounded-xl font-semibold text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10 w-full sm:w-auto"
  //             >
  //               <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${generating ? "animate-spin" : ""}`} />
  //               {generating ? "Generating…" : "Regenerate"}
  //             </Button>
  //           )}
  //         </div>

  //         {/* Error message */}
  //         {error && (
  //           <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
  //             ⚠️ {error}
  //           </div>
  //         )}

  //         {/* 3 states: loading / empty / plan */}
  //         {loading ? (
  //           <LoadingSkeleton />
  //         ) : !plan ? (
  //           <EmptyPlanPage onGenerate={handleGenerate} loading={generating} />
  //         ) : (
  //           <>
  //             {/* Plan name, goal, stats */}
  //             <PlanStats plan={plan} onRenameClick={() => setShowRename(true)} />

  //             {/* Day tabs */}
  //             <DayTabs
  //               activeDay={activeDay}
  //               days={plan.days}
  //               todayName={todayName}
  //               onSelect={setActiveDay}
  //             />

  //             {/* Active day header */}
  //             <div className="flex flex-col gap-1.5 mt-5 sm:mt-6 mb-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
  //               <div className="flex items-center gap-2 sm:gap-3">
  //                 <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">{DAY_FULL[activeDay]}</h2>
  //                 {activeDay === todayName && (
  //                   <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/25 shadow-[0_0_12px_rgba(163,230,53,0.15)]">
  //                     Today
  //                   </span>
  //                 )}
  //               </div>
  //               {!activeDayData?.is_rest_day && (
  //                 <p className="text-xs sm:text-sm text-zinc-500">
  //                   <span className="text-cyan-400 font-semibold">{activeDayData?.focus}</span>
  //                   {" · "}
  //                   <span className="text-zinc-400">{activeDayData?.exercises?.length} exercises</span>
  //                 </p>
  //               )}
  //             </div>

  //             {/* Set Reminder + Complete buttons */}
  //             <div className="flex flex-col gap-3 mt-5 sm:mt-8 mb-4 sm:flex-row sm:items-center sm:justify-between">
  //               <button
  //                 onClick={() => setOpen(true)}
  //                 className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:-translate-y-0.5 active:translate-y-0"
  //               >
  //                 Set Workout Reminder
  //               </button>

  //               <SetReminderModal open={open} onClose={() => setOpen(false)} />

  //               {!activeDayData?.is_rest_day && activeDayData?.exercises?.length > 0 && (
  //                 <div className="w-full sm:w-auto">
  //                   <CompleteWorkoutButton
  //                     dayId={activeDayData.id}
  //                     dayName={activeDay}
  //                     exercises={activeDayData.exercises}
  //                   />
  //                 </div>
  //               )}
  //             </div>

  //             {/* Exercise grid or rest card */}
  //             <div key={activeDay} style={{ animation: "fadeUp 0.25s ease both" }}>
  //               {activeDayData?.is_rest_day ? (
  //                 <RestDayCard />
  //               ) : (
  //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  //                   {activeDayData?.exercises?.map((ex, i) => (
  //                     <ExerciseCard
  //                       key={ex.id}
  //                       exercise={ex}
  //                       index={i}
  //                       onSwap={setSwapTarget}
  //                       onRemove={handleRemove}
  //                     />
  //                   ))}
  //                 </div>
  //               )}
  //             </div>
  //           </>
  //         )}
  //       </div>

  //       {/* Modals */}
  //       <SwapModal
  //         open={!!swapTarget}
  //         targetEx={swapTarget}
  //         onClose={() => setSwapTarget(null)}
  //         onSwap={handleSwap}
  //       />
  //       <RenameModal
  //         open={showRename}
  //         currentName={plan?.name || ""}
  //         onClose={() => setShowRename(false)}
  //         onSave={handleRename}
  //       />

  //       <style>{`
  //       @keyframes fadeUp {
  //         from { opacity: 0; transform: translateY(10px); }
  //         to   { opacity: 1; transform: translateY(0); }
  //       }
  //       .scrollbar-hide::-webkit-scrollbar { display: none; }
  //       .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  //     `}</style>
  //     </div>
  //   </div>
  <div className="w-full overflow-x-hidden relative z-0">
      <Navbar />
      <div className="min-h-screen w-full relative z-0" style={{ background: "#111318" }}>
        <BackgroundDecor />

        <div className="w-full max-w-5xl mx-auto px-4 pt-20 pb-10 sm:px-6 sm:pt-24 lg:px-8">

          {/* Page header */}
          <div className="flex  justify-end gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
            

            {/* Regenerate button */}
            {plan && (
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={generating}
                className="self-start sm:self-auto border-zinc-700 text-zinc-300 hover:border-lime-400/50 hover:text-lime-400 bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 rounded-xl font-semibold text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10 w-full sm:w-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Generating…" : "Regenerate"}
              </Button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
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
              <div className="flex flex-col gap-1.5 mt-5 sm:mt-6 mb-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">{DAY_FULL[activeDay]}</h2>
                  {activeDay === todayName && (
                    <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/25 shadow-[0_0_12px_rgba(163,230,53,0.15)]">
                      Today
                    </span>
                  )}
                </div>
                {!activeDayData?.is_rest_day && (
                  <p className="text-xs sm:text-sm text-zinc-500">
                    <span className="text-cyan-400 font-semibold">{activeDayData?.focus}</span>
                    {" · "}
                    <span className="text-zinc-400">{activeDayData?.exercises?.length} exercises</span>
                  </p>
                )}
              </div>

              {/* Set Reminder + Complete buttons */}
              <div className="flex flex-col gap-3 mt-5 sm:mt-8 mb-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => setOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Set Workout Reminder
                </button>

                <SetReminderModal open={open} onClose={() => setOpen(false)} />

                {!activeDayData?.is_rest_day && activeDayData?.exercises?.length > 0 && (
                  <div className="w-full sm:w-auto">
                    <CompleteWorkoutButton
                      dayId={activeDayData.id}
                      dayName={activeDay}
                      exercises={activeDayData.exercises}
                    />
                  </div>
                )}
              </div>

              {/* Exercise grid or rest card */}
              <div key={activeDay} style={{ animation: "fadeUp 0.25s ease both" }}>
                {activeDayData?.is_rest_day ? (
                  <RestDayCard goal={plan.goal} />
                ) : (
                  <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
    </div>
  );
}
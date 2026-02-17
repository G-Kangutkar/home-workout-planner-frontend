// src/pages/workout/EmptyPlanPage.jsx
// ─────────────────────────────────────────────────────────────────
// Shown when the user doesn't have a workout plan yet.
// Has a single "Generate My Plan" button.
// ─────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Zap }    from "lucide-react";

// Props:
//   onGenerate - function to call when user clicks the button
//   loading    - shows spinner while plan is being generated
export default function EmptyPlanPage({ onGenerate, loading }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">

      {/* Big emoji icon */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
        style={{
          background: "rgba(163,230,53,0.1)",
          border: "1px solid rgba(163,230,53,0.2)",
        }}
      >
        🏋️
      </div>

      {/* Title and subtitle */}
      <div>
        <h2 className="text-3xl font-black text-white">No Plan Yet</h2>
        <p className="text-zinc-500 mt-2 max-w-sm text-sm leading-relaxed">
          We'll generate a personalized 3-day workout plan based on your fitness profile and goals.
        </p>
      </div>

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={loading}
        className="px-8 py-6 text-base rounded-2xl bg-lime-400 hover:bg-lime-300 text-zinc-900 font-black
          shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:shadow-[0_0_40px_rgba(163,230,53,0.6)] transition-all"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            Generate My Plan
          </>
        )}
      </Button>

      {/* Note about profile */}
      <p className="text-xs text-zinc-700">
        Make sure your fitness profile is set up first.
      </p>

    </div>
  );
}
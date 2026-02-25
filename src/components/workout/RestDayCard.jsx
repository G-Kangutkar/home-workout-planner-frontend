
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent }    from "@/components/ui/card";
import RecoverySkeletonLoader from "../recovery/RecoverySkeleton";
import SectionBlock from "../recovery/SectionBlock";



// ── Per-goal visual config ────────────────────────────────────────────────────
const GOAL_META = {
  weight_loss: {
    emoji:   "🔥",
    label:   "Weight Loss",
    accent:  "#f97316",
    tagline: "Burn smart, recover faster",
  },
  flexibility: {
    emoji:   "🧘",
    label:   "Flexibility",
    accent:  "#a78bfa",
    tagline: "Lengthen, breathe, restore",
  },
  general_fitness: {
    emoji:   "⚡",
    label:   "General Fitness",
    accent:  "#38bdf8",
    tagline: "Balance is your superpower",
  },
  muscle_gain: {
    emoji:   "💪",
    label:   "Muscle Gain",
    accent:  "#a3e635",
    tagline: "Muscle is built at rest",
  },
};


export default function RestDayCard({ goal }) {
  const [sections, setSections] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Normalise goal — fall back to general_fitness if missing/unrecognised
  const safeGoal = GOAL_META[goal] ? goal : "general_fitness";
  const meta     = GOAL_META[safeGoal];

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const jwt = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/recovery/${safeGoal}`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        setSections(res.data.sections);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [safeGoal]);

  return (
    <Card className="border border-zinc-800 bg-zinc-950/60 rounded-3xl overflow-hidden">

      {/* Coloured top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${meta.accent}, transparent)` }}
      />

      <CardContent className="p-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: `${meta.accent}15`, border: `1px solid ${meta.accent}30` }}
            >
              {meta.emoji}
            </div>
            <div>
              <h3 className="text-white font-black text-base leading-tight">
                Rest &amp; Recovery
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">{meta.tagline}</p>
            </div>
          </div>

          {/* Goal badge */}
          <span
            className="text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
            style={{
              backgroundColor: `${meta.accent}15`,
              color:            meta.accent,
              border:          `1px solid ${meta.accent}30`,
            }}
          >
            {meta.label}
          </span>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-zinc-800/80 mb-5" />

        {/* ── Loading state ── */}
        {loading && ( <RecoverySkeletonLoader/>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="text-3xl">⚠️</span>
            <p className="text-zinc-500 text-xs">Couldn't load recovery tips.</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                // re-trigger effect by toggling a dummy key would be cleaner,
                // but a simple reload of the page or parent re-render works too
                window.location.reload();
              }}
              className="text-xs font-bold px-4 py-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && sections && (
          <div key={safeGoal} style={{ animation: "fadeUp 0.4s ease both" }}>
            {Object.entries(sections).map(([sectionKey, tips]) => (
              <SectionBlock
                key={sectionKey}
                sectionKey={sectionKey}
                tips={tips}
                accent={meta.accent}
              />
            ))}

            {/* Footer note */}
            <div className="mt-4 px-4 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
                Recovery is where progress happens.{" "}
                <span className="text-zinc-400 font-semibold">Tap any tip</span> to read more.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, WifiOff } from "lucide-react";
import { getWorkoutHistoryOffline } from "@/lib/offlineService.js";

export default function WorkoutHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkoutHistoryOffline().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      weekday: "short",
      day:     "numeric",
      month:   "short",
      year:    "numeric",
    });

  return (
    <div
      className="min-h-screen pt-20 pb-12 px-4"
      style={{ background: "rgba(17,19,24,1)" }}
    >
      <div className="w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/workout"
            className="w-8 h-8 rounded-xl border border-zinc-700 bg-zinc-800/60
                       flex items-center justify-center text-zinc-400
                       hover:text-white hover:border-zinc-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-white font-black text-xl">Workout History</h1>
            <p className="text-zinc-500 text-xs">{history.length} sessions logged</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-zinc-400 font-semibold">No workouts logged yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Complete a workout to see it here
            </p>
          </div>
        )}

        {/* List */}
        {!loading && history.length > 0 && (
          <div className="flex flex-col gap-2">
            {history.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60
                           px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-bold">
                      {session.day_name || `Day ${session.day_id}`}
                    </p>
                    <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.logged_at)}
                    </p>
                  </div>
                </div>

                {/* Sync badge */}
                {session.synced ? (
                  <span className="text-[9px] font-bold text-lime-400
                                   border border-lime-400/30 bg-lime-400/10
                                   px-2 py-0.5 rounded-full">
                    Synced ✓
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] font-bold
                                   text-amber-400 border border-amber-400/30
                                   bg-amber-400/10 px-2 py-0.5 rounded-full">
                    <WifiOff className="w-2.5 h-2.5" />
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
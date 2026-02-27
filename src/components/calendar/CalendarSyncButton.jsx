import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, RefreshCw, Unlink, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import {
  connectGoogleCalendar,
  getCalendarStatus,
  syncToCalendar,
  updateCalendarPreferences,
  disconnectCalendar,
} from "@/lib/googleCalendar";

// ── Time picker row ───────────────────────────────────────────────────────────
function TimePicker({ label, icon: Icon, value, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg
                   px-2 py-1.5 focus:outline-none focus:border-cyan-400/50
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CalendarSyncButton() {
  const [status,       setStatus]       = useState(null);   // { connected, preferred_workout_time, preferred_meal_time }
  const [loading,      setLoading]      = useState(true);
  const [syncing,      setSyncing]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [workoutTime, setWorkoutTime] = useState("07:00");
  const [mealTime,    setMealTime]    = useState("08:00");

  // Check if connected on Google redirect back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("calendar") === "connected") {
      toast.success("✅ Google Calendar connected!");
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getCalendarStatus();
      setStatus(data);
      // Strip seconds from time string for input[type=time]
      setWorkoutTime(data.preferred_workout_time?.slice(0, 5) || "07:00");
      setMealTime(data.preferred_meal_time?.slice(0, 5)       || "08:00");
    } catch {
      // Not connected yet — that's fine
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    connectGoogleCalendar(); // redirects to Google
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncToCalendar();
      toast.success(`📅 ${res.eventsCreated} events added to your Google Calendar!`);
    } catch (err) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await updateCalendarPreferences(
        workoutTime + ":00",  // convert HH:MM to HH:MM:SS
        mealTime    + ":00"
      );
      toast.success("✅ Time preferences saved!");
      setShowSettings(false);
      fetchStatus();
    } catch (err) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect Google Calendar?")) return;
    try {
      await disconnectCalendar();
      setStatus((prev) => ({ ...prev, connected: false }));
      toast.success("Calendar disconnected");
    } catch {
      toast.error("Failed to disconnect");
    }
  };

  if (loading) return null;

  // ── Not connected ─────────────────────────────────────────────────────────
  if (!status?.connected) {
    return (
      <button
        onClick={handleConnect}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                   text-zinc-300 border border-zinc-700 bg-zinc-800/60
                   hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-400/5
                   transition-all duration-200 group"
      >
        <Calendar className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        Sync to Calendar
      </button>
    );
  }

  // ── Connected ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">

      {/* Main action row */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Sync button */}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                     text-zinc-900 bg-cyan-400 hover:bg-cyan-300
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-[0_0_16px_rgba(34,211,238,0.3)]
                     hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Week to Calendar"}
        </button>

        {/* Connected badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl
                        border border-cyan-400/20 bg-cyan-400/5">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
            Google Calendar Connected
          </span>
        </div>

        {/* Settings toggle */}
        <button
          onClick={() => setShowSettings((p) => !p)}
          className="w-8 h-8 rounded-xl border border-zinc-700 bg-zinc-800/60
                     flex items-center justify-center text-zinc-500
                     hover:text-white hover:border-zinc-500 transition-all"
        >
          {showSettings
            ? <ChevronUp   className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
          }
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div
          className="rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-4 flex flex-col gap-4"
          style={{ animation: "fadeUp 0.2s ease both" }}
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Time Preferences
          </p>

          <div className="flex flex-col gap-3">
            <TimePicker
              label="Workout Time"
              icon={Calendar}
              value={workoutTime}
              onChange={setWorkoutTime}
              disabled={saving}
            />
            <TimePicker
              label="Meal Prep Time"
              icon={Clock}
              value={mealTime}
              onChange={setMealTime}
              disabled={saving}
            />
          </div>

          <p className="text-[10px] text-zinc-600 leading-relaxed">
            Workout events will be created at your preferred time for each day of your plan.
            Meal prep events on Mon, Wed, Fri.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="flex-1 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-900
                         text-xs font-black transition-all disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save & Sync"}
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20
                         bg-red-500/5 text-red-400 text-xs font-bold hover:bg-red-500/10
                         hover:border-red-500/40 transition-all"
            >
              <Unlink className="w-3 h-3" />
              Disconnect
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
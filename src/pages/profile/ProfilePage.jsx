import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  UserCircle2, Pencil, Trash2, LogOut, Save, X,
  Weight, Ruler, Target, Zap, Clock,ArrowLeft
} from "lucide-react";
import { getProfile, saveProfile, deleteProfile } from "@/lib/api.js";
import NumberField from "@/components/Profile/NumberField.jsx";
import SelectField from "@/components/Profile/SelectFields.jsx";

// ── Constants ─────────────────────────────────────────────────────────────────
const GOAL_OPTIONS = [
  { value: "weight_loss",     label: "Weight Loss",     emoji: "🔥" },
  { value: "muscle_gain",     label: "Muscle Gain",     emoji: "💪" },
  { value: "general_fitness", label: "General Fitness", emoji: "⚡" },
  { value: "flexibility",     label: "Flexibility",     emoji: "🧘" },
];

const ACTIVITY_OPTIONS = [
  { value: "beginner",     label: "Beginner",     desc: "Little to no exercise"       },
  { value: "intermediate", label: "Intermediate", desc: "2–4 days/week"               },
  { value: "advanced",     label: "Advanced",     desc: "5+ days/week"                },
];

const GOAL_META = {
  weight_loss:     { emoji: "🔥", accent: "#f97316" },
  muscle_gain:     { emoji: "💪", accent: "#a3e635" },
  general_fitness: { emoji: "⚡", accent: "#38bdf8" },
  flexibility:     { emoji: "🧘", accent: "#a78bfa" },
};



// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate  = useNavigate();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    weight:           "",
    height:           "",
    fitness_goal:     "general_fitness",
    activity_level:   "beginner",
    workout_duration: "",
  });

  // ── Fetch profile on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProfile();
        if (res.profile) {
          setProfile(res.profile);
          setForm({
            weight:           res.profile.weight           ?? "",
            height:           res.profile.height           ?? "",
            fitness_goal:     res.profile.fitness_goal     ?? "general_fitness",
            activity_level:   res.profile.activity_level   ?? "beginner",
            workout_duration: res.profile.workout_duration ?? "",
          });
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const field = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  // ── Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveProfile({
        weight:           Number(form.weight),
        height:           Number(form.height),
        fitness_goal:     form.fitness_goal,
        activity_level:   form.activity_level,
        workout_duration: Number(form.workout_duration),
      });
      setProfile(res.profile);
      setEditing(false);
      toast.success("✅ Profile updated!, now hit regenerate on home");
    } catch (err) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProfile();
      toast.success("Profile deleted");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  // ── Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("🚀 Logged out successfully!");
  };

  const goalMeta = GOAL_META[profile?.fitness_goal] || GOAL_META.general_fitness;

  // ── Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-zinc-800 animate-pulse" />
          <div className="w-32 h-3 bg-zinc-800 rounded-full animate-pulse" />
          <div className="w-24 h-2 bg-zinc-800/60 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
     <div
      className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050a05 0%, #081418 45%, #0a140a 75%, #050a05 100%)" }}
    >
         <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-170 h-80 rounded-full opacity-[0.18] blur-[110px]"
        style={{ background: "radial-gradient(ellipse, #38bdf8 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-24 w-105 h-105 rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: "radial-gradient(ellipse, #a3e635 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-16 w-75 h-75 rounded-full opacity-[0.10] blur-[100px]"
        style={{ background: "radial-gradient(ellipse, #9ca3af 0%, transparent 65%)" }}
      />

      {/* CHANGE 3d — back button */}
      <div className="w-full max-w-md mx-auto mb-5 relative z-10">
        <Link
          to="/workout"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                     text-zinc-400 border border-zinc-700/50 bg-black/20 backdrop-blur-sm
                     hover:text-cyan-400 hover:border-cyan-400/40 hover:bg-cyan-400/5
                     transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Workout
        </Link>
        </div>
      <div
        className="w-full max-w-md mx-auto relative z-10"
        style={{ animation: "fadeUp 0.4s ease both" }}
      >
        <div
          className="rounded-3xl border border-zinc-800/60 overflow-hidden"
          style={{ background: "linear-gradient(160deg, rgba(24,24,28,0.85) 0%, rgba(12,20,25,0.90) 50%, rgba(15,22,12,0.85) 100%)" }}
        >
          {/* Accent top bar */}
          <div
            className="h-0.5 w-full"
            style={{ background: `linear-gradient(90deg, ${goalMeta.accent}, transparent)` }}
          />

          {/* ── Avatar + name section ── */}
          <div className="flex flex-col items-center pt-8 pb-6 px-6 relative">
            {/* Edit button top right */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700
                           flex items-center justify-center hover:border-lime-400/50 hover:bg-lime-400/10
                           transition-all duration-200 group"
              >
                <Pencil className="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-colors" />
              </button>
            )}

            {/* Avatar circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2"
              style={{
                backgroundColor: `${goalMeta.accent}15`,
                borderColor:     `${goalMeta.accent}40`,
                boxShadow:       `0 0 24px ${goalMeta.accent}25`,
              }}
            >
              <UserCircle2
                className="w-10 h-10"
                style={{ color: goalMeta.accent }}
              />
            </div>

            {/* Goal badge */}
            <div
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1"
              style={{
                backgroundColor: `${goalMeta.accent}15`,
                color:            goalMeta.accent,
                border:          `1px solid ${goalMeta.accent}30`,
              }}
            >
              {goalMeta.emoji} {GOAL_OPTIONS.find((g) => g.value === profile?.fitness_goal)?.label || "General Fitness"}
            </div>

            <p className="text-zinc-600 text-xs mt-1">
              {ACTIVITY_OPTIONS.find((a) => a.value === profile?.activity_level)?.label || "Beginner"} level
            </p>
          </div>

          <div className="h-px bg-zinc-800/80 mx-6" />

          {/* ── Stats / Form ── */}
          <div className="px-6 py-5">
            {!editing ? (
              // ── View mode
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Weight",   value: profile?.weight,           unit: "kg",  icon: Weight },
                  { label: "Height",   value: profile?.height,           unit: "cm",  icon: Ruler  },
                  { label: "Duration", value: profile?.workout_duration, unit: "min", icon: Clock  },
                ].map(({ label, value, unit, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-3 text-center"
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-600 mx-auto mb-1" />
                    <p className="text-white font-black text-lg leading-none">
                      {value ?? "—"}
                    </p>
                    <p className="text-zinc-600 text-[9px] mt-0.5 uppercase tracking-widest">
                      {unit} · {label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              // ── Edit mode
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="Weight" icon={Weight} value={form.weight}
                    onChange={field("weight")} unit="kg" min={10} max={500} />
                  <NumberField label="Height" icon={Ruler}  value={form.height}
                    onChange={field("height")} unit="cm" min={50} max={300} />
                </div>
                <NumberField label="Workout Duration" icon={Clock} value={form.workout_duration}
                  onChange={field("workout_duration")} unit="min" min={5} max={300} />
                <SelectField label="Fitness Goal" icon={Target} value={form.fitness_goal}
                  onChange={field("fitness_goal")} options={GOAL_OPTIONS} />
                <SelectField label="Activity Level" icon={Zap} value={form.activity_level}
                  onChange={field("activity_level")} options={ACTIVITY_OPTIONS} />

                {/* Save / Cancel */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => { setEditing(false); }}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm
                               font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-900 text-sm
                               font-black transition-all flex items-center justify-center gap-2
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-zinc-800/80 mx-6" />

          {/* ── Action buttons ── */}
          <div className="px-6 py-5 flex flex-col gap-2">

            {/* Delete profile */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400
                           text-sm font-bold hover:bg-red-500/10 hover:border-red-500/40
                           transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Profile
              </button>
            ) : (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                <p className="text-red-400 text-xs font-semibold text-center mb-3">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400
                               text-sm font-semibold hover:bg-zinc-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white
                               text-sm font-black transition-all disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-300
                         text-sm font-bold hover:bg-zinc-700 hover:text-white
                         transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label }  from "@/components/ui/label";
import { Input }  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveProfile } from "@/lib/api";
import GoalSelector from "@/components/Profile/goalSelector";
import ActivitySelector from "@/components/Profile/activitySelector";
import DurationSelector from "@/components/Profile/durationSelector";

function ProfilePage() {
  const navigate = useNavigate();

  // ── Your existing state — kept exactly as you had it ─────────
  const [profileData, setprofileData] = useState({
    weight:           "",
    height:           "",
    fitness_goal:     "",
    activity_level:   "",
    workout_duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Your existing handleProfile — kept exactly as you had it ─
  // Used by weight + height text inputs (reads from e.target)
  const handleProfile = (e) => {
    const { name, value } = e.target;
    setprofileData((prev) => ({
      ...prev, [name]: value,
    }));
  };

  // Used by selector components (goal, level, duration)
  // Called directly with field + value — no event object needed
  const handleSelect = (field, value) => {
    setprofileData((prev) => ({
      ...prev, [field]: value,
    }));
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    if (!profileData.weight || profileData.weight < 10 || profileData.weight > 500)
      return "Weight must be between 10 and 500 kg.";
    if (!profileData.height || profileData.height < 50 || profileData.height > 300)
      return "Height must be between 50 and 300 cm.";
    if (!profileData.fitness_goal)
      return "Please select a fitness goal.";
    if (!profileData.activity_level)
      return "Please select your activity level.";
    if (!profileData.workout_duration)
      return "Please select a workout duration.";
    return null; // null means valid
  };

  // ── Your existing handleAddProfile — fixed and completed ─────
  const handleAddProfile = async (e) => {
    e.preventDefault();
    setError("");

    // Run validation first
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return; // stop here if invalid
    }

    setLoading(true);
    try {
      // Convert strings → numbers before sending to backend
      await saveProfile({
        weight:           Number(profileData.weight),
        height:           Number(profileData.height),
        fitness_goal:     profileData.fitness_goal,
        activity_level:   profileData.activity_level,
        workout_duration: Number(profileData.workout_duration),
      });

      toast.success("Profile saved! Generating your workout plan...");
      navigate("/workout"); // go to workout plan page

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background glow — same as rest of app */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-75 h-75 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-lg">

        {/* Brand header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.4)]"
            style={{ background: "#a3e635" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-900" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="12" x2="17" y2="12" />
              <path d="M3 9.5h4v5H3zM17 9.5h4v5h-4z" />
            </svg>
          </div>
          <span className="text-white font-black text-xl tracking-tight">FITNESS PROFILE</span>
        </div>

        {/* ── Main Card — your Card structure kept ── */}
        <Card
          className="border-zinc-800 shadow-2xl"
          style={{ background: "rgba(24,24,27,0.85)", backdropFilter: "blur(12px)" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-2xl font-black">
              Build Your Profile 💪
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Tell us about yourself so we can generate your perfect workout plan.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleAddProfile} className="flex flex-col gap-7 mt-2">

              {/* ── Section 1: Body Metrics ── */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  📏 Body Metrics
                </p>

                <div className="grid grid-cols-2 gap-4">

                  {/* Weight — your existing input, now styled */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="weight"
                      className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                      Weight
                    </Label>
                    <div className="relative">
                      <Input
                        id="weight"
                        type="number"
                        name="weight"
                        value={profileData.weight}
                        onChange={handleProfile}
                        placeholder="70"
                        min="10"
                        max="500"
                        required
                        className="bg-zinc-900 border-zinc-700 text-zinc-100
                          placeholder-zinc-600 pr-10
                          focus:border-lime-400 focus-visible:ring-lime-400/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-semibold">
                        kg
                      </span>
                    </div>
                  </div>

                  {/* Height — your existing input, now styled */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="height"
                      className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                      Height
                    </Label>
                    <div className="relative">
                      <Input
                        id="height"
                        type="number"
                        name="height"
                        value={profileData.height}
                        onChange={handleProfile}
                        placeholder="175"
                        min="50"
                        max="300"
                        required
                        className="bg-zinc-900 border-zinc-700 text-zinc-100
                          placeholder-zinc-600 pr-10
                          focus:border-lime-400 focus-visible:ring-lime-400/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-semibold">
                        cm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live BMI preview — appears when both values entered */}
                {profileData.weight > 0 && profileData.height > 0 && (
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/60"
                    style={{ animation: "fadeUp 0.2s ease both" }}
                  >
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">BMI</p>
                      <p className="text-white font-black text-xl">
                        {(profileData.weight / ((profileData.height / 100) ** 2)).toFixed(1)}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                      (() => {
                        const bmi = profileData.weight / ((profileData.height / 100) ** 2);
                        if (bmi < 18.5) return "text-blue-400 bg-blue-400/10 border-blue-400/30";
                        if (bmi < 25)   return "text-lime-400 bg-lime-400/10 border-lime-400/30";
                        if (bmi < 30)   return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
                        return "text-red-400 bg-red-400/10 border-red-400/30";
                      })()
                    }`}>
                      {(() => {
                        const bmi = profileData.weight / ((profileData.height / 100) ** 2);
                        if (bmi < 18.5) return "Underweight";
                        if (bmi < 25)   return "Normal ✅";
                        if (bmi < 30)   return "Overweight";
                        return "Obese";
                      })()}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-zinc-800" />

              {/* ── Section 2: Fitness Goal ── */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  🎯 Fitness Goal
                </p>
                
                <GoalSelector
                  value={profileData.fitness_goal}
                  onChange={(val) => handleSelect("fitness_goal", val)}
                />
              </div>

              <div className="h-px bg-zinc-800" />

              {/* ── Section 3: Activity Level ── */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  ⚡ Activity Level
                </p>
                <ActivitySelector
                  value={profileData.activity_level}
                  onChange={(val) => handleSelect("activity_level", val)}
                />
              </div>

              <div className="h-px bg-zinc-800" />

              {/* ── Section 4: Workout Duration ── */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  ⏱️ Session Duration
                </p>
                <DurationSelector
                  value={profileData.workout_duration}
                  onChange={(val) => handleSelect("workout_duration", val)}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit button — your existing button, now complete */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-xl bg-lime-400 hover:bg-lime-300
                  text-zinc-900 font-black transition-all duration-200 
                  shadow-[0_0_20px_rgba(163,230,53,0.3)]
                  hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 ">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving Profile…
                  </span>
                ) : (
                  "Save Profile & Generate Plan 🚀"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* Already set up link */}
        <p className="text-center text-sm text-zinc-600 mt-4">
          Already set up?{" "}
          <button
            type="button"
            onClick={() => navigate("/workout")}
            className="text-lime-400 hover:text-lime-300 font-semibold transition-colors"
          >
            Go to Workout Plan →
          </button>
        </p>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
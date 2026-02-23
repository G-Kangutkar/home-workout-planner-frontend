import { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import PlanSkeleton from "@/components/nutrition/PlanSkeleton";
import RecipeModal from "@/components/nutrition/RecipeModal";
import MacroBar from "@/components/nutrition/MacroBar";
import MealCard from "@/components/nutrition/MealCard";

const GOAL_META = {
  weight_loss: { color: "text-orange-400", badge: "border-orange-400/30 bg-orange-400/10 text-orange-400", accent: "bg-orange-400" },
  muscle_gain: { color: "text-lime-400",   badge: "border-lime-400/30 bg-lime-400/10 text-lime-400",       accent: "bg-lime-400"   },
  maintenance: { color: "text-blue-400",   badge: "border-blue-400/30 bg-blue-400/10 text-blue-400",       accent: "bg-blue-400"   },
  endurance:   { color: "text-purple-400", badge: "border-purple-400/30 bg-purple-400/10 text-purple-400", accent: "bg-purple-400" },
};

const getMeta = (goal) => GOAL_META[goal] || GOAL_META.maintenance;

export default function NutritionPage() {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeRecipe, setActiveRecipe] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const jwt = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/nutrition-plan", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setData(res.data);
        console.log("data",data)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load nutrition plan");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 pt-8">
      <div className="px-4 mb-6">
        <Skeleton className="h-7 w-40 bg-zinc-800 mb-2" />
        <Skeleton className="h-4 w-56 bg-zinc-800" />
      </div>
      <PlanSkeleton />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-white font-black">Something went wrong</p>
        <p className="text-sm text-zinc-500">{error}</p>
        {error.includes("fitness goal") && (
          <p className="text-xs text-zinc-600 max-w-xs">
            Go to your profile and set a fitness goal to unlock your personalized nutrition plan.
          </p>
        )}
      </div>
    </div>
  );
  
  const { plan, meals, prepTips } = data;
  const meta = getMeta(plan.goal);
//   console.log('plan',plan)

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein  = meals.reduce((s, m) => s + m.protein,  0);
  const totalCarbs    = meals.reduce((s, m) => s + m.carbs,    0);
  const totalFat      = meals.reduce((s, m) => s + m.fat,      0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">

      <RecipeModal
        meal={activeRecipe}
        meta={meta}
        open={!!activeRecipe}
        onClose={() => setActiveRecipe(null)}
      />

      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <a href="/workout">
            <h1 className="text-2xl font-black text-white" >Nutrition Plan</h1>
        </a>
        
        <p className="text-sm text-zinc-500 mt-0.5">Personalized for your fitness goal</p>
      </div>

      {/* Goal Banner */}
      <div className="px-4 mb-5">
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${meta.badge}`}>
          <span className="text-2xl">{plan.icon}</span>
          <div>
            <p className={`font-black text-sm ${meta.color}`}>{plan.label}</p>
            <p className="text-xs text-zinc-500">{plan.description}</p>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="px-4 mb-6">
        <div className={`rounded-2xl p-5 border ${meta.badge}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">Daily Calories</p>
              <div className="flex items-end gap-1.5 mt-0.5">
                <Flame className={`w-5 h-5 mb-0.5 ${meta.color}`} />
                <span className={`text-3xl font-black ${meta.color}`}>{totalCalories}</span>
                <span className="text-sm text-zinc-500 mb-1">kcal</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Protein", value: `${totalProtein}g`, color: "text-lime-400"   },
                { label: "Carbs",   value: `${totalCarbs}g`,   color: "text-blue-400"   },
                { label: "Fat",     value: `${totalFat}g`,     color: "text-yellow-400" },
              ].map((m) => (
                <div key={m.label} className="bg-zinc-900/50 rounded-xl px-2 py-1.5">
                  <p className={`text-sm font-black ${m.color}`}>{m.value}</p>
                  <p className="text-[10px] text-zinc-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <MacroBar label="Protein" value={plan.protein_pct} color="text-lime-400"   icon={Beef}     />
            <MacroBar label="Carbs"   value={plan.carbs_pct}   color="text-blue-400"   icon={Wheat}    />
            <MacroBar label="Fat"     value={plan.fat_pct}     color="text-yellow-400" icon={Droplets} />
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="px-4 mb-6">
        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide mb-3">Today's Meals</p>
        <div className="flex flex-col gap-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} meta={meta} onViewRecipe={setActiveRecipe} />
          ))}
        </div>
      </div>

      {/* Prep Tips */}
      {prepTips.length > 0 && (
        <div className="px-4">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide mb-3">Meal Prep Tips</p>
          <div className="border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
            {prepTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${meta.badge}`}>
                  <Lightbulb className={`w-3.5 h-3.5 ${meta.color}`} />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed pt-0.5">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { ChevronDown,ChevronUp,Bean, Wheat, Droplets,} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";


export default function MealCard({ meal, meta, onViewRecipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-2xl overflow-hidden bg-zinc-800/30 transition-all duration-200
      ${expanded ? `${meta.badge}` : "border-zinc-800 hover:border-zinc-700"}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl border ${meta.badge}`}>
          {meal.icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-zinc-500 font-semibold">{meal.meal_time}</span>
          <p className="text-white font-black text-sm truncate">{meal.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-orange-400 font-bold">{meal.calories} kcal</span>
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-lime-400 font-semibold">{meal.protein}g protein</span>
          </div>
        </div>
        <div className="text-zinc-600 shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { Icon: Bean,     value: `${meal.protein}g`, label: "Protein", color: "text-lime-400"   },
              { Icon: Wheat,    value: `${meal.carbs}g`,   label: "Carbs",   color: "text-blue-400"   },
              { Icon: Droplets, value: `${meal.fat}g`,     label: "Fat",     color: "text-yellow-400" },
            ].map(({ Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-2 bg-zinc-800/60 rounded-xl px-3 py-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <div>
                  <p className={`text-sm font-black ${color}`}>{value}</p>
                  <p className="text-[10px] text-zinc-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {meal.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {meal.ingredients?.slice(0, 4).map((ing, i) => (
              <span key={i} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-lg">{ing}</span>
            ))}
            {meal.ingredients?.length > 4 && (
              <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-1 rounded-lg">
                +{meal.ingredients.length - 4} more
              </span>
            )}
          </div>

          <button
            onClick={() => onViewRecipe(meal)}
            className={`w-full py-2.5 rounded-xl text-zinc-900 text-sm font-black transition-all hover:opacity-90 ${meta.accent}`}
          >
            View Full Recipe & Prep Guide →
          </button>
        </div>
      )}
    </div>
  );
}
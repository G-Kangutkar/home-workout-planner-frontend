import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
import {Clock,ChefHat} from "lucide-react";


export default function RecipeModal({ meal, meta, open, onClose }) {
  if (!meal) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="bg-zinc-900 border-zinc-700 text-white sm:max-w-lg p-0 gap-0 max-h-[90vh] flex flex-col"
      >
        <DialogHeader className="p-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{meal.icon}</span>
            <Badge variant="outline" className={`text-[10px] ${meta.badge}`}>
              {meal.meal_time}
            </Badge>
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-500">{meal.prep_time}</span>
            </div>
          </div>
          <DialogTitle className="text-white font-black text-lg leading-tight">
            {meal.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 flex flex-col gap-5">
           

        {/* <ScrollArea className="flex-1"> */}
          <div className="p-5 flex flex-col gap-5">
            {/* Macro grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Calories", value: meal.calories,      color: "text-orange-400" },
                { label: "Protein",  value: `${meal.protein}g`, color: "text-lime-400"   },
                { label: "Carbs",    value: `${meal.carbs}g`,   color: "text-blue-400"   },
                { label: "Fat",      value: `${meal.fat}g`,     color: "text-yellow-400" },
              ].map((m) => (
                <div key={m.label} className="bg-zinc-800 rounded-xl p-3 text-center">
                  <p className={`text-base font-black ${m.color}`}>{m.value}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {meal.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-lime-400" /> Ingredients
              </h3>
              <ul className="flex flex-col gap-2">
                {meal.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                    <span className="text-sm text-zinc-300">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prep Steps */}
            <div>
              <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-lime-400" /> How to Prepare
              </h3>
              <ol className="flex flex-col gap-3">
                {meal.prep_steps?.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 text-zinc-900 ${meta.accent}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-zinc-300 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
           
        </div>
      </div>
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
}
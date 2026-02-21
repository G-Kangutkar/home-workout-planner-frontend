
import { Card, CardContent } from "@/components/ui/card";

// Recovery tips shown at the bottom
const TIPS = ["💧 Stay hydrated", "🧘 Light stretching", "😴 Sleep 7-9 hours"];

export default function RestDayCard() {
  return (
    <Card className="border-dashed border-zinc-800 bg-zinc-900/40">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">

        {/* Big emoji */}
        <span className="text-6xl">😴</span>

        {/* Title and subtitle */}
        <div>
          <h3 className="text-white font-black text-xl">Rest & Recovery</h3>
          <p className="text-zinc-500 text-sm mt-1 max-w-xs">
            Muscles grow during rest. Today is your recovery day — take it easy!
          </p>
        </div>

        {/* Recovery tip chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {TIPS.map((tip) => (
            <span
              key={tip}
              className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full"
            >
              {tip}
            </span>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
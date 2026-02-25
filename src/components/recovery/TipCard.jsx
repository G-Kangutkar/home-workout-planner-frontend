import { useState } from "react";

export default function TipCard({ tip, index, accent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden
                 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
      style={{ animationDelay: `${index * 55}ms`, animation: "fadeUp 0.35s ease both" }}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Index dot */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
          style={{ backgroundColor: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
        >
          {index + 1}
        </div>

        <p className="text-white text-xs font-bold flex-1 leading-snug">{tip.title}</p>

        {/* Duration pill */}
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap"
          style={{ backgroundColor: `${accent}15`, color: accent, border: `1px solid ${accent}28` }}
        >
          {tip.duration}
        </span>

        {/* Chevron */}
        <svg
          className="w-3.5 h-3.5 shrink-0 text-zinc-600 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div
          className="px-4 pb-4 pt-1 border-t border-zinc-800/50"
          style={{ animation: "fadeUp 0.2s ease both" }}
        >
          <p className="text-zinc-400 text-[11px] leading-relaxed">{tip.description}</p>
        </div>
      )}
    </div>
  );
}
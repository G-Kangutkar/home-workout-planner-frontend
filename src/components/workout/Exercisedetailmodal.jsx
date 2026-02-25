import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function ExerciseDetailModal({ exercise, meta, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{
        backgroundColor: `rgba(0,0,0,${visible ? "0.7" : "0"})`,
        backdropFilter: "blur(6px)",
        transition: "background-color 0.28s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden text-white border border-zinc-700/50 shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #18181b 0%, #0f0f11 100%)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.32s cubic-bezier(0.34,1.4,0.64,1), opacity 0.28s ease",
        }}
      >
        {/* Colored top bar matching muscle group */}
        <div className={`h-0.5 w-full ${meta.bar}`} />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 gap-3">
          <div className="min-w-0">
            <p className="text-white font-black text-base leading-tight">
              {exercise.exercise?.name}
            </p>
            <Badge variant="outline" className={`text-[9px] mt-1 ${meta.badge}`}>
              {exercise.exercise?.muscle_group?.replace("_", " ")}
            </Badge>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-zinc-800/70 flex items-center justify-center hover:bg-zinc-700 transition shrink-0 mt-0.5"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Description */}
        {exercise.exercise?.description && (
          <p className="text-zinc-400 text-xs leading-relaxed px-5 pb-3">
            {exercise.exercise.description}
          </p>
        )}

        <div className="border-t border-zinc-800/80 mx-5" />

        {/* Instructions */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">
            How to do it
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {exercise.exercise?.instructions}
          </p>
        </div>

        {/* Video link */}
        {exercise.exercise?.video_url && (
          <div className="px-5 pt-2 pb-3">
            <a
              href={exercise.exercise.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.7 12 2.7 12 2.7s-4.2 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.5 12 21.5 12 21.5s4.2 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
              </svg>
              Watch Tutorial
            </a>
          </div>
        )}

        {/* Tags */}
        {exercise.exercise?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 px-5 pt-1 pb-5">
            {exercise.exercise.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] text-zinc-500 bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
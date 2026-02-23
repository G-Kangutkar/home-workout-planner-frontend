import { useState, useEffect, useRef, useCallback } from "react";
import { X, Pause, Play, CheckCircle } from "lucide-react";

const PHASE = {
    COUNTDOWN: "countdown",
    WORK: "work",
    REST: "rest",
    DONE: "done",
};

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function ProgressRing({ progress, size = 220, stroke = 10, color }) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);
    return (
        <svg width={size} height={size} className="absolute top-0 left-0 -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s linear" }} />
        </svg>
    );
}

// Generates a beep using Web Audio API — no library needed
const playBeep = (frequency = 880, duration = 0.15, volume = 0.3) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio not supported:", e);
  }
};



export default function IntervalTimer({
    exercises = [],
    workoutName = "Exercise",
    workDuration = 40,
    restDuration = 20,
    onClose,
    onComplete,
}) {
    const isSingle = exercises.length === 1;

    const [phase, setPhase] = useState(PHASE.COUNTDOWN);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(3);
    const [isPaused, setIsPaused] = useState(false);
    const [totalElapsed, setTotalElapsed] = useState(0);

    const intervalRef = useRef(null);
    const elapsedRef = useRef(null);

    const currentEx = exercises[currentIdx];
    const isLastEx = currentIdx === exercises.length - 1;
    const nextEx = exercises[currentIdx + 1];

    const clearTimers = useCallback(() => {
        clearInterval(intervalRef.current);
        clearInterval(elapsedRef.current);
    }, []);

    const advancePhase = useCallback(() => {
        setPhase((prev) => {
            if (prev === PHASE.COUNTDOWN) {
                playBeep(880, 0.15);
                setTimeLeft(workDuration);
                return PHASE.WORK;
            }
            if (prev === PHASE.WORK) {
                playBeep(440, 0.3);
                // go to REST after every exercise including single card
                setTimeLeft(restDuration);
                return PHASE.REST;
            }
            if (prev === PHASE.REST) {
                if (isLastEx) {
                    playBeep(660, 0.5);
                     return PHASE.DONE; 
                } // after rest of last exercise → DONE
                playBeep(880, 0.15);
                setCurrentIdx((i) => i + 1);
                setTimeLeft(workDuration);
                return PHASE.WORK;
            }

            if (prev === PHASE.REST) {
                setCurrentIdx((i) => i + 1);
                setTimeLeft(workDuration);
                return PHASE.WORK;
            }
            return prev;
        });
    }, [workDuration, restDuration, isLastEx]);


    // Effect 1 — runs the countdown tick
    useEffect(() => {
        if (isPaused || phase === PHASE.DONE) return;

        clearTimers();

        intervalRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        elapsedRef.current = setInterval(() => setTotalElapsed((e) => e + 1), 1000);

        return clearTimers;
    }, [phase, isPaused, currentIdx]); 

    // watches timeLeft, advances phase when it hits 0
    useEffect(() => {
        if (timeLeft === 0 && phase !== PHASE.DONE && phase !== PHASE.COUNTDOWN) {
            advancePhase();
        }
        // also handle countdown hitting 0
        if (timeLeft === 0 && phase === PHASE.COUNTDOWN) {
            advancePhase();
        }
    }, [timeLeft]); 
    const formatTime = (s) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    const phaseConfig = {
        [PHASE.COUNTDOWN]: {
            label: "GET READY", color: "#facc15", bg: "from-yellow-950/80 to-zinc-950",
            progress: (3 - timeLeft) / 3,
        },
        [PHASE.WORK]: {
            label: "WORK", color: "#a3e635", bg: "from-lime-950/80 to-zinc-950",
            progress: timeLeft > 0 ? 1 - timeLeft / workDuration : 1,
        },
        [PHASE.REST]: {
            label: "REST", color: "#60a5fa", bg: "from-blue-950/80 to-zinc-950",
            progress: timeLeft > 0 ? 1 - timeLeft / restDuration : 1,
        },
        [PHASE.DONE]: {
            label: "DONE!", color: "#a3e635", bg: "from-lime-950/80 to-zinc-950",
            progress: 1,
        },
    };

    const cfg = phaseConfig[phase];
    const ringSize = 220;

    // ── Done Screen ──────────────────────────────────────────────────────────────
    if (phase === PHASE.DONE) {
        return (
            <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center px-6 text-white">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-lime-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-lime-400">DONE! 💪</h1>
                        <p className="text-zinc-400 mt-2 text-sm">{workoutName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                        <div className="bg-zinc-800/60 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-black text-lime-400">{workDuration}s</p>
                            <p className="text-xs text-zinc-500 mt-1">Work Time</p>
                        </div>
                        <div className="bg-zinc-800/60 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-black text-white">{formatTime(totalElapsed)}</p>
                            <p className="text-xs text-zinc-500 mt-1">Total Time</p>
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full max-w-xs py-4 bg-lime-400 text-zinc-900 font-black rounded-2xl text-lg hover:bg-lime-300 transition-all"
                    >
                        Done →
                    </button>
                </div>
            </div>
        );
    }

    // ── Timer Screen ─────────────────────────────────────────────────────────────
    return (
        <div className={`fixed inset-0 z-50 bg-linear-to-b ${cfg.bg} flex flex-col text-white overflow-hidden`}>

            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
                <div>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">
                        {isSingle ? "Interval Timer" : workoutName}
                    </p>
                    {!isSingle && (
                        <p className="text-sm text-zinc-400 mt-0.5">
                            {currentIdx + 1} / {exercises.length} exercises
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">{formatTime(totalElapsed)}</span>
                    <button onClick={onClose}
                        className="w-9 h-9 rounded-full bg-zinc-800/60 flex items-center justify-center hover:bg-zinc-700 transition">
                        <X className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>
            </div>

            {/* Progress Pills — only for multiple exercises */}
            {!isSingle && (
                <div className="flex gap-1.5 px-5 mb-4 shrink-0">
                    {exercises.map((_, i) => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                            style={{
                                backgroundColor:
                                    i < currentIdx ? cfg.color :
                                        i === currentIdx ? `${cfg.color}80` :
                                            "rgba(255,255,255,0.1)",
                            }} />
                    ))}
                </div>
            )}

            {/* Work / Rest info pills */}
            <div className="flex items-center justify-center gap-4 mb-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                    <span className="text-xs text-lime-400 font-semibold">{workDuration}s work</span>
                </div>
                
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-xs text-blue-400 font-semibold">{restDuration}s rest</span>
                    </div>
                
            </div>

            {/* Phase Label */}
            <div className="text-center shrink-0 mb-2">
                <span className="text-xs font-black tracking-[0.3em] px-4 py-1.5 rounded-full"
                    style={{ color: cfg.color, backgroundColor: `${cfg.color}18` }}>
                    {cfg.label}
                </span>
            </div>

            {/* Timer Ring */}
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
                <div className="relative flex items-center justify-center"
                    style={{ width: ringSize, height: ringSize }}>
                    <ProgressRing progress={cfg.progress} size={ringSize} stroke={10} color={cfg.color} />
                    <div className="flex flex-col items-center gap-1 z-10">
                        {phase === PHASE.COUNTDOWN ? (
                            <span className="text-8xl font-black" style={{ color: cfg.color }}>{timeLeft}</span>
                        ) : (
                            <>
                                <span className="text-7xl font-black tabular-nums" style={{ color: cfg.color }}>
                                    {timeLeft}
                                </span>
                                <span className="text-xs text-zinc-500 uppercase tracking-widest">seconds</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Exercise info */}
                {phase === PHASE.COUNTDOWN && (
                    <p className="text-zinc-400 text-lg font-semibold text-center px-8">
                        {currentEx?.exercise?.name || currentEx?.name}
                    </p>
                )}
                {phase === PHASE.WORK && (
                    <div className="text-center px-8">
                        <p className="text-white font-black text-2xl leading-tight">
                            {currentEx?.exercise?.name || currentEx?.name}
                        </p>
                        <p className="text-zinc-500 text-sm capitalize mt-1">
                            {currentEx?.exercise?.muscle_group?.replace("_", " ") || ""}
                        </p>
                    </div>
                )}
                {phase === PHASE.REST && nextEx && (
                    <div className="text-center px-8">
                        <p className="text-zinc-500 text-sm">Up next</p>
                        <p className="text-white font-black text-xl mt-1">
                            {nextEx?.exercise?.name || nextEx?.name}
                        </p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="px-6 pb-12 shrink-0">
                <button
                    onClick={() => setIsPaused((p) => !p)}
                    className="w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: cfg.color, color: "#09090b" }}
                >
                    {isPaused
                        ? <><Play className="w-5 h-5" /> Resume</>
                        : <><Pause className="w-5 h-5" /> Pause</>
                    }
                </button>
            </div>
        </div>
    );
}
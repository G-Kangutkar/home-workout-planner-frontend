
// Days of the week in order (Monday first)
export const DAYS_ORDER = [
  "monday", "tuesday", "wednesday",
  "thursday", "friday", "saturday", "sunday",
];

// Short labels for day tabs
export const DAY_SHORT = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
};

// Full day names
export const DAY_FULL = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

// Color + emoji per muscle group (used in badges and cards)
export const MUSCLE_META = {
  chest:      { badge: "bg-orange-400/10 text-orange-400 border-orange-400/30",    bar: "bg-orange-400",   icon: "💪" },
  back:       { badge: "bg-blue-400/10 text-blue-400 border-blue-400/30",          bar: "bg-blue-400",     icon: "🔙" },
  shoulders:  { badge: "bg-purple-400/10 text-purple-400 border-purple-400/30",    bar: "bg-purple-400",   icon: "🏋️" },
  arms:       { badge: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",    bar: "bg-yellow-400",   icon: "💪" },
  core:       { badge: "bg-lime-400/10 text-lime-400 border-lime-400/30",          bar: "bg-lime-400",     icon: "⚡" },
  legs:       { badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",          bar: "bg-cyan-400",     icon: "🦵" },
  glutes:     { badge: "bg-pink-400/10 text-pink-400 border-pink-400/30",          bar: "bg-pink-400",     icon: "🍑" },
  full_body:  { badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30", bar: "bg-emerald-400",  icon: "🏃" },
  cardio:     { badge: "bg-red-400/10 text-red-400 border-red-400/30",             bar: "bg-red-400",      icon: "❤️" },
};

// Color per fitness goal (used in plan header badge)
export const GOAL_META = {
  weight_loss:     { color: "bg-red-400/10 text-red-400 border-red-400/30",         label: "Weight Loss"     },
  muscle_gain:     { color: "bg-orange-400/10 text-orange-400 border-orange-400/30", label: "Muscle Gain"    },
  flexibility:     { color: "bg-purple-400/10 text-purple-400 border-purple-400/30", label: "Flexibility"    },
  general_fitness: { color: "bg-lime-400/10 text-lime-400 border-lime-400/30",       label: "General Fitness" },
};

// Difficulty level colors
export const DIFFICULTY_COLOR = {
  beginner:     "text-emerald-400",
  intermediate: "text-yellow-400",
  advanced:     "text-red-400",
};

// All muscle groups as a list (for filter chips)
export const MUSCLE_LIST = Object.keys(MUSCLE_META);
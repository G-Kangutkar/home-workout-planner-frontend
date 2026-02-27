import Dexie from "dexie";

export const db = new Dexie("WorkoutPlannerDB");

db.version(1).stores({
  exercises:      "++id, name, muscle_group, difficulty",
  workoutPlans:   "++id, user_id, created_at",
  planDays:       "++id, plan_id, day_name, day_number",
  planExercises:  "++id, day_id, exercise_id",
  workoutHistory: "++id, day_id, logged_at, synced",
  syncQueue:      "++id, action, created_at",
});
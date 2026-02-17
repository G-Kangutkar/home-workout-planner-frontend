// src/lib/api.js
// ─────────────────────────────────────────────────────────────────
// All backend API calls using Axios.
//
// Why Axios over fetch?
//   1. Automatically parses JSON response (no .json() needed)
//   2. Automatically throws error on non-2xx status
//   3. Cleaner syntax with baseURL + interceptors
//   4. Request/response interceptors handle token automatically
//
// Install: npm install axios
// ─────────────────────────────────────────────────────────────────
import axios from "axios";

// ─────────────────────────────────────────────────────────────────
// AXIOS INSTANCE
// Creates a custom axios with baseURL + default headers.
// All functions below use this instance — not plain axios.
// ─────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs automatically before EVERY request.
// Reads JWT token from localStorage and attaches it to the header.
// You never need to manually add Authorization header anywhere.
// ─────────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // must return config so request continues
});

// ─────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs automatically after EVERY response.
// Extracts error message from backend and throws it cleanly.
// ─────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  // Success: just return the response as-is
  (response) => response,

  // Error: extract the message from backend and throw it
  (error) => {
    const message =
      error.response?.data?.error || // backend error message
      error.message ||               // axios error message
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

// ═════════════════════════════════════════════════════════════════
// AUTH API
// Matches routes in: server/routes/auth.routes.js
// ═════════════════════════════════════════════════════════════════

// POST /api/auth/register
// Registers a new user → returns { token, user }
export async function register(name, email, password) {
  const { data } = await api.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

// POST /api/auth/login
// Logs in existing user → returns { token, user }
export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", {
    email,
    password,
  });
  return data;
}

// ═════════════════════════════════════════════════════════════════
// PROFILE API
// Matches routes in: server/routes/profile.routes.js
// ═════════════════════════════════════════════════════════════════

// GET /api/profile
// Returns the logged-in user's fitness profile
export async function getProfile() {
  const { data } = await api.get("/api/profile");
  return data;
}

// POST /api/profile
// Creates or updates the user's fitness profile
// profileData: { weight, height, fitness_goal, activity_level, workout_duration }
export async function saveProfile(profileData) {
  const { data } = await api.post("/api/profile", profileData);
  return data;
}

// DELETE /api/profile
// Deletes the user's fitness profile
export async function deleteProfile() {
  const { data } = await api.delete("/api/profile");
  return data;
}

// ═════════════════════════════════════════════════════════════════
// WORKOUT PLAN API
// Matches routes in: server/routes/workout.routes.js
// ═════════════════════════════════════════════════════════════════

// GET /api/workout/plan
// Returns the user's active plan with all days and exercises
export async function getActivePlan() {
  const { data } = await api.get("/api/workout/plan");
  return data;
}

// POST /api/workout/generate
// Generates a new plan based on user's saved profile
// No body needed — backend reads profile using JWT token
export async function generatePlan() {
  const { data } = await api.post("/api/workout/generate");
  return data;
}

// PUT /api/workout/plan/:planId
// Renames the workout plan
// planId → plan.id from getActivePlan() response
export async function renamePlan(planId, name) {
  const { data } = await api.put(`/api/workout/plan/${planId}`, { name });
  return data;
}

// ═════════════════════════════════════════════════════════════════
// EXERCISE LIBRARY API
// Matches routes in: server/routes/workout.routes.js
// ═════════════════════════════════════════════════════════════════

// GET /api/workout/exercises
// Returns all exercises — optional filters via query params
// filters: { muscle, difficulty, search }
export async function getExercises(filters = {}) {
  const { data } = await api.get("/api/workout/exercises", {
    params: filters, // axios automatically converts to ?muscle=chest&difficulty=beginner
  });
  return data;
}

// ═════════════════════════════════════════════════════════════════
// DAY EXERCISE API
// Matches routes in: server/routes/workout.routes.js
// ═════════════════════════════════════════════════════════════════

// PUT /api/workout/day-exercise/:dayExerciseId
// Swaps one exercise in a day with a different one
// dayExerciseId → ex.id from the plan response (plan_day_exercises row)
// newExerciseId → exercise id from getExercises() (exercises table row)
export async function swapExercise(dayExerciseId, newExerciseId) {
  const { data } = await api.put(
    `/api/workout/day-exercise/${dayExerciseId}`,
    { exercise_id: newExerciseId }
  );
  return data;
}

// POST /api/workout/day/:dayId/exercise
// Adds a new exercise to a specific day
// dayId       → day.id from the plan response (workout_plan_days row)
// exerciseData: { exercise_id, sets, reps, duration_seconds, notes }
export async function addExercise(dayId, exerciseData) {
  const { data } = await api.post(
    `/api/workout/day/${dayId}/exercise`,
    exerciseData
  );
  return data;
}

// DELETE /api/workout/day-exercise/:dayExerciseId
// Removes an exercise from a day
// dayExerciseId → ex.id from the plan response (plan_day_exercises row)
export async function removeExercise(dayExerciseId) {
  const { data } = await api.delete(
    `/api/workout/day-exercise/${dayExerciseId}`
  );
  return data;
}
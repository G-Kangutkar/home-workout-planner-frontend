import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://home-workout-planner.onrender.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Get Google OAuth URL and redirect user ────────────────────────────────────
export async function connectGoogleCalendar() {
  const { data } = await api.get("/api/calendar/auth-url");
  // Redirect to Google consent screen
  window.location.href = data.url;
}

// ── Get calendar connection status + time preferences ─────────────────────────
export async function getCalendarStatus() {
  const { data } = await api.get("/api/calendar/status");
  return data;
}

// ── Sync workout plan + meals to Google Calendar ──────────────────────────────
export async function syncToCalendar() {
  const { data } = await api.post("/api/calendar/sync");
  return data;
}

// ── Update preferred workout and meal times ───────────────────────────────────
export async function updateCalendarPreferences(preferred_workout_time, preferred_meal_time) {
  const { data } = await api.put("/api/calendar/preferences", {
    preferred_workout_time,
    preferred_meal_time,
  });
  return data;
}

// ── Disconnect Google Calendar ────────────────────────────────────────────────
export async function disconnectCalendar() {
  const { data } = await api.delete("/api/calendar/disconnect");
  return data;
}
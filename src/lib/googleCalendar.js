import api from "@/lib/api.js";

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
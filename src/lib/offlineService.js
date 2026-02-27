import { db } from "./db.js";
import {
  getExercises      as fetchExercises,
  getActivePlan     as fetchActivePlan,
  logWorkout        as apiLogWorkout,
  getWorkoutHistory as fetchWorkoutHistory,
} from "./api.js";

// ── Call once on app load to seed local DB ────────────────────────
export async function seedOfflineData() {
  if (!navigator.onLine) return;
  try {
    // Cache exercises
    const exerciseRes = await fetchExercises();
    const exercises = exerciseRes.exercises || exerciseRes;
    await db.exercises.clear();
    await db.exercises.bulkPut(exercises);

    // Cache workout plan
    const planRes = await fetchActivePlan();
    if (planRes?.plan) {
      await db.workoutPlans.put(planRes.plan);
      if (planRes.days)      await db.planDays.bulkPut(planRes.days);
      if (planRes.exercises) await db.planExercises.bulkPut(planRes.exercises);
    }

    // Cache history
    const historyRes = await fetchWorkoutHistory(100, 0);
    const history = historyRes.history || historyRes;
    await db.workoutHistory.clear();
    await db.workoutHistory.bulkPut(
      history.map((h) => ({ ...h, synced: true }))
    );

    console.log("✅ Offline data ready");
  } catch (err) {
    console.warn("⚠️ Seeding skipped:", err.message);
  }
}

// ── Exercises — offline first ─────────────────────────────────────
export async function getExercisesOffline(filters = {}) {
  if (navigator.onLine) {
    try {
      const res = await fetchExercises(filters);
      const exercises = res.exercises || res;
      await db.exercises.bulkPut(exercises);
      return exercises;
    } catch {}
  }
  // Offline fallback — basic filter support
  let results = await db.exercises.toArray();
  if (filters.muscle) {
    results = results.filter((e) =>
      e.muscle_group?.toLowerCase().includes(filters.muscle.toLowerCase())
    );
  }
  if (filters.search) {
    results = results.filter((e) =>
      e.name?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  return results;
}

// ── Workout plan — offline first ──────────────────────────────────
export async function getActivePlanOffline() {
  if (navigator.onLine) {
    try {
      const res = await fetchActivePlan();
      if (res?.plan) {
        await db.workoutPlans.put(res.plan);
        if (res.days)      await db.planDays.bulkPut(res.days);
        if (res.exercises) await db.planExercises.bulkPut(res.exercises);
      }
      return res;
    } catch {}
  }
  // Offline fallback — reconstruct from local DB
  const plan      = await db.workoutPlans.toCollection().last();
  const days      = await db.planDays.toArray();
  const exercises = await db.planExercises.toArray();
  return { plan, days, exercises };
}

// ── Log workout — saves locally first, syncs when online ──────────
export async function logWorkoutOffline(payload) {
  // 1. Always save locally immediately — never lost
  const localId = await db.workoutHistory.add({
    ...payload,
    logged_at: new Date().toISOString(),
    synced: false,
  });

  // 2. Try to sync to API right now if online
  if (navigator.onLine) {
    try {
      await apiLogWorkout(payload);  // your existing API call
      await db.workoutHistory.update(localId, { synced: true });
      return { success: true, synced: true };
    } catch {}
  }

  // 3. Queue for later sync if offline or API failed
  await db.syncQueue.add({
    action:     "LOG_WORKOUT",
    payload,
    localId,
    created_at: new Date().toISOString(),
  });

  return { success: true, synced: false };
}

// ── Flush sync queue — call when internet returns ─────────────────
export async function flushSyncQueue() {
  const queue = await db.syncQueue.toArray();
  if (!queue.length) return;

  console.log(`🔄 Syncing ${queue.length} queued items...`);

  for (const item of queue) {
    try {
      if (item.action === "LOG_WORKOUT") {
        await apiLogWorkout(item.payload);
        await db.workoutHistory.update(item.localId, { synced: true });
      }
      await db.syncQueue.delete(item.id);
    } catch (err) {
      console.error("Sync failed:", err.message);
    }
  }
}

// ── Get workout history — always from local DB ────────────────────
export async function getWorkoutHistoryOffline() {
  // Also try to refresh from API if online
  if (navigator.onLine) {
    try {
      const res = await fetchWorkoutHistory(100, 0);
      const history = res.history || res;
      // Merge — keep unsynced local entries, update rest
      const unsynced = await db.workoutHistory
        .where("synced").equals(0).toArray();
      await db.workoutHistory.clear();
      await db.workoutHistory.bulkPut([
        ...history.map((h) => ({ ...h, synced: true })),
        ...unsynced,
      ]);
    } catch {}
  }
  return db.workoutHistory.orderBy("logged_at").reverse().toArray();
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"
import './App.css'
import WorkoutPlanPage from "./pages/workout/workoutPlanPage.jsx";
import Login from "./pages/auth/loginPage.jsx";
import Signup from "./pages/auth/signupPage.jsx";
import PerformancePage from "./pages/performance/PerformancePage.jsx";
import NutritionPage from "./pages/nutrition/nutritionPlan.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfileFormPage from "./pages/profile/ProfileFormPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { useEffect } from "react";
import { seedOfflineData, flushSyncQueue } from "./lib/offlineService.js";
import WorkoutHistoryPage from "./pages/history/WorkoutHistoryPage.jsx";

function App() {
  
  useEffect(() => {
    // Cache data for offline use on every load
    seedOfflineData();

    // Auto-sync queued workouts when internet returns
    window.addEventListener("online", flushSyncQueue);
    return () => window.removeEventListener("online", flushSyncQueue);
  }, []);

  return (
    <BrowserRouter>
      {/*
        Sonner Toaster — place once at root level.
        position      → where toasts appear on screen
        richColors    → green for success, red for error automatically
        theme         → matches our dark app theme
      */}
      <Toaster
        position="bottom-center"
        richColors
        theme="dark"
      />

      <Routes>
        <Route path="/"        element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfileFormPage/>}/>
        <Route path="/profilepage" element={<ProfilePage/>}/>
        <Route path="/workout" element={<WorkoutPlanPage />} />
        <Route path="/performance" element={<PerformancePage/>}/>
        <Route path="/nutrition" element={<NutritionPage/>}/>
        <Route path="/history" element={<WorkoutHistoryPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

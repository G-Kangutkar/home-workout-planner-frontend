import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"
import './App.css'
import WorkoutPlanPage from "@/pages/workout/WorkoutPlanPage";
import Login from "./pages/auth/loginPage";
import Signup from "./pages/auth/signupPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PerformancePage from "./pages/performance/PerformancePage";
import NutritionPage from "./pages/nutrition/nutritionPlan";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  

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
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/workout" element={<WorkoutPlanPage />} />
        <Route path="/performance" element={<PerformancePage/>}/>
        <Route path="/nutrition" element={<NutritionPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

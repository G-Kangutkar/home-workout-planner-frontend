import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"
import './App.css'
import WorkoutPlanPage from "@/pages/workout/WorkoutPlanPage";
import Login from "./pages/auth/loginPage";
import Signup from "./pages/auth/signupPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PerformancePage from "./pages/performance/PerformancePage";

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
        <Route path="/login"        element={<Login />} />
        <Route path="/" element={<Signup/>} />
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/workout" element={<WorkoutPlanPage />} />
        <Route path="/performance" element={<PerformancePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

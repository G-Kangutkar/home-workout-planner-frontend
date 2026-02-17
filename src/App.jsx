import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"
import './App.css'
import WorkoutPlanPage from "@/pages/workout/WorkoutPlanPage";

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
        <Route path="/"        element={<Navigate to="/workout" replace />} />
        <Route path="/workout" element={<WorkoutPlanPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

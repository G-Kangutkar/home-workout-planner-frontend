
import {  Link } from "react-router-dom";
import { Menu, X, Dumbbell, UserCircle2 } from "lucide-react";
import { useState } from "react";

function Navbar() {
 
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <nav
      className="fixed top-0 left-0 right-0 z-9999 border-b border-white/6"
      style={{
        background: "rgba(17,19,24,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        isolation: "isolate",
      }}
    >
      {/* Top lime accent bar */}
      <div className="h-0.5 w-full bg-linear-to-r from-lime-400 via-lime-300 to-cyan-400" />

      <div className="w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">

          {/* ── Logo ── */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(163,230,53,0.45)]"
              style={{ background: "#a3e635" }}
            >
              <Dumbbell className="w-4 h-4 text-zinc-900" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight truncate">
                <span className="hidden sm:inline">Home Workout Planner</span>
                <span className="sm:hidden">Workout</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium tracking-widest uppercase hidden sm:block">
                Your personalized weekly plan
              </p>
            </div>
          </div>

          {/* ── Desktop nav links ── */}
          <div className="max-md:hidden flex items-center gap-1">
            <Link
              to="/nutrition"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
            >
              Nutrition Plan
            </Link>
            <Link
              to="/performance"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200"
            >
              Performance
            </Link>
            <Link
  to="/history"
  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400
             hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
>
  History
</Link>

            {/* Profile avatar — desktop */}
            <Link
              to="/profilepage"
              title="My Profile"
              className="ml-1 w-9 h-9 rounded-full flex items-center justify-center border border-zinc-700 bg-zinc-800/60 hover:border-lime-400/50 hover:bg-lime-400/10 transition-all duration-200 group"
            >
              <UserCircle2 className="w-5 h-5 text-cyan-500 group-hover:text-lime-400 transition-colors duration-200" />
            </Link>

           
          </div>

          {/* ── Mobile: profile + logout + hamburger ── */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Profile avatar — mobile */}
            <Link
              to="/profilepage"
              title="My Profile"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-zinc-700 bg-zinc-800/60 hover:border-lime-400/50 transition-all duration-200"
            >
              <UserCircle2 className="w-4 h-4 text-cyan-500" />
            </Link>

            {/* <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_12px_rgba(163,230,53,0.3)]"
            >
              Logout
            </button> */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/6 px-4 py-3 flex flex-col gap-1"
          style={{ background: "rgba(17,19,24,0.99)" }}
        >
          <Link
            to="/nutrition"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
            Nutrition Plan
          </Link>
          <Link
            to="/performance"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            Performance
          </Link>
          <Link
  to="/history"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
             text-zinc-400 hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
>
  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
  History
</Link>
          <Link
            to="/profilepage"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cyan-500 hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
            My Profile
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
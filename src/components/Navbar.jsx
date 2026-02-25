
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Menu, X, Dumbbell } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/");
    toast.success('🚀 Logged out successfully!');
  }
  return (

    // <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-50 backdrop-blur-md border-b border-gray-200 shadow-sm">
    //     <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 ">
    //         <div className=" flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

    //             <div className="shrink-0  min-w-0">
    //                 <a href="#home" className="text-lime-700 font-heading text-base sm:text-xl md:text-2xl lg:text-3xl font-bold truncate block">
    //                     <span className="hidden md:inline">Home Workout Planner</span>
    //                     <span className="md:hidden">Workout</span>
    //                 </a>
    //             </div>

    //             <div className="flex items-center gap-4 shrink-0">
    //                 <a href="/nutrition" className=" text-lime-500  text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate block">
    //                     <span className="hidden md:inline">Nutrition Plan</span>
    //                     <span className="md:hidden">Nutrition</span>
    //                 </a>
    //                 <a href="/performance" className=" text-lime-500  text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate block">Performance</a>


    //                 <button
    //                     type="submit"
    //                     onClick={handleLogout}
    //                     className="bg-lime-400 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl text-white hover:bg-lime-700 transition-colors whitespace-nowrap "
    //                 >
    //                     <span className="hidden sm:inline">Log out</span>
    //                     <span className="sm:hidden">Logout</span>
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // </nav>
    //      <nav className="fixed top-0 left-0 right-0 border-b border-white/6"
    //   style={{ background: "rgba(17,19,24,0.95)", backdropFilter: "blur(16px)" }}>

    //   {/* Top lime accent bar */}
    //   <div className="h-0.5 w-full bg-linear-to-r from-lime-400 via-lime-300 to-cyan-400" />

    //   <div className="w-full max-w-6xl mx-auto ">
    //     <div className="flex items-center justify-between h-14 sm:h-16">

    //       {/* ── Logo + page title ── */}
    //       <div className="flex items-center gap-3 min-w-0">
    //         <div
    //           className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(163,230,53,0.45)]"
    //           style={{ background: "#a3e635" }}
    //         >
    //           <Dumbbell className="w-4 h-4 text-zinc-900" />
    //         </div>
    //         <div className="min-w-0">
    //           <h1 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight truncate">
    //             <span className="hidden sm:inline">Home Workout Planner</span>
    //             <span className="sm:hidden">Workout</span>
    //           </h1>
    //           <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium tracking-widest uppercase hidden sm:block">
    //             Your personalized weekly plan
    //           </p>
    //         </div>
    //       </div>

    //       {/* ── Desktop nav links ── */}
    //       <div className="hidden md:flex items-center gap-1">
    //         <a
    //           href="/nutrition"
    //           className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
    //         >
    //           Nutrition Plan
    //         </a>
    //         <a
    //           href="/performance"
    //           className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200"
    //         >
    //           Performance
    //         </a>
    //         <button
    //           type="button"
    //           onClick={handleLogout}
    //           className="ml-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_16px_rgba(163,230,53,0.3)] hover:shadow-[0_0_24px_rgba(163,230,53,0.5)] hover:-translate-y-0.5 active:translate-y-0"
    //         >
    //           Log out
    //         </button>
    //       </div>

    //       {/* ── Mobile: logout + hamburger ── */}
    //       <div className="flex items-center gap-2 md:hidden">
    //         <button
    //           type="button"
    //           onClick={handleLogout}
    //           className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_12px_rgba(163,230,53,0.3)]"
    //         >
    //           Logout
    //         </button>
    //         <button
    //           type="button"
    //           onClick={() => setMenuOpen(!menuOpen)}
    //           className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
    //         >
    //           {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* ── Mobile dropdown menu ── */}
    //   {menuOpen && (
    //     <div
    //       className="md:hidden border-t border-white/6 px-4 py-3 flex flex-col gap-1"
    //       style={{ background: "rgba(17,19,24,0.98)" }}
    //     >
    //       <a
    //         href="/nutrition"
    //         onClick={() => setMenuOpen(false)}
    //         className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-lime-400 hover:bg-white/5 transition-all duration-200"
    //       >
    //         <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
    //         Nutrition Plan
    //       </a>
    //       <a
    //         href="/performance"
    //         onClick={() => setMenuOpen(false)}
    //         className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200"
    //       >
    //         <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
    //         Performance
    //       </a>
    //     </div>
    //   )}
    // </nav>
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

          {/* ── Logo + page title ── */}
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
            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_16px_rgba(163,230,53,0.3)] hover:shadow-[0_0_24px_rgba(163,230,53,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Log out
            </button>
          </div>

          {/* ── Mobile: logout + hamburger ── */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-900 bg-lime-400 hover:bg-lime-300 transition-all duration-200 shadow-[0_0_12px_rgba(163,230,53,0.3)]"
            >
              Logout
            </button>
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

      {/* ── Mobile dropdown menu ── */}
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
        </div>
      )}
    </nav>

  )
}
export default Navbar
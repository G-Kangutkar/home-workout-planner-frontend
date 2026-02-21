
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/");
        toast.success('🚀 Logged out successfully!');
    }
    return (

        <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-50 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 ">
                <div className=" flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
                   
                    <div className="shrink-0  min-w-0">
                        <a href="#home" className="text-green-700 font-heading text-base sm:text-xl md:text-2xl lg:text-3xl font-bold truncate block">
                            <span className="hidden md:inline">Home Workout Planner</span>
                            <span className="md:hidden">Workout</span>
                        </a>
                    </div>

                    <div>
                        <a href="/performance">Performance</a>
                    </div>

                    <button
                        type="submit"
                        onClick={handleLogout}
                        className="bg-lime-400 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl text-white hover:bg-lime-700 transition-colors whitespace-nowrap shrink-0"
                    >
                        <span className="hidden sm:inline">Log out</span>
                        <span className="sm:hidden">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
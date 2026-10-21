import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar ({user, onToggle, isOpen}){
const navigate = useNavigate();

const handleLogout =() =>{
    localStorage.removeItem("token");
    navigate ("/login");
}
return(
     <header className="bg-navbar shadoe-md">
        <nav className="flex justify-between items-center px-4 sm:px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="app-sidebar"
                onClick={onToggle}
                className="rounded-md p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        <h1 className="text-2xl font-bold text-white">
            Smart Resume{" "}
            <span className="text-primary">
                ATS
            </span>
        </h1>
        </div>

        <div className="flex items-center gap-4">
          

            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-medium">
                {user?.name}
            </p>
            <button className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded-lg transition"
                onClick={handleLogout}>
                    Logout
            </button>
        </div>
        </nav>
     </header>
        );
    }

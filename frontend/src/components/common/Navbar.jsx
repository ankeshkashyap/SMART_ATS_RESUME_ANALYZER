import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useUser } from "../../context/UserContext";

export default function Navbar({ onToggle, isOpen }) {
    const navigate = useNavigate();
    const user = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        function handleEscape(e) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <header className="bg-navbar  shadow-md">
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
                        <span className="text-primary">ATS</span>
                    </h1>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        aria-label="User menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">
                            {user?.name || "User"}
                        </span>
                        <ChevronDown size={16} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-50 dark:border-slate-600 dark:bg-slate-800">
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-600">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email || ""}
                                </p>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                                    >
                                        <User size={16} />
                                        My Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                </li>
                                <li className="border-t border-gray-200 dark:border-slate-600 mt-1 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

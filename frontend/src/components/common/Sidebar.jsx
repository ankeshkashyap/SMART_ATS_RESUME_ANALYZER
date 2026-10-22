import {LayoutDashboard, FileText , Briefcase, History, BarChart3, User, Settings, X } from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

export default function Sidebar({ collapsed = false, mobileOpen = false, onClose = () => {} }){
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems=[
        {name:"Dashboard",
        icon:LayoutDashboard,
        path:"/dashboard"
        },
        {   name:"Resume",
            icon:FileText,
            path:"/resume"
        },
        {   name:"Job Description",
            icon:Briefcase,
            path:"/jd-history"
        },

        {   name:"Analysis History",
            icon:History,
            path:"/analysis-history"
        },
        {   name:"Analytics",
            icon:BarChart3,
            path:"/analytics"
        },
        {name:"Profile",
         icon:User,
         path:"/profile"
        },
        {name:"Settings",
         icon:Settings,
         path:"/settings"
        },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                id="app-sidebar"
                className={`hidden md:block bg-card border-r border-border min-h-screen transition-all duration-300 ease-in-out ${
                    collapsed ? "w-16" : "w-64"
                }`}
            >
                <nav className="p-6">
                    <ul className="space-y-2">
                       {menuItems.map((item)=> {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                            <li key={item.name} onClick= {() => handleNavigate(item.path)} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                isActive
                                    ? "bg-orange-50 border-l-4 border-primary text-gray-900 font-semibold dark:bg-orange-900/20 dark:text-primary"
                                    : "text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-slate-700 dark:hover:text-gray-100"
                            }`}>
                                <Icon size={20} />
                               <span className={`${collapsed ? "hidden" : "inline"}`}> {item.name}</span></li>
                        )
                        }
                        )
                       }
                    </ul>
                </nav>
            </aside>

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-hidden={!mobileOpen}
            >
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="text-lg font-bold text-text-primary">Menu</span>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={onClose}
                        className="rounded-md p-1 text-text-secondary transition hover:bg-gray-100 hover:text-text-primary dark:hover:bg-slate-700"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                       {menuItems.map((item)=> {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                            <li key={item.name} onClick= {() => handleNavigate(item.path)} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                isActive
                                    ? "bg-orange-50 border-l-4 border-primary text-gray-900 font-semibold dark:bg-orange-900/20 dark:text-primary"
                                    : "text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-slate-700 dark:hover:text-gray-100"
                            }`}>
                                <Icon size={20} />
                               <span> {item.name}</span></li>
                        )
                        }
                        )
                       }
                    </ul>
                </nav>
            </aside>
        </>
    );
}

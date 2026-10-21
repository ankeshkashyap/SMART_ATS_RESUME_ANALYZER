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
                className={`hidden md:block bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out ${
                    collapsed ? "w-16" : "w-64"
                }`}
            >
                <nav className="p-6">
                    <ul className="space-y-2">
                       {menuItems.map((item)=> {
                            const Icon = item.icon;
                            return (
                            <li key={item.name} onClick= {() => handleNavigate(item.path)} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${location.pathname==item.path? "bg-orange-50 border-l-4 border-primary text-gray-900 font-semibold": "text-gray-600 hover:bg-gray-100 hover:text-black"}`}>
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
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-hidden={!mobileOpen}
            >
                <div className="flex items-center justify-between p-4">
                    <span className="text-lg font-bold text-gray-900">Menu</span>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                       {menuItems.map((item)=> {
                            const Icon = item.icon;
                            return (
                            <li key={item.name} onClick= {() => handleNavigate(item.path)} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${location.pathname==item.path? "bg-orange-50 border-l-4 border-primary text-gray-900 font-semibold": "text-gray-600 hover:bg-gray-100 hover:text-black"}`}>
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

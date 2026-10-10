import {LayoutDashboard, FileText , Briefcase, History, BarChart3, User, Settings, } from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";
export default function Sidebar (){
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
    return (
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200  min-h-screen">
            <nav className="p-6">
            <ul className="space-y-2">
               {menuItems.map((item)=> {
                    const Icon = item.icon;
                    return (
                    <li key={item.name} onClick= {()=> navigate(item.path)} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${

                        location.pathname==item.path? "bg-orange-50 border-l-4 border-primary text-gray-900 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
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
    );
}
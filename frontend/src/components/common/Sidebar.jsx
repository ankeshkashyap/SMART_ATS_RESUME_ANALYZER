import {LayoutDashboard, Upload, History, BarChart3, User, Settings, } from "lucide-react";

export default function Sidebar (){
    const menuItems=[
        {name:"Dashboard",
        icon:LayoutDashboard 
        },
        {name:"Upload Resume",
            icon:Upload,
        },
        {name:"History",
            icon:History,
        },
        {name:"Analytics",
            icon:BarChart3,
        },
        {name:"Profile",
         icon:User,
        },
        {name:"Settings",
         icon:Settings,
        },
    ];
    return (
        <aside className="w-64 bg-white border-r border-gray-200  min-h-screen">
            <nav className="p-6">
            <ul className="space-y-2">
               {menuItems.map((item)=> {
                    const Icon = item.icon;
                    return (
                    <li key={item.name} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        item.name === "Dashboard"? "bg-orange-50 border-l-4 border-primary text-gray-900 font-semibold"
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
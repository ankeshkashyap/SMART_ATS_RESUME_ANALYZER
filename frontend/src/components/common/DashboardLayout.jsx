import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import api from "../../services/api";
import {UserContext} from "../../context/UserContext"

function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== "undefined" ? window.innerWidth >= 768 : true
    );

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get("/auth/profile");
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        }

        fetchProfile();
    }, []);

    // Keep the mobile drawer / collapsed state consistent with the viewport.
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (desktop) {
                setMobileOpen(false);
                setCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggle = () => {
        if (isDesktop) {
            setCollapsed((prev) => !prev);
        } else {
            setMobileOpen((prev) => !prev);
        }
    };

    const isOpen = isDesktop ? !collapsed : mobileOpen;

    return (
        <UserContext.Provider value = {user}>
        <div className="min-h-screen bg-background">
            <Navbar user={user} onToggle={handleToggle} isOpen={isOpen} />

            <div className="flex">
                <Sidebar
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                    {children}
                </main>
            </div>
        </div>
        </UserContext.Provider>
    );
}

export default DashboardLayout;
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import api from "../../services/api";
import {UserContext} from "../../context/UserContext"

function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);

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

    return (
        <UserContext.Provider value = {user}>
        <div className="min-h-screen bg-background">
            <Navbar user={user} />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                    {children}
                </main>
            </div>
        </div>
        </UserContext.Provider>
    );
}

export default DashboardLayout;
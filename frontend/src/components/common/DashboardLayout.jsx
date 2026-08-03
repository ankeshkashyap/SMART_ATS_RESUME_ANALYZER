import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({user, children}){
    return(
        <div className="min-h-screen bg-background">
            <Navbar user={user} />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
export default DashboardLayout;
export default function Navbar ({user}){

return(
     <header className="bg-navbar shadoe-md">
        <nav className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
            logo
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
            <button className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded-lg transition">
                    Logout
            </button>
        </div>
        </nav>
     </header>
        );
    }
    
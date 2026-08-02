export default function Navbar ({user}){

return(
     <header>
        <nav className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-3">
            logo
            <h1>
                Smart Resume ATS
            </h1>
        </div>
        <div className="flex items-center gap-3">
            <p>
                {user?.name}
            </p>
            <button>
                    Logout
            </button>
        </div>
        </nav>
     </header>
        );
    }
    
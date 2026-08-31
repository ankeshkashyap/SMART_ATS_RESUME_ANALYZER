import { useNavigate } from "react-router-dom";

export default function DashboadHeader({user , onUploadClick}){
    
const navigate = useNavigate();

    return(
        <section className="flex flex-col sm:flex-row  sm:justify-between sm:items-center gap-4">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
                Welcome back, {user?.name}
            </p>
            </div>

            <button
            type="button"
            onClick={() => navigate("/analyze")}
            className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-text-primary shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
             Analyze Resume
        </button>

            <button
                type="button"
                onClick={onUploadClick}
                className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-text-primary shadow-sm transition hover:border-primary hover:text-primary"
            >
                Upload New Resume
            </button>

            <button
                type="button"
                onClick={() => navigate("/job-description")}
                className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-text-primary shadow-sm transition hover:border-primary hover:text-primary"
            >
               Add Job Description
            </button>

        
        </section>
    );
}
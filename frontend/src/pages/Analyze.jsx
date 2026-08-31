import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom" ;
import api from "../services/api";

const Analyze = () => {
    const navigate = useNavigate();

    const [resumes , setResumes] = useState([]);
    const [jobDescriptions, setJobDescriptions] = useState ([]);
    
    const [selectedResume, setSelectedResume] = useState("");
    const [selectedJobDescription, setSelectedJobDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error ,setError ]= useState("");

    useEffect(()=>{
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [resumeResponse , jdResponse]= await Promise.all(
                    [
                        api.get("/resume/"),
                        api.get("/job-descriptions/")
                    ]
                );
                setResumes(resumeResponse.data);
                setJobDescriptions(jdResponse.data);

            }
            catch(error) {
                console.error("Failed to load analysis data:",error);

                if (error.response?.data?.detail){
                    setError (error.response.data.detail)
                } else {
                    setError("Failed to load resumes and job descriptions.");
                } 
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

   const handleAnalyze = async () => {
    if (!selectedResume || !selectedJobDescription ) {
        return;
    }
    try {
        setAnalyzing(true);
        setError("");

        const response = await api.post ("/analyses/",{
            resume_id : Number (selectedResume),
            job_description_id : Number (selectedJobDescription)

        });

        const analysisID = response.data.id;

        navigate (`/analysis/${analysisID}`)
    }
    catch (error) {
        console.error("Analysis failed:", error);

        if (error.response?.data?.detail){
            setError (error.response.data.detail)
        } else {
            setError("Failed to create analysis");
        }
    }
    finally {
        setAnalyzing(false);
    }
   };

   if (loading) {
    return (
        <div className="min-h-screen bg-backgraund flex items-center justify-center">
            <p className="text-sm font-medium text-text-secondary">
                Loading...
            </p>
        </div>
    );
}

   return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                Analyze Resume</h1>
            <p className="mt-2 text-sm text-text-secondary">
                Compare your resume against a specific job description.
            </p>
        </div>

        {error && (
            <div className="mb-6 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
            </div>
        )}
        <div className="rounded-card border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6">
                <label htmlFor="resume"
                    className="mb-2 block text-sm font-semibold text-text-primary">
                    Resume
                </label>
                <select 
                id="resume"
                value={selectedResume}
                onChange={(e)=> setSelectedResume(e.target.value)}
                className="h-11 w-full rounded-md border border-border
                bg-card px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">
                     Select a resume
                    </option>
                    
                    {resumes.map((resume) => (
                        <option 
                        key={resume.id}
                        value={resume.id}
                        >
                            {resume.filename}
                        </option>
                    ))}

                </select>
            </div>

             <div className="mb-8">
                    <label htmlFor="job-description"
                        className="mb-2 block text-sm font-semibold text-text-primary">
                        Job Description
                    </label>

                    <select
                        id="job-description"
                        value={selectedJobDescription}
                        onChange={(e) =>
                            setSelectedJobDescription(
                                e.target.value
                            )
                        }
                        className="h-11 w-full rounded-md border border-border
                                bg-card px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">
                            Select a job description
                        </option>

                        {jobDescriptions.map((jd) => (
                            <option
                                key={jd.id}
                                value={jd.id}
                            >
                                {jd.title}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={!selectedResume || !selectedJobDescription || analyzing}
                        className="h-11 w-full rounded-md border border-primary-hover bg-primary px-5 text-sm font-bold text-text-primary shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:border-border disabled:bg-gray-200 disabled:text-text-secondary"
                        >
                        {analyzing ? (
                            <span className="inline-flex items-center gap-2">
                            <svg
                                className="h-4 w-4 animate-spin text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                />
                                <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Analyzing...
                            </span>
                        ) : (
                            "Analyze Resume"
                        )}
                        </button>
            </div>
            
            <div className="mt-8">
                <h2 className="text-center text-lg font-bold text-text-primary">
                    What you'll get from this analysis
                </h2>

                <p className="mt-2 text-center text-sm text-text-secondary">
                    Understand how well your reume matches your job.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-card border border-border bg-card p-5 text-center shadow-sm">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-text-primary">
                        %
                        </div>
                        <h3 className="mt-3 text-sm font-bold text-text-primaryprimary">
                            ATS Score
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            See your overall resume compatibility score.
                        </p>
                    </div>
                    <div className="rounded-card border border-border bg-card p-5 text-center shadow-sm">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-sm font-bold text-success">
                             ✓
                            </div>

                            <h3 className="mt-3 text-sm font-bold text-text-primary">
                                Keyword Match
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-text-secondary">
                                Find important keywords you have or are missing.
                            </p>
                        </div>
                        <div className="rounded-card border border-border bg-card p-5 text-center shadow-sm">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-sm font-bold text-warning">
                            !
                        </div>

                        <h3 className="mt-3 text-sm font-bold text-text-primary">
                            Skill Gaps
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Identify skills that could strengthen your application.
                        </p>

                    </div>
                </div>
            </div>


        </div>
    </div>
   )
}
export default Analyze;
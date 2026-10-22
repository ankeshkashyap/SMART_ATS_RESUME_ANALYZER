import { useState , useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const MAX_LENGTH = 10000;

const exampleJD = `We are looking for a Python Backend Developer to join our engineering team.

Responsibilities:
- Develop REST APIs using Python and FastAPI
- Work with PostgreSQL databases
- Build scalable backend services
- Write clean and maintainable code
- Collaborate with frontend engineers

Requirements:
- Strong Python programming skills
- Experience with FastAPI or Django
- Knowledge of PostgreSQL and SQL
- Understanding of REST APIs
- Familiarity with Git and Docker
- Knowledge of AWS is a plus`;

function JobDescription() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [deleteID , setDeleteID]= useState(null);
  const navigate =useNavigate(); 

  const fetchJobDescriptions = async () => {
    try {
        const response = await api.get("/job-descriptions/");

        setJobDescriptions (response.data)
    } catch(error){
        console.error ("Failed t0o fetch job description:",error);
    } 
  };

  useEffect(() => {
  fetchJobDescriptions();
}, []);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_LENGTH) {
      setDescription(value);
    }
  };

  const handleExample = () => {
    setTitle("Python Backend Developer");
    setDescription(exampleJD);
    setError("");
    setResult(null);
  };

  const handleDelete = async (id) => {
    
    try {
        await api.delete (`/job-descriptions/${id}`);

        await fetchJobDescriptions();
    }
    catch (error){
        console.error("Failed to delete job description:",error);
  }

  }; 
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Job description is required.");
      return;
    }

    if (description.trim().length < 50) {
      setError("Job description must contain at least 50 characters.");
      return;
    }   


    try {
      setLoading(true);

      const response = await api.post("/job-descriptions/", {
        title: title.trim(),
        description: description.trim(),
      });

      setResult(response.data);
      fetchJobDescriptions();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to analyze job description."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-background px-7 py-8">
    <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer mb-6 flex items-center gap-2 text-sm text-gray-900 hover:text-gray-500 dark:text-text-secondary"
        >
       <ArrowLeft size={16} />
        Back to DashBoard
    </button>
    {/* PAGE HEADER */}
    <div className="mb-7 flex items-start justify-between">

        <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#172b4d] dark:text-text-primary">
                Job Description
            </h1>

            <p className="mt-1 text-sm text-[#66758a] dark:text-text-secondary">
                Paste the job description you want to analyze.
            </p>
        </div>

    </div>


    
    <div className="rounded-lg border border-[#dfe3e8] dark:border-border bg-white dark:bg-card shadow-sm">

        <form
            onSubmit={handleSubmit}
            className="p-7"
        >

            
            <div className="mb-6">

                <label
                    htmlFor="job-title"
                    className="mb-2 block text-sm font-semibold text-[#172b4d] dark:text-text-primary"
                >
                    Job Title
                </label>

                <input
                    id="job-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Python Backend Developer"
                    className="h-11 w-full rounded-md border border-[#cfd5dd] dark:border-border bg-white dark:bg-[#202024] px-3 text-sm text-[#172b4d] dark:text-text-primary outline-none transition placeholder:text-[#98a2b3] focus:border-primary focus:ring-2 focus:ring-primary/15"
                />

            </div>

            <div className="mb-6">

                <div className="mb-2 flex items-center justify-between">

                    <label
                        htmlFor="job-description"
                        className="text-sm font-semibold text-[#172b4d] dark:text-text-primary"
                    >
                        Job Description
                    </label>

                    <span
                        className="rounded-md border border-[#ffe0b2] dark:border-border bg-[#fff7e8] dark:bg-[#202024] px-2.5 py-1 text-xs font-medium text-[#b96800]"
                    >
                        {description.length} / {MAX_LENGTH}
                    </span>

                </div>

                <textarea
                    id="job-description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Paste the job description here..."
                    rows={15}
                    className="w-full resize-y rounded-md border border-[#cfd5dd] dark:border-border bg-white dark:bg-[#202024] px-3 py-3 text-sm leading-6 text-[#172b4d] dark:text-text-primary outline-none transition placeholder:text-[#98a2b3] focus:border-primary focus:ring-2 focus:ring-primary/15"
                />

            </div>

            {error && (
                <p className="mb-5 rounded-md border border-[#f1c4c4] dark:border-border bg-[#fff7f7] dark:bg-[#202024] px-3 py-2.5 text-sm text-[#b42318] dark:text-danger">
                    {error}
                </p>
            )}


            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={handleExample}
                    disabled={loading}
                    className="rounded-md border border-[#cfd5dd] dark:border-border bg-white dark:bg-[#202024] px-5 py-2.5 text-sm font-semibold text-[#344054] dark:text-text-primary transition hover:bg-[#f7f8fa] hover:border-[#b8c0ca] dark:hover:bg-[#2a2a30] dark:hover:border-[#41414a] disabled:cursor-not-allowed disabled:opacity-50"                >
                    Use Example
                </button>

                <button    
                        type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Analyzing..." : "Analyze JD"}
                </button>

            </div>

        </form>

    </div>


    {result && (
        <div className="mt-7 rounded-lg border border-[#dfe3e8] dark:border-border bg-white dark:bg-card p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-bold text-[#172b4d] dark:text-text-primary">
                        Extracted Keywords
                    </h2>

                    <p className="mt-1 text-xs text-[#66758a] dark:text-text-secondary">
                        Skills and technologies detected from the job description.
                    </p>
                </div>

                <span className="rounded-md bg-[#fff7e8] dark:bg-border px-2.5 py-1 text-xs font-semibold text-[#b96800]">
                    {result.keywords?.length || 0} found
                </span>

            </div>


            <div className="flex flex-wrap gap-2">

                {result.keywords?.map((keyword) => (

                    <span
                        key={keyword}
                        className="rounded-md border border-[#ffe0b24e] bg-[#fff7e8] dark:bg-border px-2.5 py-1.5 text-xs font-semibold text-[#9a5b00]"
                    >
                        {keyword}
                    </span>

                ))}

            </div>

        </div>
    )}


    <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">

            <div>
                <h2 className="text-lg font-bold text-[#172b4d] dark:text-text-primary">
                    Previous Job Descriptions
                </h2>
                
                <p className="mt-1 text-xs text-[#66758a] dark:text-text-secondary">
                    Your recently analyzed job descriptions.
                </p>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-[#eef1f4] dark:bg-[#202024] px-2 text-xs font-semibold text-[#596579] dark:text-text-secondary">
                {jobDescriptions.length}
            </span>

        </div>


        {jobDescriptions.length === 0 ? (

            <div className="rounded-lg border border-dashed border-[#cfd5dd] dark:border-border bg-white dark:bg-card px-5 py-10 text-center">

                <p className="text-sm font-semibold text-[#344054] dark:text-text-primary">
                    No job descriptions yet.
                </p>

                <p className="mt-1 text-xs text-[#7a8799] dark:text-text-secondary">
                    Analyze a job description to start building your history.
                </p>

            </div>

        ) : (

            <div className="divide-y divide-border rounded-lg border border-[#dfe3e8] dark:border-border bg-white dark:bg-card">

                {jobDescriptions.map((jd) => (

                    <div
                        key={jd.id}
                        className="flex items-start justify-between gap-6 px-5 py-5 transition hover:bg-[#fafbfc] dark:hover:bg-[#202024]"
                    >

                        <div className="min-w-0 flex-1">

                            <h3 className="text-sm font-semibold text-[#172b4d] dark:text-text-primary">
                                {jd.title}
                            </h3>

                            <p className="mt-1.5 max-w-3xl text-sm leading-5 text-[#66758a] dark:text-text-secondary">
                                {jd.description.slice(0, 150)}
                                {jd.description.length > 150 ? "..." : ""}
                            </p>

                            <p className="mt-2 text-[11px] text-[#98a2b3] dark:text-text-secondary">
                                {new Date(jd.created_at).toLocaleString()}
                            </p>

                        </div>


                        <div className="flex max-w-xs flex-wrap justify-end gap-1.5">

                            {jd.keywords?.slice(0, 5).map((keyword) => (

                                <span
                                    key={keyword}
                                    className="rounded-md border border-[#e1e5eb] dark:border-border bg-[#f7f8fa] dark:bg-[#202024] px-2 py-1 text-[11px] font-medium text-[#596579] dark:text-text-secondary"
                                >
                                    {keyword}
                                </span>

                            ))}
                              </div>
                              <button 
                                className="delete-button"
                                onClick={()=> setDeleteID(jd.id)}>
                                    Delete
                                </button>
                        

                    </div>

                ))}

            </div>

        )}

    </div>

    {deleteID&& (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-lg border border-border bg-white dark:bg-card p-6 shadow-lg">

                <h2 className="text-lg font-bold text-text-h">
                    Delete Job Description?    
                </h2> 

                <p className="mt-2 text-sm leading-6 text-text-primary">
                    This job description will be permanently deleted.
                    This action cannot be undone. 
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button"
                    onClick={()=>setDeleteID(null)}
                    className="rounded-md border border-border bg-white dark:bg-[#202024] px-5 py-2.5 text-sm font-semibold text-text-h dark:text-text-primary transition hover:bg-social-bg dark:hover:bg-[#2a2a30]">
                        Cancel
                    </button>
                    <button 
                    type="button"
                    onClick={async () => {await handleDelete(deleteID);
                    setDeleteID(null);  
                    }}
                     className="delete-button"
                >
                    Delete
                </button>
                </div>
        </div>
        </div>
    )}
    

</div>
  );
}

export default JobDescription;



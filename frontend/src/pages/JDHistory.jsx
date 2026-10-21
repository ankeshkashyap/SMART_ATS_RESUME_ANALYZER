import {useEffect , useState} from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function JDHistory() {
    const [JobDescriptions , setJobDescriptions] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState ("");
    const [deleteID, setDeleteID] = useState(null);
    const navigate = useNavigate();

    useEffect(()=> {
        async function fetchJobDescriptions (){
            try{
                const response = await api.get ("/job-descriptions/");
                setJobDescriptions(response.data);
            }
            catch (error){
                console.error("Failed to fetch job descriptions: " ,error);
                setError(
                    error.response?.data?.detail || "Failed to load job descriptions"
                );
            }
            finally{ 
                setLoading(false);
        }
        }
        fetchJobDescriptions();
    },[]);

    const handleDelete = async (jdId) => {
        
        try {
            await api.delete(`/job-descriptions/${jdId}`);

            setJobDescriptions((current) =>
                current.filter((jd) => jd.id !== jdId)
            );
        } catch (error) {
            console.error("Failed to delete job description:", error);
        }
    };
    return (
        <DashboardLayout >
            <div className="p-8">
                
            

                <div className="flex justify-between">
                    <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Job Descriptions
                </h1>

                <p className="mt-2 text-gray-600">
                    View your previously saved job descriptions.                
                </p>
                </div>

                 <button
                type="button"
                onClick={() => navigate("/job-description")}
                className="cursor-pointer rounded-md bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    Add Job Description
                </button>
                </div>

                {loading && (
                    <p className="mt-8 text-gray-500">
                        Loading job Descriptiond...
                    </p>
                )}
                {error && (
                    <p className="mt-8 text-red-500">
                        {error}
                    </p>
                )}
                {!loading && !error && JobDescriptions.length === 0 && (
                    <div>
                    <div class="null-scene">
                    <div class="null-word" data-text="NULL">NULL</div>
                    </div>

                    <p className="mt-8 text-gray-500 text-center">
                        No job Description yet.
                    </p>
                    </div>
                )
                }
                {!loading && !error && JobDescriptions.length > 0 && (
                    <div className="mt-8 space-y-4">
                        {JobDescriptions.map((jd) => (
                            <div key={jd.id}
                            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {jd.title}
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                    {jd.description}
                                </p>
                                <p className="mt-3 text-xs text-gray-400">
                                    Created :{" "}
                                    {new Date (jd.created_at).toLocaleDateString()}
                                </p>
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={()=> setDeleteID(jd.id)}
                                        className="delete-button">
                                            Delete
                                        </button>
                                        </div>
                                </div>

                        ))}
                    </div>
                )
                }
               
                {deleteID&& (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                            <div className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-lg">

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
                                    className="rounded-md border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text-h transition hover:bg-social-bg">
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
        </DashboardLayout>
    );
}

export default JDHistory;
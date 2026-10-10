import { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { FileText ,Eye , Trash2 } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Resume() {
    const [resumes , setResumes ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState("");
    const [deleteID, setDeleteID] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const navigate = useNavigate();
    
    useEffect(()=>{
        async function fetchResume(){
            try {
                const response = await api.get("/resume/");
                setResumes (response.data);
            }
            catch (error){
                setError(error.response?.data?.detail|| "Failed to fetch resumes.");
                console.error("Failed to fetch resume: ",error);

            }
            finally{
                setLoading(false);
            }
        }
        fetchResume();
    },[]);

    
    return (
        <DashboardLayout>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    My Resumes
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage your uploaded resumes.
                </p>

                {loading && (
                    <p className="mt-8 text-gray-500">
                        Loading resumes...
                    </p>
                )}

                {error && (
                    <p className="mt-8 text-red-500">
                        {error}
                    </p>
                )}

                {!loading && !error && resumes.length === 0 && (
                    <p className="mt-8 text-gray-500">
                        No resumes uploaded yet.
                    </p>
                )}

                {!loading && !error && resumes.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-orange-50 p-3">
                                        <FileText className="text-primary" size={24} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="wrap-break-word text-lg font-semibold text-gray-900">
                                            {resume.filename}
                                        </h2>

                                        <p className="mt-1 text-sm uppercase text-gray-500">
                                            {resume.file_type}
                                        </p>

                                        <p className="mt-3 text-sm text-gray-600">
                                            Size: {(resume.file_size / 1024).toFixed(1)} KB
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Uploaded:{" "}
                                            {new Date(resume.uploaded_at).toLocaleDateString()}
                                        </p>

                                        <div className="mt-4 flex justify-end gap-4">
                                            <button 
                                                type="button"
                                                onClick={()=>navigate(`/resume/${resume.id}`)}
                                                className="flex items-center gap-2 rounded-md border borger gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer">
                                                    <Eye size={16}/>
                                                    View

                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteID(resume.id);
                                                    setDeleteError("");
                                                }}
                                                className="flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                
{deleteID !== null && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900">
                Delete Resume?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
                This resume and its stored file will be permanently deleted.
                This action cannot be undone.
            </p>

            {deleteError && (
                <p className="mt-3 text-sm text-red-600">
                    {deleteError}
                </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setDeleteID(null)}
                    className="rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={deleting}
                    onClick={async () => {
                        setDeleting(true);
                        setDeleteError("");

                        try {
                            await api.delete(`/resume/${deleteID}`);

                            setResumes((current) =>
                                current.filter(
                                    (resume) => resume.id !== deleteID
                                )
                            );

                            setDeleteID(null);
                        } catch (error) {
                            console.error(
                                "Failed to delete resume:",
                                error
                            );

                            setDeleteError(
                                error.response?.data?.detail ||
                                "Failed to delete resume. Please try again."
                            );
                        } finally {
                            setDeleting(false);
                        }
                    }}
                    className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
)}


            </div>
        </DashboardLayout>
    );
}

export default Resume;

import { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { FileText } from "lucide-react";
import api from "../services/api";

function Resume() {
    const [resumes , setResumes ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState("");
    
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}

export default Resume;

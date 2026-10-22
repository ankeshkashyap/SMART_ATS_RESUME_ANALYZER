import { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { FileText, Eye, Trash2 } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import UploadResume from "./UploadResume";


function Resume() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteID, setDeleteID] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [uploadOpen, setUploadOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResume() {
            try {
                const response = await api.get("/resume/");
                setResumes(response.data);
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch resumes.");
                console.error("Failed to fetch resume: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchResume();
    }, []);

    const confirmBeforeDelete =
        localStorage.getItem("confirmBeforeDelete") !== "false";

    const handleDelete = async (targetId = deleteID) => {
        if (!targetId || deleting) return;

        setDeleting(true);
        setDeleteError("");

        try {
            await api.delete(`/resume/${targetId}`);

            setResumes((current) =>
                current.filter((resume) => resume.id !== targetId)
            );

            setDeleteID(null);
        } catch (error) {
            console.error("Failed to delete resume:", error);

            setDeleteError(
                error.response?.data?.detail ||
                "Failed to delete resume. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteClick = (id) => {
        if (confirmBeforeDelete) {
            setDeleteID(id);
            setDeleteError("");
        } else {
            handleDelete(id);
        }
    };

    return (
        <DashboardLayout>
            <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            My Resumes
                        </h1>

                        <p className="mt-2 text-text-secondary">
                            Manage your uploaded resumes.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setUploadOpen(true)}
                        className="cursor-pointer rounded-md bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        Upload New Resume
                    </button>
                </div>

                {loading && (
                    <p className="mt-8 text-text-secondary">
                        Loading resumes...
                    </p>
                )}

                {error && (
                    <p className="mt-8 text-red-500 dark:text-danger">
                        {error}
                    </p>
                )}

                {!loading && !error && resumes.length === 0 && (
                    <div>
                        <div className="null-scene">
                            <div className="null-word" data-text="NULL">NULL</div>
                        </div>

                        <p className="mt-8 text-text-secondary text-center">
                            No resumes uploaded yet.
                        </p>
                    </div>
                )}

                {!loading && !error && resumes.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="rounded-lg border border-border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
                                        <FileText className="text-primary" size={24} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="wrap-break-word text-lg font-semibold text-text-primary">
                                            {resume.filename}
                                        </h2>

                                        <p className="mt-1 text-sm uppercase text-text-secondary">
                                            {resume.file_type}
                                        </p>

                                        <p className="mt-3 text-sm text-text-secondary">
                                            Size: {(resume.file_size / 1024).toFixed(1)} KB
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            Uploaded:{" "}
                                            {new Date(resume.uploaded_at).toLocaleDateString()}
                                        </p>

                                        <div className="mt-4 flex justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/resume/${resume.id}`)}
                                                className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(resume.id)}
                                                disabled={deleting}
                                                className="flex items-center gap-2 rounded-md border border-red-200 dark:border-red-900/50 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
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

                {deleteID !== null && confirmBeforeDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
                            <h2 className="text-lg font-bold text-text-primary">
                                Delete Resume?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                This resume and its stored file will be permanently deleted.
                                This action cannot be undone.
                            </p>

                            {deleteError && (
                                <p className="mt-3 text-sm text-danger">
                                    {deleteError}
                                </p>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={() => {
                                        setDeleteID(null);
                                        setDeleteError("");
                                    }}
                                    className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {uploadOpen && (
                    <UploadResume
                        onClose={() => setUploadOpen(false)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}

export default Resume;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import DashboardLayout from "../components/common/DashboardLayout";
import api from "../services/api";

function AnalysisHistory() {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteID, setDeleteID] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAnalyses() {
            try {
                const response = await api.get("/analyses/");
                setAnalyses(response.data);
            } catch (error) {
                console.error("Failed to fetch analyses:", error);
                setError(
                    error.response?.data?.detail ||
                    "Failed to load analysis history."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchAnalyses();
    }, []);

    const confirmBeforeDelete =
        localStorage.getItem("confirmBeforeDelete") !== "false";

    const handleDelete = async (targetId = deleteID) => {
        if (targetId === null || deleting) return;

        setDeleting(true);
        setDeleteError("");

        try {
            await api.delete(`/analyses/${targetId}`);

            setAnalyses((current) =>
                current.filter((analysis) => analysis.id !== targetId)
            );

            setDeleteID(null);
        } catch (error) {
            console.error("Failed to delete analysis:", error);

            setDeleteError(
                error.response?.data?.detail ||
                "Failed to delete analysis. Please try again."
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

    function getScoreStyle(score) {
        const numericScore = parseInt(score, 10);

        if (numericScore >= 80) {
            return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        }

        if (numericScore >= 65) {
            return "bg-orange-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        }

        return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold text-text-primary">
                    Analysis History
                </h1>

                <p className="mt-2 text-text-secondary">
                    View and track your previous resume analyses.
                </p>

                <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                    <table className="w-full">
                        <thead className="bg-border dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">
                                    Resume
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">
                                    Job Role
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">
                                    ATS Score
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">
                                    Analyzed On
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-text-secondary">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-text-secondary"
                                    >
                                        Loading analysis history...
                                    </td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-danger"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && analyses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-text-secondary"
                                    >
                                        <div>
                                            <div className="null-scene">
                                                <div
                                                    className="null-word"
                                                    data-text="NULL"
                                                >
                                                    NULL
                                                </div>
                                            </div>
                                        </div>

                                        No analyses found. Analyze a resume to
                                        get started.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                !error &&
                                analyses.map((analysis) => (
                                    <tr
                                        key={analysis.id}
                                        className="border-t border-border transition hover:bg-slate-700/50 dark:hover:bg-[#202024]"
                                    >
                                        <td className="px-6 py-4 text-sm text-text-primary">
                                            {analysis.resume?.filename ||
                                                "Unknown resume"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-text-primary">
                                            {analysis.job_description?.title ||
                                                "Unknown role"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getScoreStyle(
                                                    analysis.ats_score ?? 0
                                                )}`}
                                            >
                                                {analysis.ats_score ?? 0}%
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-text-primary">
                                            {analysis.created_at
                                                ? new Date(
                                                      analysis.created_at
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                title="View analysis"
                                                aria-label="View analysis"
                                                onClick={() =>
                                                    navigate(
                                                        `/analysis/${analysis.id}`
                                                    )
                                                }
                                                className="text-text-secondary transition hover:text-primary"
                                            >
                                                <Eye size={20} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete analysis"
                                                aria-label="Delete analysis"
                                                onClick={() =>
                                                    handleDeleteClick(analysis.id)
                                                }
                                                disabled={deleting}
                                                className="ml-2 text-text-secondary transition hover:text-danger disabled:opacity-50"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteID !== null && confirmBeforeDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div
                        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-analysis-title"
                    >
                        <h2
                            id="delete-analysis-title"
                            className="text-lg font-bold text-text-primary"
                        >
                            Delete Analysis?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            This analysis result will be permanently deleted.
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
                                className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-700/50 dark:hover:bg-slate-700 disabled:opacity-50"
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
        </DashboardLayout>
    );
}

export default AnalysisHistory;

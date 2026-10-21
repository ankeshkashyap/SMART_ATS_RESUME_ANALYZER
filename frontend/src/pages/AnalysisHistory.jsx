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

    const handleDelete = async () => {
        if (deleteID === null || deleting) return;

        setDeleting(true);
        setDeleteError("");

        try {
            await api.delete(`/analyses/${deleteID}`);

            setAnalyses((current) =>
                current.filter((analysis) => analysis.id !== deleteID)
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

    function getScoreStyle(score) {
        const numericScore = parseInt(score, 10);

        if (numericScore >= 80) {
            return "bg-green-50 text-green-700";
        }

        if (numericScore >= 65) {
            return "bg-orange-50 text-yellow-700";
        }

        return "bg-red-50 text-red-700";
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Analysis History
                </h1>

                <p className="mt-2 text-gray-600">
                    View and track your previous resume analyses.
                </p>

                <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                    Resume
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                    Job Role
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                    ATS Score
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                    Analyzed On
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        Loading analysis history...
                                    </td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-red-500"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && analyses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-500"
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
                                        className="border-t border-gray-200 transition hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {analysis.resume?.filename ||
                                                "Unknown resume"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
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

                                        <td className="px-6 py-4 text-sm text-gray-700">
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
                                                className="text-gray-500 transition hover:text-primary"
                                            >
                                                <Eye size={20} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete analysis"
                                                aria-label="Delete analysis"
                                                onClick={() => {
                                                    setDeleteID(analysis.id);
                                                    setDeleteError("");
                                                }}
                                                disabled={deleting}
                                                className="ml-2 text-gray-500 transition hover:text-red-600 disabled:opacity-50"
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

            {deleteID !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div
                        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-analysis-title"
                    >
                        <h2
                            id="delete-analysis-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            Delete Analysis?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            This analysis result will be permanently deleted.
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
                                onClick={() => {
                                    setDeleteID(null);
                                    setDeleteError("");
                                }}
                                className="rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
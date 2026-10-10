import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import DashboardLayout from "../components/common/DashboardLayout";
import api from "../services/api";

function ResumeDetails() {
    const { resumeId } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchResume() {
            try {
                const response = await api.get(`/resume/${resumeId}`);
                setResume(response.data);
            } catch (error) {
                console.error("Failed to fetch resume:", error);
                setError(
                    error.response?.data?.detail ||
                    "Failed to load resume details."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchResume();
    }, [resumeId]);

    const sections = [
        { title: "Summary", content: resume?.parsed_resume?.sections?.summary },
        { title: "Skills", content: resume?.parsed_resume?.sections?.skills },
        { title: "Experience", content: resume?.parsed_resume?.sections?.experience },
        { title: "Projects", content: resume?.parsed_resume?.sections?.projects },
        { title: "Education", content: resume?.parsed_resume?.sections?.education },
        { title: "Achievements", content: resume?.parsed_resume?.sections?.achievements },
    ];

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl">
                <button
                    type="button"
                    onClick={() => navigate("/resume")}
                    className="cursor-pointer mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={16} />
                    Back to Resumes
                </button>

                {loading && (
                    <p className="text-gray-500">Loading resume...</p>
                )}

                {error && (
                    <p className="text-red-500">{error}</p>
                )}

                {!loading && !error && resume && (
                    <>
                        <div className="mb-8 flex items-center gap-4">
                            <div className="rounded-xl bg-orange-50 p-3">
                                <FileText size={28} className="text-primary" />
                            </div>

                            <div>
                                <h1 className="wrap-break-word text-2xl font-bold text-gray-900">
                                    {resume.filename}
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    {resume.file_type?.replace(".", "").toUpperCase()}
                                    {" · "}
                                    {new Date(
                                        resume.uploaded_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {sections.map((section) => (
                                <section
                                    key={section.title}
                                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                                >
                                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                                        {section.title}
                                    </h2>

                                    {section.content?.trim() ? (
                                        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-gray-600">
                                            {section.content}
                                        </p>
                                    ) : (
                                        <p className="text-sm italic text-gray-400">
                                            No {section.title.toLowerCase()} extracted.
                                        </p>
                                    )}
                                </section>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ResumeDetails;
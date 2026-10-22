import { Eye } from "lucide-react";
import api from "../../../services/api";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function RecentAnalyses (){
    const [analyses , setAnalyses]  = useState([]);
    const [error , setError] = useState("");
    const [loading , setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(()=>{
        async function fetchAnalyses(){
            try {
                const response = await api.get("/analyses/");
                setAnalyses(response.data)
            }
            catch(error){
                setError (error.response?.data?.detail|| "Faled to recent analyses.");
                console.error("Failed to fetch analyses: ",error)
            }

            finally {
                setLoading(false)
            }
        }
        fetchAnalyses();
    },[])

    function getScoreStyle(score) {
    const numericScore = parseInt(score);

    if (numericScore >= 80) {
        return "bg-green-50 text-green-700";
    }

    if (numericScore >= 65) {
        return "bg-orange-50 text-yellow-700";
    }

    return "bg-red-50 text-red-700";
}

    return (
        <section className="bg-white  dark:bg-card rounded-xl border border-gray-200 dark:border-border shadow-sm">
            <div className="flex justify-between items-center p-6">
               
                 <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary">
                    Recent Analyses
                </h2>
                {analyses.length != 0 &&(<button
                onClick={()=>navigate(`/analysis-history`)}
                className="text-primary font-medium hover:underline">
                    View All
                </button>)}
             </div>  
             <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-100 dark:bg-[#202024]">
                    <tr>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-text-secondary">
                            Resume Name
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-text-secondary">
                            Match Score
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-text-secondary">
                            Job Role
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-text-secondary">
                            Analyzed on
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-text-secondary">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td
                                colSpan="5"
                                className="px-6 py-8 text-center text-gray-500 dark:text-text-secondary"
                            >
                                Loading analyses...
                            </td>
                        </tr>
                    )}

                    {!loading && error && (
                        <tr>
                            <td
                                colSpan="5"
                                className="px-6 py-8 text-center text-red-500 dark:text-red-400"
                            >
                                {error}
                            </td>
                        </tr>
                    )}

                    {!loading && !error && analyses.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="px-6 py-8 text-center text-gray-500 dark:text-text-secondary"
                            >
                                No analyses found. Analyze a resume to get started.
                            </td>
                        </tr>
                    )}

                    {!loading && !error && analyses.map((analysis) => (
                        <tr
                            key={analysis.id}
                            className="border-t border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-[#202024] transition"
                        >
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-text-primary">
                                {analysis.resume?.filename || "Unknown resume"}
                            </td>

                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreStyle(
                                        analysis.ats_score ?? 0
                                    )}`}
                                >
                                    {analysis.ats_score ?? 0}%
                                </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-text-primary">
                                {analysis.job_description?.title || "Unknown role"}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-text-primary">
                                {analysis.created_at
                                    ? new Date(analysis.created_at).toLocaleDateString()
                                    : "N/A"}
                            </td>

                            <td className="px-6 py-4 text-right">
                                <button
                                    type="button"
                                    title="View analysis"
                                    aria-label={`View analysis for ${analysis.job_description?.title || "unknown role"}`}
                                    onClick={() => navigate(`/analysis/${analysis.id}`)}
                                    className="text-gray-500 dark:text-text-secondary hover:text-primary transition"
                                >
                                    <Eye size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
);
}
import { useState ,useEffect} from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import DashboadHeader from "../components/common/dashboard/DashboardHeader";
import StatCard from "../components/ui/StatCard";
import { FileText, BarChart3,Briefcase, Star } from "lucide-react";
import RecentAnalyses from "../components/common/dashboard/RecentAnalyses";
import UploadResume from "./UploadResume";
import api from "../services/api";

function Dashboard() {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [stats, setStats] = useState({
        resumesAnalyzed: 0,
        topSkills: 0,
        averageScore: 0,
        jobsMatched: 0,
    });

    useEffect(() => {
    async function fetchStats() {
                try {
                    const response = await api.get("/analyses/");
                    const analyses = response.data;

                    const scores = analyses.map(
                        (analysis) => Number(analysis.ats_score) || 0
                    );

                    const allSkills = analyses.flatMap(
                        (analysis) => analysis.matched_skills || []
                    );

                    const uniqueSkills = new Set(
                        allSkills.map((skill) =>
                            typeof skill === "string"
                                ? skill.toLowerCase()
                                : String(skill).toLowerCase()
                        )
                    );

                    setStats({
                        resumesAnalyzed: analyses.length,
                        topSkills: uniqueSkills.size,
                        averageScore: scores.length
                            ? Math.round(
                                scores.reduce((sum, score) => sum + score, 0) /
                                    scores.length
                            )
                            : 0,
                        jobsMatched: analyses.filter(
                            (analysis) => Number(analysis.ats_score) >= 70
                        ).length,
                    });
                } catch (error) {
                    console.error("Failed to fetch dashboard stats:", error);
                }
            }

            fetchStats();
        }, []);

    return (<div>
            <DashboardLayout>
                <DashboadHeader
                onUploadClick={() => setUploadOpen(true)}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <StatCard
                    title="Resumes Analyzed"
                    value={stats.resumesAnalyzed}
                    icon={FileText}/>

                <StatCard
                    title="Unique Matched Skills"
                    value={stats.topSkills}
                    icon={Star}
                />

                <StatCard
                    title="Average ATS Score"
                    value={`${stats.averageScore}%`}
                    icon={BarChart3}/>

                <StatCard
                    title="Jobs Matched"
                    value={stats.jobsMatched}
                    icon={Briefcase}/>
            </div>
            <div className="mt-8">
                <RecentAnalyses />
            </div>

            {uploadOpen&& (
                <UploadResume 
                onClose={()=>setUploadOpen(false)}
                />
            )}

            </DashboardLayout>
            
            </div>
    );
}

export default Dashboard;
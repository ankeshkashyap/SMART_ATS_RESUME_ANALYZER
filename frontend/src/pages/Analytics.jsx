import { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FileText, TrendingUp, Award, AlertCircle } from "lucide-react";

function getScoreBand(score) {
  if (score >= 80) return "Strong (80–100)";
  if (score >= 65) return "Fair (65–79)";
  return "Needs Improvement (<65)";
}

function getScoreBandColor(band) {
  if (band === "Strong (80–100)") return "#22C55E";
  if (band === "Fair (65–79)") return "#F59E0B";
  return "#EF4444";
}

export default function Analytics() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const response = await api.get("/analyses/");
        setAnalyses(response.data);
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
        setError(err.response?.data?.detail || "Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="mt-2 text-text-secondary">Loading analytics data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="mt-2 text-danger">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (analyses.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="mt-2 text-text-secondary">
            No analyses found. Analyze a resume to see your analytics here.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // --- Compute metrics ---
  const scores = analyses.map((a) => Number(a.ats_score) || 0);
  const coverages = analyses.map((a) => Number(a.coverage) || 0);
  const totalAnalyses = analyses.length;
  const avgScore = Math.round(scores.reduce((s, v) => s + v, 0) / totalAnalyses);
  const maxScore = Math.max(...scores);
  const avgCoverage = Math.round(
    coverages.reduce((s, v) => s + v, 0) / totalAnalyses
  );

  // --- Score distribution ---
  const distributionData = {};
  scores.forEach((s) => {
    const band = getScoreBand(s);
    distributionData[band] = (distributionData[band] || 0) + 1;
  });
  const scoreDistribution = Object.entries(distributionData).map(
    ([name, value]) => ({
      name,
      value,
      color: getScoreBandColor(name),
    })
  );

  // --- Breakdown averages ---
  const breakdownKeys = [
    "keyword_match",
    "skills",
    "experience",
    "education",
    "formatting",
    "grammar",
    "semantic_coverage",
  ];
  const breakdownLabels = {
    keyword_match: "Keyword Match",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    formatting: "Formatting",
    grammar: "Grammar",
    semantic_coverage: "Semantic Coverage",
  };
  const breakdownAverages = breakdownKeys.map((key) => {
    const values = analyses
      .map((a) => a.breakdown?.[key])
      .filter((v) => typeof v === "number");
    const avg =
      values.length > 0
        ? Math.round(values.reduce((s, v) => s + v, 0) / values.length)
        : 0;
    return { name: breakdownLabels[key], value: avg };
  });

  // --- Timeline data ---
  const sortedAnalyses = [...analyses].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const timelineData = sortedAnalyses.map((a) => ({
    date: new Date(a.created_at).toLocaleDateString(),
    ats_score: Number(a.ats_score) || 0,
    jobTitle: a.job_description?.title || "Unknown",
  }));

  // --- Recent activity ---
  const recentAnalyses = [...analyses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="mt-2 text-text-secondary">
          Track your resume analysis performance over time.
        </p>

        {/* Summary stat cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          <StatCard
            title="Total Analyses"
            value={totalAnalyses}
            icon={FileText}
          />
          <StatCard
            title="Average ATS Score"
            value={`${avgScore}%`}
            icon={Award}
          />
          <StatCard
            title="Highest ATS Score"
            value={`${maxScore}%`}
            icon={TrendingUp}
          />
          <StatCard
            title="Avg Keyword Coverage"
            value={`${avgCoverage}%`}
            icon={AlertCircle}
          />
        </div>

        {/* Charts row */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Score distribution pie chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">
              Score Distribution
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown bar chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">
              Average Score by Dimension
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff9900" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ATS score trend line chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-text-primary">
              ATS Score Over Time
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    content={({ payload, label }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="rounded border border-border bg-card p-2 text-xs shadow dark:border-slate-600">
                            <p className="font-semibold">{label}</p>
                            <p>
                              Score:{" "}
                              <span className="font-bold text-primary">
                                {payload[0].value}%
                              </span>
                            </p>
                            <p className="truncate">
                              Job: {payload[0].payload.jobTitle}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ats_score"
                    stroke="#ff9900"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent activity table */}
        <div className="mt-8 rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Activity
            </h2>
            <table className="mt-4 w-full text-text-primary">
              <thead className="bg-border dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Resume
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    ATS Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-border transition hover:bg-slate-700/50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {a.resume?.filename || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {a.job_description?.title || "Unknown role"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          (a.ats_score || 0) >= 80
                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : (a.ats_score || 0) >= 65
                            ? "bg-orange-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {a.ats_score ?? 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

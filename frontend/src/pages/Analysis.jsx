import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Analysis = () => {
    const { analysisID } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/analyses/${analysisID}`
                );

                setAnalysis(response.data);

            } catch (error) {
                console.error(
                    "Failed to fetch analysis:",
                    error
                );

                if (error.response?.data?.detail) {
                    setError(error.response.data.detail);
                } else {
                    setError("Failed to load analysis.");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [analysisID]);


    if (loading) {
        return (
            <div className="min-h-screen bg-background px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <p className="text-sm text-text-secondary">
                        Loading analysis...
                    </p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-background px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-card border border-danger/30 bg-danger/10 px-5 py-4 text-sm text-danger">
                        {error}
                    </div>
                </div>
            </div>
        );
    }


    if (!analysis) {
        return null;
    }


    const breakdown = analysis.breakdown || {};


    const getScoreStatus = (score) => {
        if (score >= 80) {
            return {
                label: "Strong",
                className: "text-success"
            };
        }

        if (score >= 60) {
            return {
                label: "Fair",
                className: "text-warning"
            };
        }

        return {
            label: "Needs Improvement",
            className: "text-danger"
        };
    };


    return (
        <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                            ATS Analysis
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                            Resume Analysis
                        </h1>

                        <p className="mt-2 text-sm text-text-secondary">
                            See how well your resume matches the selected job description.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/analyze")}
                        className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-text-primary shadow-sm transition hover:border-primary hover:text-primary"
                    >
                        New Analysis
                    </button>

                </div>


                {/* RESUME / JOB INFO */}

                <div className="mb-6 grid gap-4 md:grid-cols-2">

                    <div className="rounded-card border border-border bg-card p-5 shadow-sm">

                        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Resume
                        </p>

                        <p className="mt-2 text-sm font-bold text-text-primary">
                            {analysis.resume?.filename}
                        </p>

                    </div>


                    <div className="rounded-card border border-border bg-card p-5 shadow-sm">

                        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Job Description
                        </p>

                        <p className="mt-2 text-sm font-bold text-text-primary">
                            {analysis.job_description?.title}
                        </p>

                    </div>

                </div>


                {/* ATS SCORE */}

                <div className="mb-6 rounded-card border border-border bg-card p-6 shadow-sm">

                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                                Overall ATS Score
                            </p>

                            <div className="mt-2 flex items-baseline gap-2">

                                <span className="text-5xl font-bold text-text-primary">
                                    {analysis.ats_score}
                                </span>

                                <span className="text-lg font-medium text-text-secondary">
                                    /100
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-text-secondary">
                                Your resume compatibility with this job.
                            </p>
                        </div>


                        <div className="min-w-55">

                            <div className="mb-2 flex justify-between text-xs font-semibold">

                                <span className="text-text-secondary">
                                    Coverage
                                </span>

                                <span className="text-text-primary">
                                    {analysis.coverage}%
                                </span>

                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-border">

                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${analysis.coverage}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* SCORE BREAKDOWN */}

                <div className="mb-6 rounded-card border border-border bg-card p-6 shadow-sm">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-text-primary">
                            Score Breakdown
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            See which areas are helping or hurting your ATS score.
                        </p>
                    </div>


                    <div className="space-y-5">

                        {Object.entries(breakdown).map(
                            ([category, score]) => {

                                const status = getScoreStatus(score);

                                const label = category
                                    .replace("_", " ")
                                    .replace(/\b\w/g, char =>
                                        char.toUpperCase()
                                    );

                                return (
                                    <div key={category}>

                                        <div className="mb-2 flex items-center justify-between">

                                            <span className="text-sm font-semibold text-text-primary">
                                                {label}
                                            </span>

                                            <div className="flex items-center gap-3">

                                                <span
                                                    className={`text-xs font-bold ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>

                                                <span className="text-sm font-bold text-text-primary">
                                                    {score}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="h-2 overflow-hidden rounded-full bg-border">

                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{
                                                    width: `${score}%`
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* SKILLS */}

                <div className="mb-6 grid gap-6 md:grid-cols-2">

                    <div className="rounded-card border border-border bg-card p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-text-primary">
                            Matched Skills
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Skills from the job description found in your resume.
                        </p>


                        <div className="mt-5 flex flex-wrap gap-2">

                            {analysis.matched_skills?.length > 0 ? (

                                analysis.matched_skills.map(skill => (

                                    <span
                                        key={skill}
                                        className="rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success"
                                    >
                                        {skill}
                                    </span>

                                ))

                            ) : (

                                <p className="text-sm text-text-secondary">
                                    No matched skills found.
                                </p>

                            )}

                        </div>

                    </div>


                    <div className="rounded-card border border-border bg-card p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-text-primary">
                            Missing Skills
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Skills required by the job that are missing from your resume.
                        </p>


                        <div className="mt-5 flex flex-wrap gap-2">

                            {analysis.missing_skills?.length > 0 ? (

                                analysis.missing_skills.map(skill => (

                                    <span
                                        key={skill}
                                        className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger"
                                    >
                                        {skill}
                                    </span>

                                ))

                            ) : (

                                <p className="text-sm text-text-secondary">
                                    No missing skills detected.
                                </p>

                            )}

                        </div>

                    </div>

                </div>


                {/* KEYWORDS */}

                <div className="mb-6 grid gap-6 md:grid-cols-2">

                    <div className="rounded-card border border-border bg-card p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-text-primary">
                            Matched Keywords
                        </h2>

                        <div className="mt-5 flex flex-wrap gap-2">

                            {analysis.matched_keywords?.map(keyword => (

                                <span
                                    key={keyword}
                                    className="rounded-md bg-success/10 px-3 py-1.5 text-xs font-semibold text-success"
                                >
                                    {keyword}
                                </span>

                            ))}

                        </div>

                    </div>


                    <div className="rounded-card border border-border bg-card p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-text-primary">
                            Missing Keywords
                        </h2>

                        <div className="mt-5 flex flex-wrap gap-2">

                            {analysis.missing_keywords?.map(keyword => (

                                <span
                                    key={keyword}
                                    className="rounded-md bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning"
                                >
                                    {keyword}
                                </span>

                            ))}

                        </div>

                    </div>

                </div>


                {/* STRENGTHS / WEAKNESSES */}

                <div className="mb-6 grid gap-6 md:grid-cols-2">

                    <div className="rounded-card border border-border bg-card p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-text-primary">
                            Strengths
                        </h2>

                        <ul className="mt-5 space-y-3">

                            {analysis.strengths?.map(strength => (

                                <li
                                    key={strength}
                                    className="flex items-center gap-3 text-sm text-text-primary"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10 font-bold text-success">
                                        ✓
                                    </span>

                                    <span className="font-medium">
                                        {strength}
                                    </span>

                                </li>

                            ))}

                        </ul>

                    </div>


                    <div className="rounded-card border border-border bg-card p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-text-primary">
                            Areas to Improve
                        </h2>

                        <ul className="mt-5 space-y-3">

                            {analysis.weaknesses?.map(weakness => (

                                <li
                                    key={weakness}
                                    className="flex items-center gap-3 text-sm text-text-primary"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger/10 font-bold text-danger">
                                        !
                                    </span>

                                    <span className="font-medium">
                                        {weakness}
                                    </span>

                                </li>

                            ))}

                        </ul>

                    </div>

                </div>


                {/* RECOMMENDATION */}

                <div className="rounded-card border border-primary/30 bg-primary/5 p-6 shadow-sm">

                    <h2 className="text-xl font-bold text-text-primary">
                        Recommended Next Steps
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Focus on improving the categories with the lowest scores
                        and adding the missing keywords and skills that are relevant
                        to the position.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Analysis;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Analysis = () => {
    const { analysisID } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [aiSuggestions , setAiSuggestions] = useState(null);
    const [aiLoading , setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/analyses/${analysisID}`
                );

                setAnalysis(response.data);
                setAnalysis(response.data);

        setAiLoading(true);
        setAiError("");

        try {
            const aiResponse = await api.post(`/ai-suggestions/${analysisID}`);
            setAiSuggestions(aiResponse.data);
        } catch (aiError) {
            console.error("Failed to generate AI suggestions:", aiError);

            if (aiError.response?.data?.detail) {
                setAiError(aiError.response.data.detail);
            } else {
                setAiError("Failed to generate AI suggestions.");
            }
        } finally {
            setAiLoading(false);
        }

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
                setAiLoading(false)
            }
        };

        fetchAnalysis();
    }, [analysisID]);


    if (loading) {
    return (
        <div className="min-h-screen bg-background px-4 py-10">
            <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">

                <div className="relative h-[65px] w-[65px]">
                    <span className="absolute inset-0 rounded-[50px] shadow-[inset_0_0_0_3px] shadow-gray-800  animate-loaderAnim" />

                    <span className="absolute inset-0 rounded-[50px] shadow-[inset_0_0_0_3px] shadow-gray-800 animate-loaderAnim animation-delay" />
                </div>

                <style>{`
                    @keyframes loaderAnim {
                        0% {
                            inset: 0 35px 35px 0;
                        }
                        12.5% {
                            inset: 0 35px 0 0;
                        }
                        25% {
                            inset: 35px 35px 0 0;
                        }
                        37.5% {
                            inset: 35px 0 0 0;
                        }
                        50% {
                            inset: 35px 0 0 35px;
                        }
                        62.5% {
                            inset: 0 0 0 35px;
                        }
                        75% {
                            inset: 0 0 35px 35px;
                        }
                        87.5% {
                            inset: 0 0 35px 0;
                        }
                        100% {
                            inset: 0 35px 35px 0;
                        }
                    }

                    .animate-loaderAnim {
                        animation: loaderAnim 2.5s infinite;
                    }

                    .animation-delay {
                        animation-delay: -1.25s;
                    }
                `}</style>

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
                {/* AI SUGGESTIONS */}

        <div className="mb-6 rounded-card border border-primary/30 bg-card p-6 shadow-sm">

            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    AI-Powered Feedback
                </p>

                <h2 className="mt-1 text-2xl font-bold text-text-primary">
                    Resume Improvement Suggestions
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                    Personalized suggestions based on your resume and the selected job description.
                </p>
            </div>

            {aiLoading && (
                    <div className="rounded-lg border border-border bg-background p-5">

                    <p className="text-sm font-medium text-text-primary">
                        Generating AI-powered suggestions...
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                        This may take a few seconds.
                    </p>
                </div>
            )}

            {!aiLoading && aiError && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
                    <p className="text-sm font-semibold text-danger">
                        AI suggestions could not be generated.
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                        {aiError}
                    </p>
                </div>
            )}

        {!aiLoading && aiSuggestions && (
            <>

                {/* MISSING KEYWORDS */}
                {(aiSuggestions.missing_keywords?.length>0)?(
                <div className="mb-6">
                            <h3 className="text-lg font-bold text-text-primary">
                                Missing Keywords
                            </h3>

                    <div className="mt-4 space-y-3">
                        {aiSuggestions.missing_keywords?.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-border bg-background p-4"
                            >
                                <p className="font-semibold text-text-primary">
                                    {item.keyword}
                                </p>

                                <p className="mt-1 text-sm text-text-secondary">
                                    {item.reason}
                                </p>

                                <p className="mt-2 text-sm text-primary">
                                    <span className="font-semibold">Action:</span>{" "}
                                    {item.action}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>)
                :
                (
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm text-text-secondary">
                        No Missing keywords detected.
                    </p>
                </div>
        )
                    }
                {/* WEAK BULLETS */}

<div className="mb-6">
    <h3 className="text-lg font-bold text-text-primary">
        Weak Resume Bullets
    </h3>

    <div className="mt-4 space-y-4">
        {aiSuggestions.weak_bullets?.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-border bg-background p-4"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                Original
                            </p>

                            <p className="mt-1 text-sm text-text-primary">
                                {item.original}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-danger">
                                Problem
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                                {item.problem}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                Suggested Rewrite
                            </p>

                            <p className="mt-1 text-sm font-medium text-text-primary">
                                {item.suggestion}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* GRAMMAR SUGGESTIONS */}
        <div className="mt-4 space-y-3">
            <h3 className="text-lg font-bold text-text-primary">
                Grammar Suggestions
            </h3>
            {aiSuggestions.grammar_suggestions?.length > 0 ? (
                aiSuggestions.grammar_suggestions.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-border bg-background p-4"
                    >
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Original
                        </p>

                        <p className="mt-1 text-sm text-text-secondary">
                            {item.original}
                        </p>

                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                            Suggested Correction
                        </p>

                        <p className="mt-1 text-sm font-medium text-text-primary">
                            {item.suggestion}
                        </p>
                    </div>
                ))
            ) : (
                <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm text-text-secondary">
                        No grammar issues detected.
                    </p>
                </div>
            )}
        </div>
        {/* PROJECT IMPROVEMENTS */}

        <div className="mb-6">
            <h3 className="text-lg font-bold text-text-primary">
                Project Improvements
            </h3>

            <div className="mt-4 space-y-3">
                {aiSuggestions.project_improvements?.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-border bg-background p-4"
                    >
                        <p className="font-semibold text-text-primary">
                            {item.project}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            {item.suggestion}
                        </p>
                    </div>
                ))}
            </div>
        </div>
        {/* SUMMARY IMPROVEMENTS */}

        <div className="mb-6">
            <h3 className="text-lg font-bold text-text-primary">
                Summary Improvements
            </h3>

            <div className="mt-4 space-y-4">
                {aiSuggestions.summary_improvements?.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-border bg-background p-4"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                Current Summary
                            </p>

                            <p className="mt-1 text-sm leading-6 text-text-secondary">
                                {item.current}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                Suggested Summary
                            </p>

                            <p className="mt-1 text-sm font-medium leading-6 text-text-primary">
                                {item.suggestion}
                            </p>
                        </div>
                    </div>
                ))}
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
                </>
        )}
                </div>
                </div>
                </div>
    );
};

export default Analysis;
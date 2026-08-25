import { Section } from "lucide-react";
import React from "react";

const Analysis =() => {
    return (
        <div>
            <div className="analysis-page">
                <div className="analysis-header">
                    <h1>ATS Analysis</h1>
                    <p>Review how well your resume matches the selected job description.</p>
                </div>
            </div>

            <div className="analysis-content">
                <section className="analysis-score-section">
                    <h2> ATS SCORE</h2>
                </section>

                <section className="analysis-breakdown-section">
                    <h2> Score Breakdown</h2>
                </section>

                <section className="analysis-skills-section">
                    <h2>Skills Analysis</h2>
                </section>

                <section className="analysis-insights-section">
                    <h2>Strengths & Weaknesses</h2>    
                </section> 

            </div>


        </div>
        
    );

};

export default Analysis
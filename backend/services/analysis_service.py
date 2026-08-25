from sqlalchemy.orm import Session


from models.resume import Resume
from models.job_description import JobDescription
from models.analysis import Analysis

from services.ats_engine import run_ats_analysis
from services.nlp_service import NLPService

nlp_service = NLPService()

def create_analysis(
        db: Session,
        user_id: int,
        resume_id: int ,
        job_description_id: int,
):
    resume = (
        db.query (Resume)
        .filter (
            Resume.id == resume_id,
            Resume.user_id == user_id
        )
        .first()
    )

    if  not resume:
        return None, "Resume not found"


    job_description = (
        db.query(JobDescription)
        .filter(
            JobDescription.id == job_description_id,
            JobDescription.user_id == user_id
        )
        .first()
    )

    if not job_description:
        return None , "Job description not found"

    resume_nlp = nlp_service.extract (str(resume.resume_text or ""))

    jd_nlp = nlp_service.extract (str(job_description.description))

    required_skills = list (dict.fromkeys(
        jd_nlp.get ("skills", [])
        + jd_nlp.get ("programming_languages",[])
        + jd_nlp.get ("technologies", [])
    ))

    candidate_years = resume_nlp.get (
        "experience_years",
        0
    )
    required_years = jd_nlp.get(
        "experience_years",
        0
    )

    resume_degrees = resume_nlp.get (
        "degrees",
        []
    )

    jd_degrees = jd_nlp.get (
        "degrees",
        []
    )
    resume_education = " ".join (
        resume_degrees
    )
    required_education = " ".join (
        jd_degrees
    )

    resume_data = {
        "has_contact": False,
        "has_summary": bool (resume.summary),
        "has_skills": bool (resume.skills),
        "has_experience": bool (resume.experience),
        "has_education": bool (resume.education),
        "standard_headings" : True
    }

    grammar_issues = []

    jd_keywords = job_description.keywords or []

    result = run_ats_analysis(
        resume_text=resume.resume_text or "",
        jd_keywords=jd_keywords,
        required_skills=required_skills,
        candidate_years=candidate_years,
        required_years=required_years,
        resume_education=resume_education,
        required_education=required_education,
        resume_data=resume_data,
        grammar_issues=grammar_issues,
        job_description=job_description.description or ""
    )

    breakdown = result["breakdown"]

    strengths = []
    weaknesses = []

    for category, score in breakdown.items():

        if score >= 80:
            strengths.append(category)

        elif score < 60:
            weaknesses.append(category)


    analysis = Analysis(
        user_id=user_id,

        resume_id=resume_id,

        job_description_id=job_description_id,

        ats_score=result["ats_score"],

        coverage=result["coverage"],

        breakdown=result["breakdown"],

        matched_keywords=result["matched_keywords"],

        missing_keywords=result["missing_keywords"],

        matched_skills=result["matched_skills"],

        missing_skills=result["missing_skills"],

        strengths=strengths,

        weaknesses=weaknesses
    )

    db.add(analysis)

    db.commit()

    db.refresh(analysis)

    return analysis, None
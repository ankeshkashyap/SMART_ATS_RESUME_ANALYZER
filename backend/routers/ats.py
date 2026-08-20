from fastapi import APIRouter

from services.ats_engine import run_ats_analysis

from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/ats",
    tags=["ATS"]
)

class ATSRequest(BaseModel):
    resume_text:str

    job_description: str

    jd_keywords: List[str]

    required_skills: List[str]

    candidate_years: float

    required_years: float

    resume_education: str

    required_education: str

    resume_data: dict

    grammar_issues: List[str]

@router.post("/score")
def calculate_ats (request: ATSRequest):
    result = run_ats_analysis(
        resume_text=request.resume_text,
        jd_keywords=request.jd_keywords,
        required_skills=request.required_skills,
        candidate_years=request.candidate_years,
        required_years=request.required_years,
        resume_education=request.resume_education,
        required_education=request.required_education,
        resume_data=request.resume_data,
        grammar_issues=request.grammar_issues,
        job_description=request.job_description
    )

    return result
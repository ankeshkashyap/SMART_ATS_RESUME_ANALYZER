from pydantic import BaseModel
from typing import Any

class AnalysisCreate(BaseModel):
    resume_id:int
    job_description_id:int

class ResumeInfo(BaseModel):
    id: int
    filename: str

class JobDescriptionInfo(BaseModel):
    id: int
    title: str


class AnalysisResponse(BaseModel):
    id :int 
    user_id:int
    resume_id: int
    job_description_id: int

    resume: ResumeInfo
    job_description: JobDescriptionInfo
    
    ats_score:int
    coverage: int | None

    breakdown: dict[str, Any] | None

    matched_keywords: list[str] | None
    missing_keywords: list[str] | None

    matched_skills: list[str] | None
    missing_skills: list[str] | None

    strengths: list[str] | None
    weaknesses: list[str] | None
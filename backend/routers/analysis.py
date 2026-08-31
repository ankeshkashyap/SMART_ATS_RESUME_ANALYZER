from fastapi import APIRouter, Depends , HTTPException
from sqlalchemy.orm import Session
from typing import cast

from database.sessions import get_db
from routers.auth import get_current_user

from models.users import User
from models.analysis import Analysis

from schemas.analysis import AnalysisCreate, AnalysisResponse

from services.analysis_service import create_analysis

router = APIRouter(
    prefix= "/analyses",
    tags=["Analysis"]
    )

@router.post("/", response_model=AnalysisResponse)
def create_new_analysis (
    request: AnalysisCreate,
    db: Session = Depends (get_db),
    current_user: User = Depends (get_current_user)
    ):
    analysis, error = create_analysis(
        db=db,
        user_id=cast(int, current_user.id),
        resume_id=request.resume_id,
        job_description_id= request.job_description_id
    )

    if error or analysis is None:
        raise HTTPException(
            status_code=404,
            detail=error or "Failed to create analysis"
        )

    return {
    "id": analysis.id,
    "user_id": analysis.user_id,

    "resume_id": analysis.resume_id,
    "job_description_id": analysis.job_description_id,

    "resume": {
        "id": analysis.resume.id,
        "filename": analysis.resume.original_filename
    },

    "job_description": {
        "id": analysis.job_description.id,
        "title": analysis.job_description.title
    },

    "ats_score": analysis.ats_score,
    "coverage": analysis.coverage,

    "breakdown": analysis.breakdown,

    "matched_keywords": analysis.matched_keywords,
    "missing_keywords": analysis.missing_keywords,

    "matched_skills": analysis.matched_skills,
    "missing_skills": analysis.missing_skills,

    "strengths": analysis.strengths,
    "weaknesses": analysis.weaknesses
}

@router.get("/{analysis_id}",response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int,
    db: Session = Depends (get_db),
    current_user: User = Depends (get_current_user)
):

    analysis = (
        db.query (Analysis)
        .filter (
            Analysis.id == analysis_id,
            Analysis.user_id== current_user.id
        )
        .first()
    )


    if not analysis :
        raise HTTPException (
            status_code= 404,
            detail = "Analysis not found"
        )

    return {
         "id": analysis.id,
    "user_id": analysis.user_id,

    "resume_id": analysis.resume_id,
    "job_description_id": analysis.job_description_id,

    "resume": {
        "id": analysis.resume.id,
        "filename": analysis.resume.original_filename
    },

    "job_description": {
        "id": analysis.job_description.id,
        "title": analysis.job_description.title
    },

    "ats_score": analysis.ats_score,
    "coverage": analysis.coverage,

    "breakdown": analysis.breakdown,

    "matched_keywords": analysis.matched_keywords,
    "missing_keywords": analysis.missing_keywords,

    "matched_skills": analysis.matched_skills,
    "missing_skills": analysis.missing_skills,

    "strengths": analysis.strengths,
    "weaknesses": analysis.weaknesses
    }
    

from fastapi import APIRouter, Depends , HTTPException
from sqlalchemy.orm import Session

from database.sessions import get_db
from routers.auth import get_current_user

from models.users import User
from models.analysis import Analysis

from schemas.ai_suggestions import AISuggestions
from services.ai_suggestions import generate_ai_suggestions

router = APIRouter (
    prefix="/ai-suggestions",
    tags=["AI Suggestions"]
)

@router.post ("/{analysis_id}", response_model=AISuggestions)
def generate_suggestions(
    analysis_id:int,
    db: Session=Depends(get_db),
    current_user: User = Depends(get_current_user)):

    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id
        )
        .first()
    )

    if not analysis :
        raise HTTPException (
            status_code = 404,
            detail="Analysis not found"
        )

    resume_text = analysis.resume.resume_text
    job_description = analysis.job_description.description

    if not resume_text:
        raise HTTPException(
            status_code=404,
            detail="Resume text is not available"
        )
    if not job_description:
            raise HTTPException(
                status_code=404,
                detail="job description is not available"
            )
    suggestions = generate_ai_suggestions(
        resume_text=resume_text,
        job_description=job_description,
        ats_score=analysis.ats_score,
        breakdown=analysis.breakdown,
        missing_keywords=analysis.missing_keywords,
        matched_keywords=analysis.matched_keywords,
        matched_skills=analysis.matched_skills,
        missing_skills=analysis.missing_skills,
        strengths=analysis.strengths,
        weaknesses=analysis.weaknesses
    )

    return suggestions
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

    if error :
        raise HTTPException(
            status_code=404,
            detail=error
        )
    return analysis

@router.get("/{analysis_id}",response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int,
    db: Session = Depends (get_db),
    current_user: User = Depends (get_current_user)
):

    print("CURRENT USER:", current_user)
    print("CURRENT USER ID:", current_user.id)
    print("ANALYSIS ID:", analysis_id)


    analysis = (
        db.query (Analysis)
        .filter (
            Analysis.id == analysis_id,
            Analysis.user_id== current_user.id
        )
        .first()
    )

    print("FOUND ANALYSIS:", analysis)

    if not analysis :
        raise HTTPException (
            status_code= 404,
            detail = "Analysis not found"
        )

    return analysis
    

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.sessions import get_db
from routers.auth import get_current_user

from models.users import User
from models.job_description import JobDescription

from schemas.jd import JobDescriptionCreate

from services.jd_service import normalize_jd, extract_keywords

router = APIRouter (
    prefix= "/job-descriptions",
    tags=["job descriptions"]
)

@router.post("/")
def create_job_description(
    jd: JobDescriptionCreate,
    db: Session = Depends (get_db),
    current_user : User= Depends(get_current_user)):

    normalized_text = normalize_jd(jd.description)
    keywords = extract_keywords(normalized_text)

    job_description = JobDescription(
        user_id = current_user.id,
        title=jd.title,
        description = jd.description ,
        normalized_text = normalized_text,
        keywords=keywords
    )

    db.add(job_description)
    db.commit()
    db.refresh(job_description)

    return{
        "id":job_description.id,
        "title":job_description.title,
        "description": job_description.description,
        "normalized_text": job_description.normalized_text,
        "keywords": job_description.keywords,
        "created_at":job_description.created_at
    }

@router.get("/")
def get_job_descriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_descriptions = (
        db.query(JobDescription)
        .filter(JobDescription.user_id == current_user.id)
        .order_by(JobDescription.created_at.desc())
        .all()
    )

    return job_descriptions

@router.get("/{jd_id}")
def get_job_description(
    jd_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_description = (
        db.query(JobDescription)
        .filter(
            JobDescription.id == jd_id,
            JobDescription.user_id == current_user.id
        )
        .first()
    )

    if not job_description:
        raise HTTPException(
            status_code=404,
            detail="Job description not found"
        )

    return job_description


@router.delete("/{jd_id}")
def delete_job_description(
    jd_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_description = (
        db.query(JobDescription)
        .filter(
            JobDescription.id == jd_id,
            JobDescription.user_id == current_user.id
        )
        .first()
    )

    if not job_description:
        raise HTTPException(
            status_code=404,
            detail="Job description not found"
        )

    db.delete(job_description)
    db.commit()

    return {
        "message": "Job description deleted successfully"
    }
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile , File,HTTPException ,Depends
from sqlalchemy.orm import Session

from database.sessions import get_db
from routers.auth import get_current_user
from models.users import User
from models.resume import Resume

from parsers.resume_parser import parse_resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)
ALLOWED_EXTENSIONS = {".pdf",".docx"}
MAX_FILE_SIZE = 10*1024*1024
UPLOAD_DIR =Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
@router.post("/upload")


async def upload_resume(file: UploadFile= File(...),
                        db: Session = Depends(get_db),
                        current_user: User= Depends(get_current_user)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing."
        )
    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed"
        )

    contents= await file.read()
    if len(contents)> MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 10 MB"
        )

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path= UPLOAD_DIR / unique_filename
    with open(file_path,"wb") as buffer :
        buffer.write(contents)

    file_type = extension.replace(".","")
    parsed_resume = parse_resume(str(file_path),file_type)

    resume = Resume (
        user_id = current_user.id,
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_type=extension,
        file_size=len(contents),

        resume_text=parsed_resume["text"],
        summary=parsed_resume["sections"]["summary"],
        skills=parsed_resume["sections"]["skills"],
        projects=parsed_resume["sections"]["projects"],
        experience=parsed_resume["sections"]["experience"],
        education=parsed_resume["sections"]["education"],
        achievements=parsed_resume["sections"]["achievements"]

    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
        
    return {
        "id":resume.id,
        "filename": resume.original_filename,
        "stored_filename": resume.stored_filename,
        "content_type":file.content_type,
        "size":resume.file_size,
        "user_id":resume.user_id,

        "parsed_resume":{
            "text":resume.resume_text,
            "sections": {
                "summary": resume.summary,
                "skills": resume.skills,
                "projects": resume.projects,
                "experience": resume.experience,
                "education": resume.education,
                "achievements": resume.achievements
            }
        }
    }
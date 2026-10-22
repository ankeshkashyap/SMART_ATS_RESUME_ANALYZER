from services.storage_service import upload_file , delete_resume as delete_stored_resume            
import tempfile
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile , File,HTTPException ,Depends
from sqlalchemy.orm import Session

from database.sessions import get_db
from routers.auth import get_current_user
from models.users import User
from models.resume import Resume
import hashlib
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

    file_hash = hashlib.sha256(contents).hexdigest()

    existing_resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id,
            Resume.file_hash == file_hash,
        )
        .first()
    )

    if existing_resume :
            return {
            "id": existing_resume.id,
            "filename": file.filename,
            "stored_filename": existing_resume.stored_filename,
            "content_type": file.content_type,
            "size": existing_resume.file_size,
            "user_id": existing_resume.user_id,
            "duplicate": True,
            "message": "This resume has already been uploaded.",
            "parsed_resume": {
                "text": existing_resume.resume_text,
                "sections": {
                    "summary": existing_resume.summary,
                    "skills": existing_resume.skills,
                    "projects": existing_resume.projects,
                    "experience": existing_resume.experience,
                    "education": existing_resume.education,
                    "achievements": existing_resume.achievements,
                },
            },
        }

         

    
    unique_filename = f"{uuid.uuid4()}_{Path(file.filename).name}"

    content_type = (
        file.content_type
        or (
            "application/pdf"
            if extension == ".pdf"
            else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    )

    stored_filename = upload_file(
        unique_filename,
        contents,
        content_type,
    )

    file_type = extension.replace(".", "")

    try:
        with tempfile.NamedTemporaryFile(
            suffix=extension,
            delete=False,
        ) as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        parsed_resume = parse_resume(temp_path, file_type)
    finally:
        if "temp_path" in locals() and Path(temp_path).exists():
            Path(temp_path).unlink()


    resume = Resume (
        user_id = current_user.id,
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_hash=file_hash,
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
        "duplicate": False,
        "message": "Resume uploaded successfully.",
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

@router.get("/")
def get_resumes(
        db:Session = Depends(get_db),
        current_user :User = Depends (get_current_user)):
        resumes=(
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .order_by(Resume.uploaded_at.desc())
        .all()
)
        return[
        {
            "id":resume.id,
            "filename": resume.original_filename,
            "file_type":resume.file_type,
            "file_size":resume.file_size,
            "uploaded_at":resume.uploaded_at
        }
        for resume in resumes
    ]

@router.get("/{resume_id}")
def get_resume (
          resume_id:int,
          db: Session = Depends(get_db),
          current_user : User = Depends(get_current_user)
):
     resume = (
     db.query(Resume)
     .filter(
          Resume.id == resume_id,
          Resume.user_id == current_user.id
     )
     .first()
     )
     if not resume :
          raise HTTPException(
               status_code = 404,
               detail="Resume not Found"
          )

     return {
        "id": resume.id,
        "filename": resume.original_filename,
        "file_type": resume.file_type,
        "file_size": resume.file_size,
        "uploaded_at": resume.uploaded_at,
        "parsed_resume": {
            "text": resume.resume_text,
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


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not Found",
        )

    try:
        delete_stored_resume(resume.stored_filename) # type: ignore

        db.delete(resume)
        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete resume",
        )

    return {
        "message": "Resume deleted successfully"
    }

from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from routers import  auth,resume,jd,nlp,ats,analysis ,ai_suggestions
from fastapi.exceptions import RequestValidationError
from exception.validation import validation_exception_handler

from database.database import engine
from database.base import Base

from models import users
from models import resume as resume_model
from models import job_description as job_description_model
from models import analysis as analysis_model

Base.metadata.create_all(bind=engine)
app= FastAPI(
    title="Smart Resume ATS Analyzer API"
)
app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler #type:ignore
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(nlp.router)
app.include_router(ats.router)
app.include_router(analysis.router)
app.include_router(ai_suggestions.router)

@app.get("/")
def home():
    return{
        "message":"Smart Resume ATS Analyzer API"
        }


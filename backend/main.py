from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from routers import  auth,resume
from fastapi.exceptions import RequestValidationError
from exception.validation import validation_exception_handler

from database.database import engine
from database.base import Base

from models import users
from models import resume as resume_model

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

@app.get("/")
def home():
    return{
        "message":"Smart Resume ATS Analyzer API"
    }


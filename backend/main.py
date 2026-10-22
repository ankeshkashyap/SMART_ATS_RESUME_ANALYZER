from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth, resume, jd, nlp, ats, analysis, ai_suggestions
from fastapi.exceptions import RequestValidationError
from exception.validation import validation_exception_handler

from sqlalchemy import text

from database.database import engine
from database.base import Base
from database.sessions import SessionLocal

from models import users
from models import resume as resume_model
from models import job_description as job_description_model
from models import analysis as analysis_model

import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Resume ATS Analyzer API"
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler  # type:ignore
)

# CORS: comma-separated list from CORS_ORIGINS env var.
# Defaults to localhost for development. Production MUST set CORS_ORIGINS
# to the Vercel domain — never use "*" with allow_credentials=True.
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins.split(",") if o.strip()],
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
    return {
        "message": "Smart Resume ATS Analyzer API"
    }


@app.get("/health")
def health():
    """Read-only health check. Verifies DB connectivity without destructive changes."""
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "database": "unreachable", "detail": str(e)},
        )


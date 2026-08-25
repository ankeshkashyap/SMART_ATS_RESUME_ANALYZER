from sqlalchemy import Column , Integer , TIMESTAMP , ForeignKey , text ,  JSON
from database.base import Base

class Analysis (Base):
    __tablename__ =  "analyses"

    id = Column (
        Integer,
        primary_key=True,
        index=True
    )

    user_id= Column (
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index= True
    )

    resume_id = Column (
        Integer,
        ForeignKey("resumes.id"),
        nullable= False,
        index=True
    )

    job_description_id = Column (
        Integer,
        ForeignKey("job_descriptions.id"),
        nullable= False,
        index = True
    )


    matched_skills = Column(
    JSON,
    nullable=True
    )

    missing_skills = Column(
        JSON,
        nullable=True
    )

    ats_score = Column(
        Integer,
        nullable=False
    )

    coverage = Column (
        Integer,
        nullable= True
    )

    breakdown = Column (
        JSON,
        nullable = True
    )

    matched_keywords = Column (
        JSON ,
        nullable=True
    )
    
    missing_keywords = Column (
        JSON ,
        nullable=True
    )

    strengths = Column (
        JSON ,
        nullable=True
    )

    weaknesses = Column (
        JSON ,
        nullable=True
    )
from sqlalchemy import Column, Integer,String,Text , TIMESTAMP, ForeignKey, text
from database.base import Base

class Resume(Base):
    __tablename__="resumes"

    id= Column(
        Integer,
        primary_key=True,
        index=True
    )
    user_id = Column (
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    original_filename = Column (
        String(255),
        nullable = False
    )
    stored_filename= Column(
        String(255),
        unique=True,
        nullable=False
    )
    file_type = Column (
        String(20),
        nullable=False
    )
    file_size= Column(
        Integer,
        nullable=False
    )
    resume_text= Column(Text,
                        nullable=True)

    summary= Column(Text,
                    nullable=True)

    skills=Column(
        Text,
        nullable=True
    )

    projects = Column(
        Text,
        nullable=True
    )
    experience= Column (
        Text,
        nullable=True
    )
    education = Column(
        Text,
        nullable=True
    )
    achievements = Column (
        Text,
        nullable=True
    )
    uploaded_at=Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )
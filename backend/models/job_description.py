from sqlalchemy import Column , Integer , String , Text , TIMESTAMP , ForeignKey, text, JSON
from database.base import Base

class JobDescription (Base):
    __tablename__ = "job_descriptions"

    id = Column (
        Integer,
        primary_key = True,
        index=True
    )

    user_id = Column (
        Integer,
        ForeignKey("users.id"),
        nullable= False,
        index = True
    )
    title = Column(
        String (255),
        nullable=False
    )
    description = Column (
        Text,
        nullable=True
    )
    normalized_text = Column (
        Text,
        nullable= True 
    )
    keywords =  Column (
        JSON,
        nullable= True
    )
    created_at = Column (
        TIMESTAMP,
        server_default=text ("CURRENT_TIMESTAMP")
    )
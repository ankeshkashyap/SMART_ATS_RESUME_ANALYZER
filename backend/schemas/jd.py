from pydantic import BaseModel, Field


class JobDescriptionCreate(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=255
    )
    description: str = Field(
        min_length=50,
        max_length=10000
    )


class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    description: str
    normalized_text: str | None
    keywords: list[str] | None
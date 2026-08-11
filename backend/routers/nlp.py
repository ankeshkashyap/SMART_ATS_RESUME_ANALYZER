from fastapi import APIRouter
from pydantic import BaseModel

from services.nlp_service import NLPService

router = APIRouter(
    prefix="/nlp",
    tags=["NLP"]
)

nlp_service = NLPService()

class NLPRequest(BaseModel):
    text:str

@router.post("/analyze")
def analyze_text(request: NLPRequest):

    result = nlp_service.extract(request.text)

    return result
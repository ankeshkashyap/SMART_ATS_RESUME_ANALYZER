from pydantic import BaseModel

class MissingKeywords(BaseModel):
    keyword: str
    reason:str 
    action :str

class WeakBullets (BaseModel):
    original: str
    problem: str
    suggestion: str

class GrammarSuggestion (BaseModel):
    original :str
    suggestion : str

class ProjectImprovement(BaseModel):
    project:str
    suggestion:str

class SummaryImprovement(BaseModel):
    current: str
    suggestion: str

class AISuggestions(BaseModel):
    missing_keywords: list[MissingKeywords]
    weak_bullets: list[WeakBullets]
    grammar_suggestions: list[GrammarSuggestion]
    project_improvements : list[ProjectImprovement]
    summary_improvements : list [SummaryImprovement]



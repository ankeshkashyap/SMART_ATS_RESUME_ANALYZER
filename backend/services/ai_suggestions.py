import os
from dotenv import load_dotenv
from google import genai
from schemas.ai_suggestions import AISuggestions

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
def generate_ai_suggestions(
        resume_text,
        job_description,
        ats_score,
        breakdown,
        missing_keywords,
        matched_keywords,
        matched_skills,
        missing_skills,
        strengths,
        weaknesses,
):
    prompt =f"""
    You are an expert resume and ATS optimization assistant.

Analyze the candidate's resume specifically against the provided
job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

ATS SCORE:
{ats_score}

ATS BREAKDOWN:
{breakdown}

MATCHED KEYWORDS:
{matched_keywords}

MISSING KEYWORDS:
{missing_keywords}

MATCHED SKILLS:
{matched_skills}

MISSING SKILLS:
{missing_skills}

STRENGTHS:
{strengths}

WEAKNESSES:
{weaknesses}

IMPORTANT RULES:

1. Never invent skills, experience, certifications, achievements,
   or technologies that are not supported by the resume.

2. Never tell the candidate to claim a skill they do not actually
   demonstrate.

3. If a keyword is missing, clearly explain that it is missing.

4. Suggestions must be specific to this job description.

5. Improve the presentation of existing experience rather than
   fabricating new experience.

6. For resume bullet improvements, preserve the factual meaning
   of the original bullet.

7. Return useful suggestions only. If a category has no meaningful
   suggestion, return an empty list.

Analyze the resume and return suggestions for:
- Missing keywords
- Weak resume bullets
 - Grammar: Carefully inspect the resume for genuine grammar,
  punctuation, sentence structure, verb tense, subject-verb agreement,
  articles, prepositions, sentence fragments, and parallel structure.
  Return specific corrections when issues exist. Do not return an
  empty list if a genuine grammar or sentence-structure issue is present.
- Project improvements
- Summary improvements"""
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type":"application/json",
            "response_schema":AISuggestions,
        },
    )
    return response.parsed
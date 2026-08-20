from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

WEIGHTS={
    "keyword_match":0.25,
    "skills":0.25,
    "experience":0.15,
    "education":0.10,
    "formatting":0.10,
    "grammar":0.05,
    "similarity":0.10
}

def keyword_match(resume_text, jd_keywords):
    resume_text = resume_text.lower()

    matched_keywords = []
    missing_keywords = []

    for keyword in jd_keywords :
        keyword = keyword.lower().strip()

        if keyword in resume_text :
            matched_keywords.append(keyword)

        else:
            missing_keywords.append (keyword)

    total_keywords = len(jd_keywords)

    if total_keywords ==0:
        score= 0 

    else:
        score = (len(matched_keywords)/ total_keywords)*100

    return {
        "score": round(score),
        "matched_keywords": matched_keywords,
        "missing_keywords" : missing_keywords
    }


def skills_match(resume_text, required_skills):
    resume_text = resume_text.lower()

    matched_skills = []
    missing_skils= []
    for skill in required_skills :
        skill = skill.lower().strip()

        if skill in resume_text:
            matched_skills.append (skill)
        else:
            missing_skils.append(skill)

    total_skills = len(required_skills)

    if total_skills ==0:
        score =0

    else : 
        score = (len(matched_skills)/total_skills)*100

    return{
        "score": round(score),
        "matched_skills": matched_skills,
        "missing_skills":missing_skils
    }

def experience_score (candidate_years, required_years):
    if required_years <= 0:
        return 100

    if candidate_years >= required_years:
        return 100

    score= (candidate_years / required_years)*100

    return round(score)

def education_score (resume_education, required_education):
    resume_education=resume_education.lower().strip()
    required_education=required_education.lower().strip()

    if not required_education:
        return 100

    if required_education in resume_education:
        return 100

    related_feilds = {
        "computer science":[
            "information technology",
            "software engineering",
            "computer engineering"
        ],
        "information technology":[
            "computer science",
            "software engineering"
        ]
    }

    for field , related in related_feilds.items():
        if field in required_education:
            for related_field in related:
                if related_field in resume_education:
                    return 75

    if "bachelor" in required_education:

        if "b.tech" in resume_education or "bachelor" in resume_education:
            return 50

    return 0


def formatting_score(resume_data):

    checks = {
        "has_contact":resume_data.get("has_contact",False),
        "has_summary": resume_data.get("has_summary",False),
        "has_skills":resume_data.get("has_skills",False),
        "has_experience":resume_data.get("has_experience",False),
        "has_education":resume_data.get ("has_education",False),
        "standard_headings": resume_data.get("standard_headings",False)
    }

    passed_checks = sum(checks.values())
    total_checks = len(checks)

    if total_checks ==0:
        return 0

    score = (passed_checks/ total_checks)*100
    return round(score)


def grammar_score(grammar_issues):
    penalty_per_issue = 5
    score = 100 - (len(grammar_issues)* penalty_per_issue)
    return max(0, score)

def similarity_score(resume_text : str , job_description: str) -> int:

    if not resume_text.strip() or not job_description.strip():
        return 0 

    documents = [
        resume_text,
        job_description
    ]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1,2)
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(documents)

    except ValueError:
        return 0

    similarity = cosine_similarity (
        tfidf_matrix.getrow(0),
        tfidf_matrix.getrow(1)
    )[0][0]

    score = similarity*100
    return round(score)

def calculate_final_score(scores):
    final_score=0
    for category,weight in WEIGHTS.items():
        score= scores.get(category, 0)
        final_score += score*weight

    return round(final_score)

def calculate_coverage(keyword_score, skills_score):

    coverage = (
        keyword_score * 0.5 +
        skills_score * 0.5
    )

    return round(coverage)

def calculate_ats_score(scores):

    final_score = calculate_final_score(scores)

    coverage = calculate_coverage(
        scores.get("keyword_match", 0),
        scores.get("skills", 0)
    )

    return{
        "ats_score":final_score,
        "coverage": coverage,
        "breakdown":scores
    }


def run_ats_analysis(
    resume_text,
    jd_keywords,
    required_skills,
    candidate_years,
    required_years,
    resume_education,
    required_education,
    resume_data,
    grammar_issues,
    job_description
):
    
    keyword_result = keyword_match(
        resume_text,
        jd_keywords
    )

    
    skills_result = skills_match(
        resume_text,
        required_skills
    )

   
    experience = experience_score(
        candidate_years,
        required_years
    )

    
    education = education_score(
        resume_education,
        required_education
    )

   
    formatting = formatting_score(
        resume_data
    )

    
    grammar = grammar_score(
        grammar_issues
    )

    
    similarity = similarity_score(
        resume_text,
        job_description
    )

 
    scores = {
        "keyword_match": keyword_result["score"],
        "skills": skills_result["score"],
        "experience": experience,
        "education": education,
        "formatting": formatting,
        "grammar": grammar,
        "similarity": similarity
    }


    final_score = calculate_final_score(scores)

    
    coverage = calculate_coverage(
        keyword_result["score"],
        skills_result["score"]
    )

    return {
        "ats_score": final_score,
        "coverage": coverage,
        "breakdown": scores,
        "matched_keywords": keyword_result["matched_keywords"],
        "missing_keywords": keyword_result["missing_keywords"],
        "matched_skills": skills_result["matched_skills"],
        "missing_skills": skills_result["missing_skills"]
    }




if __name__ == "__main__":

    resume_text = """
    Computer Science student with experience in Python,
    FastAPI, React, PostgreSQL and Git.
    Built REST APIs and machine learning applications.
    """

    job_description = """
    We are looking for a software developer with experience
    in Python, FastAPI, PostgreSQL, Docker and AWS.
    Experience with machine learning is preferred.
    """

    jd_keywords = [
        "Python",
        "FastAPI",
        "React",
        "PostgreSQL",
        "Docker",
        "AWS",
        "Git"
    ]

    required_skills = [
        "Python",
        "FastAPI",
        "React",
        "PostgreSQL",
        "Docker",
        "AWS"
    ]

    resume_data = {
        "has_contact": True,
        "has_summary": True,
        "has_skills": True,
        "has_experience": True,
        "has_education": True,
        "standard_headings": True
    }

    grammar_issues = [
        "Missing punctuation",
        "Sentence fragment"
    ]

    result = run_ats_analysis(
        resume_text=resume_text,
        jd_keywords=jd_keywords,
        required_skills=required_skills,
        candidate_years=1,
        required_years=2,
        resume_education="B.Tech in Computer Science",
        required_education="Computer Science",
        resume_data=resume_data,
        grammar_issues=grammar_issues,
        job_description=job_description
    )

    print(result)
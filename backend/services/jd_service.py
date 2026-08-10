import re

def normalize_jd (text:str) -> str :

    text=text.lower()

    text=re.sub(r"\s+"," ",text) 

    text = re.sub (r"[^\w\s+#.-]"," " ,text)

    text= text.strip()

    return text


TECH_KEYWORDS = {
    "python",
    "java",
    "c",
    "c++",
    "c#",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "fastapi",
    "django",
    "flask",
    "spring",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "github",
    "machine learning",
    "deep learning",
    "nlp",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "rest api",
    "graphql",
    "spring boot"
}

def extract_keywords(text: str) -> list [str]:
    keywords = []
    for keyword in TECH_KEYWORDS:

            pattern = rf"\b{re.escape(keyword)}\b"

            if re.search(pattern, text):
                keywords.append(keyword)

    return keywords



text = """
We are looking for a Python developer.
Experience with FastAPI, PostgreSQL and Docker is required.
Knowledge of AWS and Git is preferred.
"""

normalized = normalize_jd(text)

print("Normalized:")
print(normalized)

print("\nKeywords:")
print(extract_keywords(normalized))
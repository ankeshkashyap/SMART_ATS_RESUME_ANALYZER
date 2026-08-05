from parsers.pdf_parser import extract_pdf_text
from parsers.docx_parser import extract_docx_text
from utils.text_cleaner import clean_text

SECTION_KEYWORDS = {
    "summary": [
        "summary",
        "profile",
        "objective"
    ],

    "skills": [
        "skills",
        "technical skills"
    ],

    "projects": [
        "projects",
        "project experience"
    ],

    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "internship"
    ],

    "education": [
        "education",
        "academic background"
    ],
    "achievements": [
    "achievements",
    "awards",
    "accomplishments"
]
}

def extract_sections(text):
    sections={
        "summary":"",
        "skills":"",
        "projects":"",
        "experience":"",
        "education":"",
        "achievements":""
    }

    current_section = None

    lines = text.split("\n")

    for line in lines:
        line= line.strip()

        if not line:
            continue

        line_lower = line.lower()

        found_section=None

        for section, keywords in SECTION_KEYWORDS.items():
            if line_lower in keywords:
                found_section = section
                break

        if found_section:
            current_section= found_section
            continue

        if current_section:
            if sections[current_section]:
                sections[current_section]+="\n"

            sections[current_section]+= line

    return sections

def parse_resume (file_path, file_type):
    if file_type=="pdf":
        raw_text=extract_pdf_text(file_path)

    elif file_type=="docx":
        raw_text=extract_docx_text(file_path)

    else:
        raise ValueError("Unsupported file type")

    cleaned_text = clean_text(raw_text)

    sections = extract_sections(cleaned_text)

    return{
        "text":cleaned_text,
        "sections":sections
    }
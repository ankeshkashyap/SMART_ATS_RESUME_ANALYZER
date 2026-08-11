import spacy
from spacy.matcher import PhraseMatcher
import re

class NLPService:

    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

        self.programming_languages = {
            "python": "Python",
            "python3": "Python",
            "java": "Java",
            "javascript": "JavaScript",
            "js": "JavaScript",
            "typescript": "TypeScript",
            "ts": "TypeScript",
            "c": "C",
            "c++": "C++",
            "c#": "C#",
            "go": "Go",
            "golang": "Go",
            "rust": "Rust",
        }

        self.technologies = {
            "react": "React",
            "reactjs": "React",
            "react.js": "React",
            "angular": "Angular",
            "vue": "Vue",
            "node": "Node.js",
            "nodejs": "Node.js",
            "express": "Express.js",
            "fastapi": "FastAPI",
            "django": "Django",
            "flask": "Flask",
            "spring": "Spring",
            "spring boot": "Spring Boot",
            "postgresql": "PostgreSQL",
            "postgres": "PostgreSQL",
            "mysql": "MySQL",
            "mongodb": "MongoDB",
            "docker": "Docker",
            "kubernetes": "Kubernetes",
            "aws": "AWS",
            "azure": "Azure",
            "git": "Git",
            "github": "GitHub",
            "linux": "Linux",
            "tensorflow": "TensorFlow",
            "pytorch": "PyTorch",
        }

        self.skills = {
        "machine learning": "Machine Learning",
        "deep learning": "Deep Learning",
        "natural language processing": "Natural Language Processing",
        "nlp": "Natural Language Processing",
        "data analysis": "Data Analysis",
        "data analytics": "Data Analytics",
        "data science": "Data Science",
        "computer vision": "Computer Vision",
        "rest api": "REST API",
        "rest apis": "REST APIs",
        "api development": "API Development",
        "problem solving": "Problem Solving",
        "communication": "Communication",
        "leadership": "Leadership",
        "teamwork": "Teamwork",
        "git": "Git",
        "version control": "Version Control",
        }

        self.degrees = {
        "b.tech": "B.Tech",
        "btech": "B.Tech",
        "b. tech": "B.Tech",
        "b.e": "B.E.",
        "b.e.": "B.E.",
        "be": "B.E.",
        "bachelor of technology": "B.Tech",
        "bachelor of engineering": "B.E.",
        
        "m.tech": "M.Tech",
        "mtech": "M.Tech",
        "m. tech": "M.Tech",
        "master of technology": "M.Tech",
        
        "m.e": "M.E.",
        "m.e.": "M.E.",
        "me": "M.E.",
        "master of engineering": "M.E.",
        
        "mca": "MCA",
        "master of computer applications": "MCA",
        
        "bca": "BCA",
        "bachelor of computer applications": "BCA",
        
        "m.s": "M.S.",
        "ms": "M.S.",
        "m.s.": "M.S.",
        "master of science": "M.S.",
        
        "b.s": "B.S.",
        "bs": "B.S.",
        "b.s.": "B.S.",
        "bachelor of science": "B.S.",
        
        "phd": "PhD",
        "ph.d": "PhD",
        "ph.d.": "PhD",
        "doctor of philosophy": "PhD"
    }

        self.certifications = {
        "aws certified developer": "AWS Certified Developer",
        "aws certified solutions architect": "AWS Certified Solutions Architect",
        "aws solutions architect": "AWS Certified Solutions Architect",

        "google cloud certified": "Google Cloud Certified",
        "google professional cloud architect": "Google Professional Cloud Architect",

        "microsoft azure fundamentals": "Microsoft Azure Fundamentals",
        "azure fundamentals": "Microsoft Azure Fundamentals",

        "certified kubernetes administrator": "Certified Kubernetes Administrator",
        "cka": "Certified Kubernetes Administrator",

        "oracle certified java programmer": "Oracle Certified Java Programmer",

        "comptia security+": "CompTIA Security+",
        "comptia network+": "CompTIA Network+",

        "cisco certified network associate": "Cisco CCNA",
        "ccna": "Cisco CCNA",

        "tensorflow developer certificate": "TensorFlow Developer Certificate",
    }

        self.language_matcher = PhraseMatcher(self.nlp.vocab,
                                                attr="LOWER")

        self.technology_matcher = PhraseMatcher(self.nlp.vocab,
                                                attr="LOWER")

        self.skills_matcher = PhraseMatcher (self.nlp.vocab,
                                             attr="LOWER")

        self.degree_matcher = PhraseMatcher(self.nlp.vocab,
                                            attr="LOWER")
        self.certification_matcher= PhraseMatcher(self.nlp.vocab,
                                                  attr="LOWER")

        certification_patterns = [
            self.nlp.make_doc(term)
            for term in self.certifications.keys()
        ]

        skill_patterns = [
             self.nlp.make_doc(term)
             for term in self.skills.keys()
        ]

        degree_patterns = [
            self.nlp.make_doc(term)
            for term in self.degrees.keys()
        ]

        language_patterns= [
            self.nlp.make_doc(term)
            for term in self.programming_languages.keys()
        ]

        technology_patterns= [
                    self.nlp.make_doc(term)
                    for term in self.technologies.keys()
                ]


        self.degree_matcher.add(
            "DEGREE",
            degree_patterns
        )
        self.language_matcher.add(
            "PROGRAMMING_LANGUAGE",
            language_patterns
        )
        self.technology_matcher.add(
            "TECHNOLOGY",
            technology_patterns
        )
        self.skills_matcher.add(
             "SKILLS",
             skill_patterns
        )
        self.certification_matcher.add(
            "CERTIFATION",
            certification_patterns
        )

        self.non_organization_matcher = PhraseMatcher(
            self.nlp.vocab,
            attr="LOWER"
        )

        non_organization_terms = (
            list(self.programming_languages.keys())
            + list(self.technologies.keys())
            + list(self.skills.keys())
            + list(self.degrees.keys())
            + list(self.certifications.keys())
        )

        non_organization_patterns = [
            self.nlp.make_doc(term)
            for term in non_organization_terms
        ]

        self.non_organization_matcher.add(
            "NON_ORGANIZATION",
            non_organization_patterns
        )

    def process_text(self, text: str):
        return self.nlp(text)

    def extract_programming_languages(self, text: str):
        doc = self.nlp(text)
        matches = self.language_matcher(doc)

        found = set()

        for _, start, end in matches:
            matched_text=doc[start:end].text.lower()
            normalized = self.programming_languages[matched_text]
            found.add(normalized)
        return sorted(found)

    def extract_technologies(self, text: str):
            doc = self.nlp(text)
            matches = self.technology_matcher(doc)

            found = set()

            for _, start, end in matches:
                matched_text=doc[start:end].text.lower()
                normalized = self.technologies[matched_text]
                found.add(normalized)
            return sorted(found)


    def extract_organizations(self, text: str):
            doc = self.nlp(text)

            organizations = set()

            non_org_matches = self.non_organization_matcher(doc)

            for entity in doc.ents:
                if entity.label_ != "ORG":
                    continue

                is_non_organization = False

                for _, start, end in non_org_matches:
                    if start >= entity.start and end <= entity.end:
                        is_non_organization = True
                        break

                if is_non_organization:
                    continue

                sentence = entity.sent.text.lower()

                organization_contexts = [
                    "worked at",
                    "works at",
                    "working at",
                    "employed at",
                    "employed by",
                    "worked for",
                    "works for",
                    "working for",
                    "joined",
                    "interned at",
                    "internship at",
                    "experience at"
                ]

                has_context = any(
                    context in sentence
                    for context in organization_contexts
                )

                if has_context:
                    organizations.add(entity.text.strip())

            return sorted(organizations)

    def extract_skills (self, text:str):
         doc=self.nlp(text)
         matches = self.skills_matcher(doc)

         found = set()

         for _,start,end in matches :
              matched_text= doc[start:end].text.lower()
              normalized = self.skills[matched_text]
              found.add(normalized)

         return sorted (found)

    def extract_experience_years(self, text:str):
        text_lower=text.lower()

        patterns = [
            r'(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?|yr?|year?)\s*(?:of)?\s*(?:proffesional\s*)?(?:experience)?',
            r'(\d+(?:\.\d+)?)\+?\s*(?:month|months?)\s*(?:of)?\s*(?:proffesional\s*)?(?:experience)?'
        ]

        years = []
        for index, pattern in enumerate(patterns):
            matches = re.findall(pattern, text_lower)

            for value in matches :
                value = float(value)

                if index == 0 :
                    years.append(value)
                else:
                    years.append(value/12)

        if not years : 
            return 0

        return max(years)


    def extract_degrees(self, text:str):
        doc = self.nlp(text)

        matches = self.degree_matcher(doc)

        found = set()

        for _, start, end in matches :
            matched_text = doc [start:end].text.lower()
            normalized = self.degrees [matched_text]
            found.add(normalized)

        return sorted(found)

    def extract_certifications(self, text:str):
        doc = self.nlp (text)

        matches = self.certification_matcher(doc)

        found= set()

        for _, start, end in matches :
            matched_text = doc[start:end].text.lower()
            normalized = self.certifications[matched_text]
            found.add(normalized)

        return sorted(found)

    def extract(self, text: str):
        return {
            "organizations": self.extract_organizations(text),
            "programming_languages": self.extract_programming_languages(text),
            "technologies": self.extract_technologies(text),
            "skills": self.extract_skills(text),
            "experience_years": self.extract_experience_years(text),
            "degrees": self.extract_degrees(text),
            "certifications": self.extract_certifications(text)
        }
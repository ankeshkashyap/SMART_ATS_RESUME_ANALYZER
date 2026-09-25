from services.skill_matcher import SkillMatcher
from services.requirements_matcher import RequirementMatcher
from services.match_classifier import MatchClassifier
from services.coverage_calculator import CoverageCalculator

class CombinedMatcher :
    def __init__(self):

        self.skill_matcher = SkillMatcher()
        self.requirement_matcher = RequirementMatcher()
        self.classifier= MatchClassifier()
        self.coverage_calculator = CoverageCalculator()

    def analyze ( self , resume_text , required_skills , requirements):
            skill_result = self.skill_matcher.find_skill_variants (resume_text, required_skills)

            requirement_results = []

            for requirement in requirements :
                 result = self.requirement_matcher.match_requirement(requirement  , resume_text)

                 status = self.classifier.classify(result["similarity"])
                 result["status"] = status
                 requirement_results.append(result)
                 coverage = self.coverage_calculator.calculate(requirement_results)
                 skill_total = (len(skill_result["matched"])+ len(skill_result["unmatched"]))

                 skill_coverage= 0

                 if skill_total > 0:
                      skill_coverage+=(len(skill_result["matched"])/skill_total)*100
                
            return {
                 "skills": skill_result,
                 "requirements": requirement_results,
                 "coverage": coverage,
                 "skill_coverage":round(skill_coverage,2)
            }



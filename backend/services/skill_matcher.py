from rapidfuzz import fuzz 
from skill_variants import SKILL_VARIANTS

class SkillMatcher :

    def normalize (self, text):
        return text.lower().strip()

    def find_skill_variants (
            self,
            resume_text,
            required_skill
    ):
        resume_text = self.normalize (resume_text)

        matched = []
        unmatched = []

        for skill in required_skill:
             variants = SKILL_VARIANTS.get (
                 skill.lower(),
                 [skill]
             )

             found = False

             for variant in variants :
                 if variant.lower() in resume_text:
                     matched.append(skill)
                     found = True
                     break

             if not found :
                 for variant in variants :

                     score = fuzz.partial_ratio(
                         variant.lower(),
                         resume_text
                     )

                     if score >= 85:
                         matched.append(skill)
                         found = True
                         break

                 if not found :
                     unmatched.append(skill)

        return{
                 "matched":matched,
                 "unmatched" : unmatched
             } 

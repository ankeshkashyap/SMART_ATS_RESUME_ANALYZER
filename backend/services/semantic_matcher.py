from services.embedding_model import get_embedding_model
from rapidfuzz import fuzz

class SemanticMatcher:

    @property
    def model(self):
        return get_embedding_model()

    
    def semantic_similarity (self, resume_text , job_description ):
        embeddings = self.model.encode (
            [resume_text,job_description],
            normalize_embeddings=True
        )

        similarity = float (
            embeddings[0]@ embeddings [1]
        )
        return round (similarity*100 ,2)

    def fuzzy_similarity(self , resume_text, job_description):
        score = fuzz.token_set_ratio(
            resume_text.lower(),
            job_description.lower()
        )

        return score

    def compare (self, resume_text, job_description):

        semantic_score = self.semantic_similarity(
            resume_text,
            job_description
        )

        fuzzy_score = self.fuzzy_similarity(
            resume_text,
            job_description
        )
        return {
            "semantic_similarity": semantic_score,
            "fuzzy_similarity": fuzzy_score
        }



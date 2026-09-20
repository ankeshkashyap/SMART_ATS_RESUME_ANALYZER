from sentence_transformers import SentenceTransformer , util

class RequirementMatcher :

    def __init__(self):

        self.model = SentenceTransformer (
            "all-MiniLM-L6-v2"
        )

    def split_into_sentences (self,text):

        sentences = []

        for line in text.split ("\n"):

            line = line.strip()

            if not line :
                continue

            line = line.lstrip("•-*")

            if line.strip():
                sentences.append(line.strip())

        return sentences

    def match_requirement (
                self,
                requirement,
                resume_text
        ):
            resume_sentences = self.split_into_sentences (
                resume_text
            )

            if not resume_sentences :
                return {
                    "requirement" : requirement,
                    "best_match": None,
                    "similarity": 0
                }

            requirement_embeddings = self.model.encode (
                requirement,
                convert_to_tensor =True
                
            )

            resume_embeddings = self.model.encode (
                            resume_sentences,
                            convert_to_tensor =True
                               )

            similarities = util.cos_sim (
                requirement_embeddings,
                resume_embeddings
            )[0]

            scores = similarities.tolist()

            best_index = max(
                range(len(scores)),
                key=scores.__getitem__
            )

            best_score = scores[best_index]
            return {
                "requirement":requirement,
                "best_match": resume_sentences[best_index],
                "similarity": round (
                    best_score*100,
                    2
                )
            }


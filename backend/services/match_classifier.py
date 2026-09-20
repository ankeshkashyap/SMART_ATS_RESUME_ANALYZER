class MatchClassifier:

    def classify (self, similarity):

        if similarity >= 60:
            return "match"

        elif similarity >=45 :
            return "near_match"
        
        else:
            return "missing"

if __name__ == "__main__":

    classifier = MatchClassifier()

    test_scores = [
        86.18,
        66.38,
        61.49,
        58.05,
        30.58
    ]

    for score in test_scores:

        result = classifier.classify(score)

        print(
            f"Similarity: {score} -> {result}"
        )
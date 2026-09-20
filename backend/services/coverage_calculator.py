class CoverageCalculator:
    def calculate(self , requirement_results):
        total = len(requirement_results)
        if total == 0:
            return 0

        matched = 0
        near_matches = 0
        missing = 0

        for result in requirement_results : 

            status = result ["status"]
            if status == "match":
                matched+=1

            elif status == "near_matches":
                near_matches+=1

            else :
                missing+=1

        coverage =((matched+ 0.5*near_matches)/total)*100
        return {
                "coverage": round(coverage,2),
                "total":total,
                "matched":matched,
                "near_matches":near_matches,
                "missing":missing
            }


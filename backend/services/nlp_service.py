import spacy

class NLPService:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def process_text(self, text:str):
        doc = self.nlp(text)

        return doc
        
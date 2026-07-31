from fastapi import FastAPI 
app = FastAPI()

@app.get("/")

def home ():
    return {"message":"SMART RESUME ATS Analyser API"}
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None :
    raise ValueError("Database url not found in env")

engine = create_engine(DATABASE_URL)
try: 
    connection = engine.connect()
    print("Database Connected Successfully!")
    connection.close()

except Exception as e:
    print(e)

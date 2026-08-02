import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database.sessions import get_db
from models.users import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES","60"))

oauth2_scheme = OAuth2PasswordBearer (
    tokenUrl="/auth/login"
)

if SECRET_KEY is None:
    raise ValueError("SECRET_KEY is not set in .env")

if ALGORITHM is None:
    raise ValueError("ALGORITHM is not set in .env")

def create_access_token(data:dict):
    to_encode = data.copy()

    expire = datetime.utcnow()+ timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp":expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,#type: ignore
        algorithm=ALGORITHM #type: ignore
    )
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,#type: ignore
            algorithms=[ALGORITHM]
        )
        return payload

    except JWTError:
        return None

def get_current_user (
        token: str= Depends(oauth2_scheme),
        db:Session = Depends (get_db)
        ):
    payload = decode_access_token(token)

    if payload is None :
        raise HTTPException (
            status_code=401,
            detail="Invalid or expired token"
        )
    email= payload.get("sub")
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user
    
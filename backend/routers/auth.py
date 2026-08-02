from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserSignup, UserLogin
from models.users import User
from utils.security import hash_password, verify_password
from utils.jwt_handler import create_access_token, get_current_user

from database.sessions import get_db
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
    )

@router.post("/signup")
def signup(user: UserSignup,
           db: Session = Depends(get_db)):

    existing_user= (db.query(User)
                    .filter(User.email == user.email)
                    .first()
                    )
    if existing_user:
        raise HTTPException (
            status_code=400,
            detail="Email already registered"
        )  
    print(user.password)
    print(len(user.password))   
    hashed_password=hash_password(user.password)  

    new_user=User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    ) 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return{
        "message": "Signup successfull",
        "user": {
            "id":new_user.id,
            "name":new_user.name,
            "email":new_user.email
        }
    }

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email== user.email)
        .first()
    )
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    if not verify_password(
        user.password,
        existing_user.password_hash # type: ignore
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    access_token= create_access_token(
        data={
            "sub":existing_user.email
        }
    )
    return{
        "access_token":access_token,
        "token_type":"bearer"
    }

@router.get("/profile")
def profile (
    current_user: User = Depends(get_current_user)
):
    return{
        "id":current_user.id,
        "name":current_user.name,
        "email": current_user.email
    }
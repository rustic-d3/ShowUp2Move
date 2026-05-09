from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from auth import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from database import get_db, create_user, UserDB
from models import Token, UserCreate, UserPublic
from security import get_password_hash

app = FastAPI(title="FastAPI Auth Demo", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from security import get_password_hash

@app.post("/auth/register", response_model=UserPublic, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user = create_user(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        db=db,
    )
    return user

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=UserPublic)
def read_users_me(current_user: UserPublic = Depends(get_current_active_user)):
    return current_user


@app.get("/users/me/items")
def read_own_items(current_user: UserPublic = Depends(get_current_active_user)):
    return [{"item_id": 1, "owner": current_user.username, "name": "My Secret Item"}]
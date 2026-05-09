from sqlalchemy import create_engine, Column, String, Boolean
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
import os

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

class UserDB(Base):
    __tablename__ = "users"
    username        = Column(String, primary_key=True, index=True)
    email           = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    disabled        = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

# ── Dependency ────────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── Helper ────────────────────────────────────────────────────────────────────
def create_user(username: str, email: str, hashed_password: str, db: Session) -> UserDB:
    user = UserDB(
        username=username,
        email=email,
        hashed_password=hashed_password,
        disabled=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
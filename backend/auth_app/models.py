from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: str          
    password: str


class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str
    disabled: bool = False


class UserPublic(BaseModel):
    username: str
    email: str
    disabled: bool = False


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
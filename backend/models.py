from datetime import datetime
from typing import Optional, List
from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, Field, BeforeValidator

# MongoDB ObjectId helper
PyObjectId = Annotated[str, BeforeValidator(str)]

class TeacherModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    password_hash: str
    school: str
    preferred_language: str = "en"
    profile_picture: Optional[str] = None

class AdminSessionModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    school: str
    preferred_language: str
    login_time: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str
    preferred_language: Optional[str] = "en"
    role: Optional[str] = None

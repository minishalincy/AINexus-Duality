from fastapi import APIRouter, HTTPException, status
from models import AdminSessionModel, Token
from database import admin_collection
from auth import create_access_token
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

class AdminLoginSchema(BaseModel):
    email: EmailStr
    password: str
    school: str # Admin selects school on login
    preferred_language: str

@router.post("/login", response_model=Token)
async def login_admin(credentials: AdminLoginSchema):
    # Verify Credentials against Env
    if credentials.email != ADMIN_EMAIL or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect admin credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Store Session in Admins Collection
    new_session = AdminSessionModel(
        email=credentials.email,
        school=credentials.school,
        preferred_language=credentials.preferred_language
    )
    
    await admin_collection.insert_one(new_session.model_dump(by_alias=True, exclude={"id"}))

    # Create JWT
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": credentials.email, "role": "admin", "school": credentials.school}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "preferred_language": credentials.preferred_language, # Or fetch from existing session if logic changes, but here we just used creds
        "role": "admin"
    }

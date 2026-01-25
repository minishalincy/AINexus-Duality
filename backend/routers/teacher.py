from fastapi import APIRouter, HTTPException, status, Depends, Body
from models import TeacherModel, Token
from database import teacher_collection
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class TeacherRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    school: str
    preferred_language: str

class TeacherLoginSchema(BaseModel):
    email: EmailStr
    password: str
    school: Optional[str] = None # Optional for login check, but good if we enforce school match

class TeacherProfileUpdateSchema(BaseModel):
    name: str
    profile_picture: Optional[str] = None

@router.get("/profile", response_model=TeacherModel)
async def get_profile(current_user: dict = Depends(get_current_user)):
    teacher = await teacher_collection.find_one({"email": current_user["email"]})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.put("/profile", response_model=TeacherModel)
async def update_profile(
    update_data: TeacherProfileUpdateSchema,
    current_user: dict = Depends(get_current_user)
):
    teacher = await teacher_collection.find_one({"email": current_user["email"]})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    update_fields = {
        "name": update_data.name,
        "profile_picture": update_data.profile_picture
    }
    
    # Only update fields that are provided
    update_fields = {k: v for k, v in update_fields.items() if v is not None}

    await teacher_collection.update_one(
        {"email": current_user["email"]},
        {"$set": update_fields}
    )
    
    updated_teacher = await teacher_collection.find_one({"email": current_user["email"]})
    return updated_teacher

@router.post("/register", response_model=Token)
async def register_teacher(teacher: TeacherRegisterSchema):
    # Check if teacher exists
    existing_teacher = await teacher_collection.find_one({"email": teacher.email})
    if existing_teacher:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = get_password_hash(teacher.password)
    
    # Create teacher document
    new_teacher = TeacherModel(
        name=teacher.name,
        email=teacher.email,
        password_hash=hashed_password,
        school=teacher.school,
        preferred_language=teacher.preferred_language
    )
    
    # Insert into DB
    result = await teacher_collection.insert_one(new_teacher.model_dump(by_alias=True, exclude={"id"}))
    
    # Create JWT
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": teacher.email, "role": "teacher"}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login_teacher(credentials: TeacherLoginSchema):
    teacher = await teacher_collection.find_one({"email": credentials.email})
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(credentials.password, teacher["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Optional: Verify school if passed
    if credentials.school and credentials.school != teacher["school"]:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="School does not match records",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": credentials.email, "role": "teacher"}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "preferred_language": teacher.get("preferred_language", "en"),
        "role": "teacher"
    }

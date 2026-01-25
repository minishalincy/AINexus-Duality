from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from database import reminders_collection
from auth import get_current_user
import uuid

router = APIRouter()

class Reminder(BaseModel):
    id: str
    date: str # YYYY-MM-DD
    time: Optional[str] = None # HH:MM
    text: str
    teacher_email: Optional[str] = None

class CreateReminder(BaseModel):
    date: str
    time: Optional[str] = None
    text: str

@router.get("/reminders", response_model=List[Reminder])
async def get_reminders():
    # user: dict = Depends(get_current_user)
    try:
        cursor = reminders_collection.find({"teacher_email": "demo_teacher@school.com"})
        items = await cursor.to_list(length=100)
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reminders", response_model=Reminder)
async def add_reminder(data: CreateReminder):
    # user: dict = Depends(get_current_user)
    try:
        new_item = {
            "id": uuid.uuid4().hex,
            "date": data.date,
            "time": data.time,
            "text": data.text,
            "teacher_email": "demo_teacher@school.com"
        }
        await reminders_collection.insert_one(new_item)
        if "_id" in new_item: del new_item["_id"]
        return new_item
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str):
    # user: dict = Depends(get_current_user)
    result = await reminders_collection.delete_one({"id": reminder_id, "teacher_email": "demo_teacher@school.com"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return {"message": "Deleted"}

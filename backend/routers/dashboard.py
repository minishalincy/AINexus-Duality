from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from typing import List, Optional
from database import notes_collection, tasks_collection, subjects_collection
from datetime import datetime
import uuid

router = APIRouter()

# Models
class Note(BaseModel):
    id: str
    text: str
    date: str
    type: str # Critical, Observation, Success, AI Insight
    data: Optional[dict] = None # For AI reflection data

class Task(BaseModel):
    id: str
    title: str
    date: str
    type: str # holiday, work

class CreateSubject(BaseModel):
    grade: str
    section: str
    subject: str

class Subject(CreateSubject):
    id: str
    completed_chapters: List[int] = []

# --- Notes ---
@router.get("/notes", response_model=List[Note])
async def get_notes():
    cursor = notes_collection.find().sort("date", -1).limit(20)
    notes = await cursor.to_list(length=20)
    return notes

@router.post("/notes")
async def add_note(note: Note):
    # If ID not provided, generate? Frontend sends ID based on Date.now() usually
    await notes_collection.insert_one(note.model_dump())
    return {"message": "Note added"}

# --- Tasks ---
@router.get("/tasks")
async def get_tasks():
    cursor = tasks_collection.find()
    tasks = await cursor.to_list(length=100)
    # Return as list, frontend maps by date
    return tasks

@router.post("/tasks")
async def add_task(task: Task):
    await tasks_collection.insert_one(task.model_dump())
    return {"message": "Task added"}

# --- Subjects ---
@router.get("/subjects")
async def get_subjects():
    cursor = subjects_collection.find()
    subs = await cursor.to_list(length=50)
    return subs

@router.post("/subjects")
async def add_subject(sub: CreateSubject):
    new_sub = sub.model_dump()
    new_sub["id"] = f"{sub.grade}{sub.section}-{sub.subject.lower()}-{uuid.uuid4().hex[:6]}"
    new_sub["completed_chapters"] = []
    await subjects_collection.insert_one(new_sub)
    return new_sub

@router.post("/subjects/{sub_id}/progress")
async def update_progress(sub_id: str, completed_chapters: List[int]):
    result = await subjects_collection.update_one(
        {"id": sub_id},
        {"$set": {"completed_chapters": completed_chapters}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"message": "Progress updated"}

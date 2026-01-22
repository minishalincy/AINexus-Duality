from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from database import feedback_collection
from auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter()

class FeedbackResponse(BaseModel):
    acknowledgement: str
    deep_dive: str
    quick_fix: str
    tomorrow_prep: str
    pro_tip: str

class FeedbackItem(BaseModel):
    id: str
    date: str
    preview: str
    type: str # Critical, Observation, Success
    full_text: str
    language: str
    analysis: FeedbackResponse
    effectiveness: Optional[str] = None # "yes", "no"
    teacher_email: str

class RateFeedbackRequest(BaseModel):
    successful: bool

@router.get("/list", response_model=List[FeedbackItem])
async def get_feedback():
    # user: dict = Depends(get_current_user) # Removed for demo consistency
    cursor = feedback_collection.find({"teacher_email": "demo_teacher@school.com"}).sort("date", -1)
    items = await cursor.to_list(length=50)
    return items

@router.post("/analyze")
async def analyze_feedback(
    message: str = Form(...),
    language: str = Form("en")
):
    # Mock AI Analysis Logic
    # In a real app, this would call OpenAI/Gemini with the text and language
    # and return a structured JSON.
    
    analysis = {
        "acknowledgement": f"I hear you. Dealing with classroom noise in {language} context is tough.",
        "deep_dive": "The students might be disengaged because the lesson pace is too slow or the activity is unstructured.",
        "quick_fix": "Use a 'Attention Signal' (like a clap pattern) to regain focus instantly.",
        "tomorrow_prep": "Prepare a hands-on activity that requires quiet focus to balance the energy.",
        "pro_tip": "Reward the first group that settles down with points."
    }
    
    # Determine type based on sentiment (mock)
    feedback_type = "Observation"
    if "noisy" in message.lower() or "chaotic" in message.lower():
        feedback_type = "Critical"
    elif "great" in message.lower() or "happy" in message.lower():
        feedback_type = "Success"

    # Create and Save Record
    new_item = {
        "id": uuid.uuid4().hex,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "preview": message[:40] + "..." if len(message) > 40 else message,
        "type": feedback_type,
        "full_text": message,
        "language": language,
        "analysis": analysis,
        "effectiveness": None,
        "teacher_email": "demo_teacher@school.com" # Mock email since we removed auth
    }
    
    await feedback_collection.insert_one(new_item)
    if "_id" in new_item: del new_item["_id"]
    
    return new_item

@router.patch("/{id}/rate")
async def rate_feedback(id: str, payload: RateFeedbackRequest, user: dict = Depends(get_current_user)):
    result = await feedback_collection.update_one(
        {"id": id, "teacher_email": user["email"]},
        {"$set": {"effectiveness": "yes" if payload.successful else "no"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return {"message": "Rating saved"}

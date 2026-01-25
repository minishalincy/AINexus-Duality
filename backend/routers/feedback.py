from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from database import feedback_collection
from auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter()

from google import genai
from google.genai import types
import os
import json

class FeedbackResponse(BaseModel):
    good_things: str
    bad_things: str
    improvement: str

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
    language: str = Form("en"),
    feedback_id: Optional[str] = Form(None)
):
    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    client = None
    if GEMINI_KEY:
        try:
            client = genai.Client(api_key=GEMINI_KEY)
        except Exception as e:
            print(f"Gemini Client Init Error: {e}")
            raise HTTPException(status_code=500, detail="AI Service Config Error")
    else:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY missing")

    # Prompt Engineering
    if feedback_id:
        # RETRY MODE: Concise Bullet Points
        PROMPT = f"""
        You are an expert teacher mentor. This is a RE-ANALYSIS for a teacher who needed more clarity.
        
        Teacher Input:
        "{message}"
        
        Language: {language}
        
        Task:
        1. good_things: List 4-5 BRIEF bullet points of good things.
        2. bad_things: List 4-5 BRIEF bullet points of areas of concern.
        3. improvement: List 4-5 BRIEF bullet points of suggestions.
        
        CONSTRAINTS:
        - STRICTLY bullet points.
        - NO paragraphs.
        - Concise and direct.
        
        Structure your response as a JSON object with these EXACT keys:
        - good_things
        - bad_things
        - improvement
        
        IMPORTANT: The content of the values MUST be in the requested language ({language}).
        """
    else:
        # INITIAL MODE: Standard Analysis (Short Paragraphs)
        PROMPT = f"""
        You are an expert teacher mentor. Analyze the following teacher's reflection/input properly.
        
        Teacher Input:
        "{message}"
        
        Language: {language}
        
        Task:
        1. good_things: Analyze the good things the teacher did. (Short paragraph).
        2. bad_things: Analyze areas of concern or mistakes. (Short paragraph).
        3. improvement: Provide detailed improvement suggestions. (Short paragraph).
        
        Structure your response as a JSON object with these EXACT keys:
        - good_things
        - bad_things
        - improvement
        
        IMPORTANT: The content of the values MUST be in the requested language ({language}).
        """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=PROMPT,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        generated_text = response.text.strip()
        # Clean markdown code blocks if present
        if generated_text.startswith("```"):
            generated_text = generated_text.replace("```json", "").replace("```", "").strip()
        
        analysis_data = json.loads(generated_text)
        
    except Exception as e:
        print(f"AI Generation Error: {e}")
        # Fallback for error handling
        analysis_data = {
            "good_things": "Unable to analyze at this moment.",
            "bad_things": "Please try again.",
            "improvement": "Server error."
        }

    # Determine type based on simple heuristic or could ask AI
    feedback_type = "Observation" 
    
    if feedback_id:
        # UPDATE existing record
        await feedback_collection.update_one(
            {"id": feedback_id, "teacher_email": "demo_teacher@school.com"},
            {"$set": {"analysis": analysis_data, "date": datetime.now().strftime("%Y-%m-%d")}}
        )
        # Fetch updated item to return
        updated_item = await feedback_collection.find_one({"id": feedback_id})
        if updated_item:
            if "_id" in updated_item: del updated_item["_id"]
            return updated_item
        else:
             raise HTTPException(status_code=404, detail="Feedback ID not found for update")

    # Create and Save Record
    new_id = uuid.uuid4().hex
    new_item = {
        "id": new_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "preview": message[:40] + "..." if len(message) > 40 else message,
        "type": feedback_type,
        "full_text": message,
        "language": language,
        "analysis": analysis_data,
        "effectiveness": None,
        "teacher_email": "demo_teacher@school.com" 
    }
    
    await feedback_collection.insert_one(new_item)
    if "_id" in new_item: del new_item["_id"]
    
    return new_item

@router.patch("/{id}/rate")
async def rate_feedback(id: str, payload: RateFeedbackRequest):
    result = await feedback_collection.update_one(
        {"id": id, "teacher_email": "demo_teacher@school.com"},
        {"$set": {"effectiveness": "yes" if payload.successful else "no"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return {"message": "Rating saved"}

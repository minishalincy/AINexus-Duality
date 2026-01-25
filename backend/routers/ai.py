import os
import requests
import json
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from google import genai
from google.genai import types
from langdetect import detect, LangDetectException
from dotenv import load_dotenv
from typing import Optional
from io import BytesIO
from PIL import Image

load_dotenv()

router = APIRouter()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
HF_KEY = os.getenv("HF_API_KEY")

# Initialize Gemini Client
client = None
if GEMINI_KEY:
    try:
        client = genai.Client(api_key=GEMINI_KEY)
    except Exception as e:
        print(f"Gemini Client Init Error: {e}")
else:
    print("Warning: GEMINI_API_KEY not found in env")

# Prompts
SYSTEM_PROMPT = """
AI Teaching Assistant (Instant Classroom Help)

Your Goal: Give teachers a 5-second answer they can use IMMEDIATELY in class.
Constraint: MAX 5 LINES. No long paragraphs.
IMPORTANT: You must respond in the SAME LANGUAGE as the user's message. 
- If the user writes in Kannada, respond in Kannada.
- If the user writes in Hindi, respond in Hindi.
- If the language is explicitly specified, use that language.

Mandatory Structure:
1. 💡 Simple Concept: One sentence, no jargon.
2. 🎒 Quick Action: One physical demo using specific classroom items (pen, paper, board, students). BE SPECIFIC on what to move or show.

Example Request: "Explain Friction."
Example Output:
💡 Friction is the 'grip' that stops things from sliding forever.
🎒 Activity: Have a student slide a book on the smooth desk (easy), then slide it on a rough bag (hard).
"""

# ... (rest of file until chat function end)


REFLECTION_SYSTEM_PROMPT = """
You are a supportive senior teacher mentor.
Analyze the teacher's reflection and output a JSON response with these exact keys:
{
  "acknowledgement": "One sentence celebrating a success.",
  "deep_dive": "A detailed solution for the main issue mentioned.",
  "quick_fix": "A short, immediate action for a secondary issue.",
  "tomorrow_prep": "One tip to prepare for tomorrow.",
  "pro_tip": "A short, clever teaching hack."
}
Tone: Encouraging, practical, and concise.
IMPORTANT: The values in the JSON must be in the SAME LANGUAGE as the user's input.
"""

# Translation Config
HF_HEADERS = {"Authorization": f"Bearer {HF_KEY}"}

LANG_MAP = {
    "kn": "kan_Knda", "hi": "hin_Deva", "ta": "tam_Taml", "te": "tel_Telu",
    "ml": "mal_Mlym", "mr": "mar_Deva", "bn": "ben_Beng", "gu": "guj_Gujr",
    "pa": "pan_Guru", "or": "ory_Orya", "ur": "urd_Arab", "en": "eng_Latn"
}

LANG_NAMES = {
    "kn": "Kannada", "hi": "Hindi", "ta": "Tamil", "te": "Telugu",
    "ml": "Malayalam", "mr": "Marathi", "bn": "Bengali", "gu": "Gujarati",
    "pa": "Punjabi", "or": "Odia", "ur": "Urdu", "en": "English"
}

def translate(text, model, src_lang, tgt_lang):
    url = f"https://router.huggingface.co/models/{model}"
    payload = {
        "inputs": text,
        "parameters": {
            "src_lang": src_lang,
            "tgt_lang": tgt_lang
        }
    }
    
    try:
        r = requests.post(url, headers=HF_HEADERS, json=payload, timeout=60)
        data = r.json()
        if isinstance(data, list) and len(data) > 0:
            return data[0]["translation_text"]
        elif isinstance(data, dict) and "error" in data:
            print(f"HF Error: {data['error']}")
            return text 
        return text
    except Exception as e:
        print(f"Translation Exception: {e}")
        return text

# Legacy functions preserved if needed, but not used in main flow anymore
def to_english(text, lang):
    if lang == "en":
        return text
    src_code = LANG_MAP.get(lang, "kan_Knda") 
    return translate(text, "facebook/nllb-200-distilled-600M", src_code, "eng_Latn")

def from_english(text, lang):
    if lang == "en":
        return text
    tgt_code = LANG_MAP.get(lang, "kan_Knda")
    return translate(text, "facebook/nllb-200-distilled-600M", "eng_Latn", tgt_code)

def translate_json(data, lang):
    if lang == "en":
        return data
    translated = {}
    for key, value in data.items():
        if isinstance(value, str):
            translated[key] = from_english(value, lang)
        else:
            translated[key] = value
    return translated

@router.post("/chat")
async def chat(
    message: Optional[str] = Form(None), 
    image: Optional[UploadFile] = File(None),
    language: Optional[str] = Form("en"),
    mode: Optional[str] = Form("chat")
):
    try:
        if not client:
             return {"reply": "Server misconfiguration: API Key missing or Client failed."}

        if not message and not image:
            return {"reply": "Please provide a message or an image."}

        # 1. Determine Language Name for Prompting
        lang_code = language if language in LANG_NAMES else "en"
        lang_name = LANG_NAMES.get(lang_code, "English")
        
        # 2. Prepare Content
        chat_content = []
        
        if mode == "reflection":
            chat_content.append(REFLECTION_SYSTEM_PROMPT)
            chat_content.append(f"User Language Preference: {lang_name}")
            chat_content.append(f"Teacher Reflection:\n{message}")
            if image:
                 chat_content.append("(Context image provided)")
        else:
            chat_content.append(SYSTEM_PROMPT)
            chat_content.append(f"User Language Preference: {lang_name}")
            chat_content.append(f"Teacher question:\n{message}")

        if image:
            try:
                img_data = await image.read()
                img = Image.open(BytesIO(img_data))
                chat_content.append(img)
            except Exception as e:
                print(f"Image processing error: {e}")

        # 3. Generate Content
        config = None
        if mode == "reflection":
            config = types.GenerateContentConfig(
                response_mime_type="application/json"
            )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=chat_content,
            config=config
        )
        
        # 4. Process Response
        generated_text = response.text.strip()

        if mode == "reflection":
            try:
                # Gemini usually respects the JSON instruction, but in the requested language
                json_response = json.loads(generated_text)
                return {"reply": json_response, "type": "json"}
            except json.JSONDecodeError:
                return {"reply": {"acknowledgement": generated_text}, "type": "json"}
        else:
            # Direct response (multilingual by default now)
            return {"reply": generated_text, "type": "text"}

    except Exception as e:
        print(f"Chat Error: {e}")
        return {"reply": f"Sorry, I encountered an error: {str(e)}"}

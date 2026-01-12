import os
import requests
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
import google.generativeai as genai
from langdetect import detect, LangDetectException
from dotenv import load_dotenv
from typing import Optional
from io import BytesIO
from PIL import Image

load_dotenv()

router = APIRouter()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
HF_KEY = os.getenv("HF_API_KEY")

# Configure Gemini
if not GEMINI_KEY:
    print("Warning: GEMINI_API_KEY not found in env")
else:
    genai.configure(api_key=GEMINI_KEY)

SYSTEM_PROMPT = """
You are TeacherAI.

Rules:
- Answer ONLY teacher-related questions.
- Give exactly 5 short bullet points.
- Each bullet must be one short sentence.
- Do not write paragraphs.

If not teaching-related, reply:
"I am a teacher-only AI. Please ask a question related to teaching or classrooms."
"""

HF_HEADERS = {"Authorization": f"Bearer {HF_KEY}"}

LANG_MAP = {
    "kn": "kan_Knda", "hi": "hin_Deva", "ta": "tam_Taml", "te": "tel_Telu",
    "ml": "mal_Mlym", "mr": "mar_Deva", "bn": "ben_Beng", "gu": "guj_Gujr",
    "pa": "pan_Guru", "or": "ory_Orya", "ur": "urd_Arab", "en": "eng_Latn"
}

def translate(text, model, src_lang, tgt_lang):
    # Updated URL to the router endpoint
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

def to_english(text, lang):
    if lang == "en":
        return text
    src_code = LANG_MAP.get(lang, "kan_Knda") 
    # Model: NLLB
    return translate(text, "facebook/nllb-200-distilled-600M", src_code, "eng_Latn")

def from_english(text, lang):
    if lang == "en":
        return text
    tgt_code = LANG_MAP.get(lang, "kan_Knda")
    # Model: NLLB
    return translate(text, "facebook/nllb-200-distilled-600M", "eng_Latn", tgt_code)

@router.post("/chat")
async def chat(
    message: Optional[str] = Form(None), 
    image: Optional[UploadFile] = File(None),
    language: Optional[str] = Form("en")
):
    try:
        if not message and not image:
            return {"reply": "Please provide a message or an image."}

        # 1. Determine Language
        lang = language if language in LANG_MAP else "en"
        english_message = ""
        
        if message:
            # Only use detection if language is not explicitly provided or is 'en' (optional fallback logic)
            # But the user explicitly selects language in UI, so we should trust 'language' param if it's not 'en'
            # Or just trust it completely if valid.
            
            # If the user selected 'en' but types in Kannada, maybe we should still detect? 
            # User requirement: "i changed the language to kannada... make it work".
            # So if specific lang provided, use it.
            
            if lang == "en":
                 try:
                    detected = detect(message)
                    if detected in LANG_MAP:
                        lang = detected
                 except:
                    pass

            english_message = to_english(message, lang)

        # 2. Prepare Gemini Model
        # Try a generally available model alias
        model_name = 'gemini-flash-latest'
        
        try:
             model = genai.GenerativeModel(model_name)
        except Exception:
             print(f"Model {model_name} not found, trying fallback.")
             model = genai.GenerativeModel('gemini-pro')

        chat_content = []
        chat_content.append(SYSTEM_PROMPT)
        if english_message:
            chat_content.append(f"Teacher question:\n{english_message}")

        if image:
            try:
                # Read image
                img_data = await image.read()
                # Open with PIL to verify/format
                img = Image.open(BytesIO(img_data))
                chat_content.append(img)
                chat_content.append("(An image was also provided by the teacher)")
            except Exception as e:
                print(f"Image processing error: {e}")
                return {"reply": "Error processing image."}

        # 3. Generate Content
        response = model.generate_content(chat_content)
        
        # 4. Process Response
        generated_text = response.text.strip()
        lines = [l for l in generated_text.split("\n") if l.strip()]
        # Take first 5 lines per rules
        limited_lines = lines[:5]
        english_answer = "\n".join(limited_lines)

        # 5. Translate Back
        final_reply = from_english(english_answer, lang)
        
        return {"reply": final_reply}

    except Exception as e:
        print(f"Chat Error: {e}")
        return {"reply": f"Sorry, I encountered an error: {str(e)}"}

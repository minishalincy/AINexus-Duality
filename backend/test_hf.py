import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_KEY = os.getenv("HF_API_KEY")
HF_HEADERS = {"Authorization": f"Bearer {HF_KEY}"}

def test_model(model, inputs, params=None):
    print(f"Testing model: {model}")
    url = f"https://router.huggingface.co/models/{model}"
    # url = f"https://api-inference.huggingface.co/models/{model}"
    
    payload = {"inputs": inputs}
    if params:
        payload["parameters"] = params
        
    try:
        r = requests.post(url, headers=HF_HEADERS, json=payload, timeout=30)
        print(f"Status Code: {r.status_code}")
        print(f"Content Type: {r.headers.get('content-type', 'unknown')}")
        try:
            print("Response JSON:", r.json())
        except:
            print("Response Text (First 200 chars):", r.text[:200])
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)

# Test 1: IndicTrans2 (Multilingual) - English to Kannada
test_model(
    "ai4bharat/indictrans2-en-indic-1B", 
    "Hello teacher", 
    {"src_lang": "eng_Latn", "tgt_lang": "kan_Knda"}
)

# Test 2: The old format user mentioned (just to check if it redirects)
test_model(
    "ai4bharat/indictrans2-en-kan",
    "Hello teacher"
)

# Test 3: NLLB (Fallback option)
test_model(
    "facebook/nllb-200-distilled-600M",
    "Hello teacher",
    {"src_lang": "eng_Latn", "tgt_lang": "kan_Knda"}
)

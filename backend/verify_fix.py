import requests
import os
from dotenv import load_dotenv
from auth import create_access_token

load_dotenv()

def verify():
    # Generate token
    token = create_access_token({"sub": "test@example.com", "role": "teacher"})
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. GET /subjects
    try:
        url = "http://localhost:8000/api/dashboard/subjects"
        print(f"GET {url}...")
        res = requests.get(url, headers=headers)
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            print("Response:", res.json())
            print("GET Success!")
        else:
            print("GET Failed:", res.text)
    except Exception as e:
        print(f"GET Request failed: {e}")

    # 2. POST /subjects
    try:
        url = "http://localhost:8000/api/dashboard/subjects"
        data = {"grade": "9", "section": "A", "subject": "Physics"}
        print(f"\nPOST {url} with {data}...")
        res = requests.post(url, json=data, headers=headers)
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            print("Response:", res.json())
            print("POST Success!")
        else:
            print("POST Failed:", res.text)
    except Exception as e:
        print(f"POST Request failed: {e}")

if __name__ == "__main__":
    verify()

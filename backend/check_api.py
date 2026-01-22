
import requests

BASE_URL = "http://127.0.0.1:8000"

def test_root():
    try:
        print("Testing GET /...")
        r = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Root Check Failed: {e}")

def test_get_subjects():
    try:
        print("\nTesting GET /items...")
        r = requests.get(f"{BASE_URL}/items")
        print(f"Status Code: {r.status_code}")
        print(f"Headers: {r.headers}")
        print(f"Content: {r.content}")
    except Exception as e:
        print(f"GET Failed: {e}")

def test_post_subject():
    try:
        print("\nTesting POST /api/dashboard/subjects...")
        payload = {
            "grade": "8",
            "section": "Z",
            "subject": "TestSubject"
        }
        headers = {"Content-Type": "application/json"}
        r = requests.post(f"{BASE_URL}/api/dashboard/subjects", json=payload, headers=headers)
        print(f"Status Code: {r.status_code}")
        try:
            print(f"Response JSON: {r.json()}")
        except:
            print(f"Response Text: {r.text}")
    except Exception as e:
        print(f"POST Failed: {e}")


def test_ping():
    try:
        print("\nTesting GET /api/test/ping...")
        r = requests.get(f"{BASE_URL}/api/test/ping")
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Ping Failed: {e}")

if __name__ == "__main__":
    test_root()
    test_get_subjects()
    test_post_subject()


from fastapi.testclient import TestClient
from main import app
import sys

# client = TestClient(app)

def test_dashboard():
    print("Testing /api/dashboard/subjects_test")
    try:
        response = client.get("/api/dashboard/subjects_test")
        print(f"Status: {response.status_code}")
        print(f"Content: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("FINISHED IMPORTING MAIN")
    # test_dashboard()

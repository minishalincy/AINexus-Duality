
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "Root"}

@app.get("/items")
def read_item():
    return {"item": "Works"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
